/**
 * API智能代理检测机制
 * 自动判断是否需要转换外部API请求为本地代理路径
 */
class APIProxyDetector {
  constructor() {
    // 代理配置，从环境变量或配置文件中读取
    try {
      this.proxyEnabled = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_PROXY_ENABLED === 'true') || false;
    } catch (e) {
      this.proxyEnabled = false;
    }
    
    try {
      this.proxyUrl = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_PROXY_URL) || '/api/proxy';
    } catch (e) {
      this.proxyUrl = '/api/proxy';
    }
    
    this.developmentMode = (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'development') || true; // 默认在开发模式
  }

  /**
   * 检测是否需要代理
   * @param {string} apiUrl - 原始API地址
   * @returns {boolean} 是否需要代理
   */
  needsProxy(apiUrl) {
    // 在开发环境中总是启用代理以绕过CORS
    if (this.developmentMode) {
      // 如果API地址是外部地址（包含协议和域名），则需要代理
      if (this.isExternalUrl(apiUrl)) {
        return true;
      }
      // 如果是相对路径，检查是否匹配需要代理的路径模式
      return this.matchesProxyPattern(apiUrl);
    }
    
    // 在生产环境中，根据配置决定是否启用代理
    if (this.proxyEnabled) {
      return this.isExternalUrl(apiUrl) || this.matchesProxyPattern(apiUrl);
    }
    
    return this.isExternalUrl(apiUrl);
  }

  /**
   * 检查URL是否匹配需要代理的路径模式
   * @param {string} apiUrl - API地址
   * @returns {boolean} 是否匹配代理模式
   */
  matchesProxyPattern(apiUrl) {
    // 检查是否匹配常见的API路径模式
    const proxyPatterns = ['/api', '/v1', '/v1/', '/chat/completions', '/models'];
    return proxyPatterns.some(pattern => 
      apiUrl === pattern || 
      apiUrl.startsWith(pattern + '/') ||
      (pattern.endsWith('/') && apiUrl.startsWith(pattern))
    );
  }

  /**
   * 检测是否为外部URL
   * @param {string} url - URL地址
   * @returns {boolean} 是否为外部URL
   */
  isExternalUrl(url) {
    if (!url) return false;
    
    // 检查是否包含协议（http:// 或 https://）
    const hasProtocol = /^https?:\/\//.test(url);
    if (!hasProtocol) return false;
    
    // 检查是否为外部域名
    try {
      const urlObj = new URL(url);
      const currentHost = window.location.host;
      return urlObj.host !== currentHost;
    } catch (e) {
      // 如果URL格式不正确，视为外部URL
      return true;
    }
  }

  /**
   * 获取代理后的URL
   * @param {string} originalUrl - 原始URL
   * @returns {string} 代理后的URL
   */
  getProxiedUrl(originalUrl) {
    if (!this.needsProxy(originalUrl)) {
      return originalUrl;
    }

    // 对于外部URL，我们需要将其转换为相对路径，让Vite代理处理
    // 从形如 https://example.com/v1/models 的URL中提取路径部分 /v1/models
    try {
      const urlObj = new URL(originalUrl);
      return urlObj.pathname + urlObj.search;
    } catch (e) {
      console.error('解析URL失败:', originalUrl, e);
      // 如果URL格式不正确，返回原始URL
      return originalUrl;
    }
  }

  /**
   * 创建代理请求的fetch选项
   * @param {Object} originalOptions - 原始fetch选项
   * @param {string} apiUrl - API地址
   * @returns {Object} 代理请求的fetch选项
   */
  getProxyRequestOptions(originalOptions, apiUrl) {
    if (!this.needsProxy(apiUrl)) {
      return originalOptions;
    }

    // 修改请求头，移除可能导致CORS问题的headers
    const modifiedOptions = { ...originalOptions };
    
    if (modifiedOptions.headers) {
      // 在代理模式下，某些头部可能会导致问题
      const safeHeaders = { ...modifiedOptions.headers };
      
      // 删除可能引起CORS预检错误的头部
      delete safeHeaders['authorization']; // 代理会处理认证
      delete safeHeaders['content-type']; // 由fetch自动设置
      
      // 重新设置安全的头部
      modifiedOptions.headers = {
        ...safeHeaders,
        'X-Original-URL': apiUrl, // 传递原始URL给代理
        'Content-Type': 'application/json' // 设置标准内容类型
      };
    } else {
      modifiedOptions.headers = {
        'X-Original-URL': apiUrl,
        'Content-Type': 'application/json'
      };
    }

    return modifiedOptions;
  }

  /**
   * 智能代理fetch函数
   * @param {string} url - 请求URL
   * @param {Object} options - fetch选项
   * @returns {Promise} fetch Promise
   */
  async fetch(url, options = {}) {
    if (this.needsProxy(url)) {
      const proxyUrl = this.getProxiedUrl(url);
      const proxyOptions = this.getProxyRequestOptions(options, url);
      console.log(`代理请求: ${url} -> ${proxyUrl}`);
      return fetch(proxyUrl, proxyOptions);
    }
    
    console.log(`直连请求: ${url}`);
    return fetch(url, options);
  }
}

// 创建全局实例
const apiProxyDetector = new APIProxyDetector();

export default apiProxyDetector;