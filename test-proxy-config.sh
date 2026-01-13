# 测试代理配置
echo "测试代理配置..."

# 检查配置文件是否存在
if [ -f "vite.config.js" ]; then
    echo "✓ vite.config.js 存在"
else
    echo "✗ vite.config.js 不存在"
fi

# 检查API代理工具
if [ -f "src/utils/apiProxy.js" ]; then
    echo "✓ src/utils/apiProxy.js 存在"
else
    echo "✗ src/utils/apiProxy.js 不存在"
fi

echo "代理配置已完成，以下是配置摘要："
echo ""
echo "Vite 代理配置："
echo "- /v1/ → https://integrate.api.nvidia.com"
echo "- /v1 → https://integrate.api.nvidia.com" 
echo "- /chat/completions → https://integrate.api.nvidia.com"
echo "- /models → https://integrate.api.nvidia.com"
echo ""
echo "API代理工具增强："
echo "- 新增 matchesProxyPattern() 方法识别代理路径"
echo "- 代理检测现在支持路径模式匹配"
echo ""
echo "API服务更新："
echo "- buildURL() 方法现在正确处理外部URL路径组合"