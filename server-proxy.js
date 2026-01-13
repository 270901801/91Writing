/**
 * API代理服务器示例
 * 此文件用于演示如何在后端设置代理
 * 在实际部署时，可以在Node.js服务器或Nginx中配置代理
 */

// 注意：这是示例代码，在Vite开发环境下通常不需要此文件
// Vite的代理配置在vite.config.js中已处理
console.log('API代理服务器配置说明：');
console.log('1. 在生产环境中，您可能需要在Web服务器（如Nginx）中配置代理');
console.log('2. 在Node.js后端应用中，可以使用http-proxy-middleware等库');

// 示例Nginx配置
const nginxConfig = `
server {
    listen 80;
    server_name your-domain.com;

    location / {
        root /path/to/your/vue/dist;
        try_files $uri $uri/ /index.html;
    }

    # 代理API请求
    location ^~/api/ {
        rewrite ^/api/(.*)$ /$1 break;
        proxy_pass http://your-api-server.com;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # 代理OpenAI API
    location ^~/v1/ {
        proxy_pass http://your-openai-proxy.com;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
`;

console.log('Nginx代理配置示例：');
console.log(nginxConfig);

export default {};