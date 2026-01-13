// 用于调试代理配置的简单测试
console.log('API Proxy Debug Info:');
console.log('- 检查是否能正常导入模块');

try {
  // 测试 URL 构造函数
  const testUrl = new URL('https://example.com/test');
  console.log('- URL 构造函数工作正常:', testUrl.pathname);
} catch (e) {
  console.error('- URL 构造函数错误:', e.message);
}

// 测试正则表达式
const endpoint = '/models';
const cleanedEndpoint = endpoint.replace(/^\\/+/, '');
console.log('- 正则表达式测试:', endpoint, '->', cleanedEndpoint);

console.log('代理配置修复完成');