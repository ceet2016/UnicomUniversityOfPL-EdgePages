# 部署文档

> 波兰联通大学官方网站 — 生产环境部署指南

---

## 目录

- [部署架构概览](#部署架构概览)
- [环境要求](#环境要求)
- [部署方式一：Nginx + Node.js（推荐）](#部署方式一nginx--nodejs推荐)
- [部署方式二：Docker 容器化](#部署方式二docker-容器化)
- [部署方式三：CloudStudio 沙箱预览](#部署方式三cloudstudio-沙箱预览)
- [部署方式四：宝塔面板](#部署方式四宝塔面板)
- [Nginx 完整配置参考](#nginx-完整配置参考)
- [后端服务管理](#后端服务管理)
- [HTTPS 配置](#https-配置)
- [常见问题排查](#常见问题排查)

---

## 部署架构概览

```
                    ┌─────────────────┐
                    │     Nginx       │
                    │   (端口 80/443)  │
                    └────┬───────┬────┘
                         │       │
          静态文件       │       │  API 反向代理
         (dist/)         │       │
                         ▼       ▼
              ┌─────────────┐  ┌──────────────┐
              │  静态文件    │  │  Node.js 后端 │
              │  (Vue SPA)  │  │  (端口 8082)  │
              └─────────────┘  └──────────────┘
                                    │
                              ┌─────┴─────┐
                              │ certificate/│
                              │ diploma/    │
                              │ keys/       │
                              │ (图片+密钥)  │
                              └───────────┘
```

**职责分工：**

- **Nginx**：提供前端静态文件服务 + 反向代理后端 API
- **Node.js 后端**：处理证书/毕业证的保存、查询、图片返回、登录验证（RSA 2048）
- **文件系统**：存储生成的证书/毕业证图片 + RSA 密钥对

---

## 环境要求

| 组件 | 最低版本 | 推荐版本 |
|------|----------|----------|
| Node.js | 18.x | 20.x LTS |
| Nginx | 1.18 | 1.24+ |
| 操作系统 | — | Ubuntu 22.04 / CentOS 8+ / Debian 12 |

---

## 部署方式一：Nginx + Node.js（推荐）

### 步骤 1：构建前端

```bash
cd UnicomUniversity
npm install
npm run build
```

构建产物在 `dist/` 目录。

### 步骤 2：上传文件到服务器

```bash
# 在服务器创建项目目录
mkdir -p /var/www/unicom-university

# 上传构建产物
scp -r dist/* user@server:/var/www/unicom-university/

# 上传后端代码和证书目录
scp -r server/ user@server:/var/www/unicom-university/
scp -r certificate/ diploma/ user@server:/var/www/unicom-university/
```

服务器目录结构：

```
/var/www/unicom-university/
├── index.html              # 前端入口
├── assets/                 # 前端 JS/CSS
├── images/                 # 静态图片
├── server/
│   ├── server.js           # Node.js 后端服务
│   └── keys/               # RSA 2048 密钥对（public.pem + private.pem）
├── certificate/            # 录取通知书存储
└── diploma/                # 毕业证存储
```

### 步骤 3：配置 Nginx

```bash
sudo nano /etc/nginx/conf.d/unicom-university.conf
```

写入以下配置（完整版见 [Nginx 完整配置参考](#nginx-完整配置参考)）：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 前端静态文件
    root /var/www/unicom-university;
    index index.html;

    # SPA 路由回退
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 后端 API 反向代理

    # 登录 API（RSA 公钥获取 + 登录验证）
    location /login {
        proxy_pass http://127.0.0.1:8082;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # 保存录取通知书
    location /save-image {
        proxy_pass http://127.0.0.1:8082;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /save-diploma {
        proxy_pass http://127.0.0.1:8082;
    }

    location /search-certificate {
        proxy_pass http://127.0.0.1:8082;
    }

    location /search-diploma {
        proxy_pass http://127.0.0.1:8082;
    }

    location /certificate/ {
        proxy_pass http://127.0.0.1:8082;
    }

    # 注意：仅代理带文件名的 /diploma/xxx.jpg 请求
    location ~ ^/diploma/.+\.(jpg|jpeg|png)$ {
        proxy_pass http://127.0.0.1:8082;
    }

    # 静态资源缓存
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location /images/ {
        expires 30d;
        add_header Cache-Control "public";
    }
}
```

```bash
# 测试配置
sudo nginx -t

# 重载 Nginx
sudo nginx -s reload
```

### 步骤 4：启动后端服务

> 确保服务器已安装 Node.js 18+。

#### 方式 A：直接运行（简单）

```bash
cd /var/www/unicom-university
node server/server.js
```

#### 方式 B：使用 systemd 守护进程（推荐生产环境）

```bash
sudo nano /etc/systemd/system/unicom-backend.service
```

```ini
[Unit]
Description=Unicom University Backend Service (Node.js)
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/unicom-university
ExecStart=/usr/bin/node /var/www/unicom-university/server/server.js
Restart=always
RestartSec=5
StandardOutput=journal
StandardError=journal

# 可选：通过环境变量设置登录密码
Environment="ADMIN_PASSWORD=ceet2016"

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable unicom-backend
sudo systemctl start unicom-backend

# 查看状态
sudo systemctl status unicom-backend

# 查看日志
sudo journalctl -u unicom-backend -f
```

### 步骤 5：验证部署

```bash
# 1. 检查前端页面
curl -I http://your-domain.com/
# 预期：HTTP/1.1 200 OK

# 2. 检查后端服务
curl http://127.0.0.1:8082/certificate/test.jpg
# 预期：404（正常，因为 test.jpg 不存在）

# 3. 检查 API 代理
curl -X POST http://your-domain.com/search-certificate \
  -H "Content-Type: application/json" \
  -d '{"fullName":"test","idNumber":"test"}'
# 预期：{"success": false, "message": "未找到..."}
```

---

## 部署方式二：Docker 容器化

### Dockerfile

在项目根目录创建 `Dockerfile`：

```dockerfile
# === Stage 1: 构建前端 ===
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# === Stage 2: 运行环境 ===
FROM node:20-alpine

# 复制前端构建产物
COPY --from=builder /app/dist /var/www/unicom-university

# 复制后端代码
COPY --from=builder /app/server /var/www/unicom-university/server

# 创建证书存储目录
RUN mkdir -p /var/www/unicom-university/certificate \
             /var/www/unicom-university/diploma

# 安装 Nginx
RUN apk add --no-cache nginx

# 复制 Nginx 配置
COPY nginx.conf /etc/nginx/http.d/unicom-university.conf

# 启动脚本
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80

CMD ["/docker-entrypoint.sh"]
```

### docker-entrypoint.sh

```bash
#!/bin/sh
# 启动 Node.js 后端（后台）
cd /var/www/unicom-university
node server/server.js &

# 启动 Nginx（前台）
nginx -g 'daemon off;'
```

### 构建与运行

```bash
# 构建镜像
docker build -t unicom-university:latest .

# 运行容器
docker run -d \
  --name unicom-uni \
  -p 80:80 \
  -v unicom-certs:/var/www/unicom-university/certificate \
  -v unicom-diplomas:/var/www/unicom-university/diploma \
  --restart always \
  unicom-university:latest

# 查看日志
docker logs -f unicom-uni
```

---

## 部署方式三：CloudStudio 沙箱预览

适用于快速预览和演示：

```bash
# 1. 本地构建
npm run build

# 2. 部署到 CloudStudio
# 使用 workbuddy_cloudstudio_deploy 工具
# 指定 directory 为 dist/ 目录
```

> **注意**：CloudStudio 沙箱仅提供前端静态文件服务，后端 API 不可用。证书生成/查询功能无法在沙箱环境中使用。

---

## 部署方式四：宝塔面板

> 适合不熟悉命令行操作的用户，宝塔面板底层是 Nginx，通过图形化界面配置。

### 步骤 1：上传文件

1. 本地构建前端：`npm run build`，产物在 `dist/` 目录
2. 登录宝塔面板 → **文件** → 进入网站根目录（通常为 `/www/wwwroot/你的域名/`）
3. 上传 `dist/` 目录内的**所有文件**到网站根目录
4. 如需后端功能，上传 `server/`、`certificate/`、`diploma/` 目录

服务器目录结构：

```
/www/wwwroot/你的域名/
├── index.html              # 前端入口
├── assets/                 # 前端 JS/CSS
├── images/                 # 静态图片
├── server/                 # 后端代码（可选）
│   ├── server.js
│   └── keys/               # RSA 密钥对
├── certificate/            # 录取通知书存储（可选）
└── diploma/                # 毕业证存储（可选）
```

### 步骤 2：配置伪静态（修复 /select 等前端路由 404）

> **必须配置。** Vue 是单页应用（SPA），直接访问 `/select`、`/diploma-select`、`/about` 等路由时，Nginx 找不到对应物理文件会返回 404。需要把所有未知路由回退到 `index.html`，由前端路由器处理。

1. 宝塔面板 → **网站** → 找到你的站点 → 点击 **设置**
2. 左侧菜单选择 **伪静态**
3. 在输入框中粘贴以下内容：

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

4. 点击 **保存**

### 步骤 3：配置后端 API 代理（可选，仅启用证书功能时需要）

1. 同一个网站 **设置** → 左侧选 **配置文件**
2. 在 `server { ... }` 块内，**在 `location /` 之前**插入以下内容：

```nginx
# === 后端 API 反向代理 ===

# 登录 API（RSA 公钥获取 + 登录验证）
location /login {
    proxy_pass http://127.0.0.1:8082;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}

location /save-image {
    proxy_pass http://127.0.0.1:8082;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    client_max_body_size 20M;
}

location /save-diploma {
    proxy_pass http://127.0.0.1:8082;
    proxy_set_header Host $host;
    client_max_body_size 20M;
}

location /search-certificate {
    proxy_pass http://127.0.0.1:8082;
    proxy_set_header Host $host;
}

location /search-diploma {
    proxy_pass http://127.0.0.1:8082;
    proxy_set_header Host $host;
}

location /certificate/ {
    proxy_pass http://127.0.0.1:8082;
    proxy_set_header Host $host;
}

# 仅代理毕业证图片文件，不拦截 /diploma 和 /diploma-select 路由
location ~ ^/diploma/.+\.(jpg|jpeg|png)$ {
    proxy_pass http://127.0.0.1:8082;
    proxy_set_header Host $host;
}
```

3. 点击 **保存**

> **注意**：`location ~ ^/diploma/...` 必须用正则匹配图片文件扩展名，不能写成 `location /diploma`，否则会拦截前端路由 `/diploma` 和 `/diploma-select`。

### 步骤 4：启动后端服务（可选）

> 确保服务器已安装 Node.js 18+。

1. 宝塔面板安装 **PM2** 插件（Node.js 进程管理器）
2. 添加 Node.js 项目：
   - 启动文件：`server/server.js`
   - 工作目录：网站根目录（如 `/www/wwwroot/你的域名`）
   - 端口：8082
   - 启动命令：`node server.js`
3. 启动项目

> **或通过命令行启动**：
> ```bash
> cd /www/wwwroot/你的域名
> node server/server.js &
> # 或使用 pm2 守护进程
> pm2 start server/server.js --name unicom-backend
> pm2 save
> pm2 startup
> ```

> 如果暂时只需要展示网站页面，不需要证书生成/查询功能，可跳过步骤 3 和 4。

### 步骤 5：验证

1. 浏览器访问 `https://你的域名/`，确认首页正常
2. **直接访问** `https://你的域名/select`，应显示证书查询页面而非 404（验证伪静态配置生效）
3. 同样验证 `/diploma-select`、`/about`、`/contact` 等子页面
4. 如配置了后端，访问 `/login` 并尝试生成录取通知书，确认图片保存成功

### 宝塔面板常见问题

| 现象 | 原因 | 解决 |
|------|------|------|
| 首页正常，但 `/select`、`/diploma-select` 返回 404 | 未配置伪静态 | 按步骤 2 配置伪静态 |
| 页面打开空白，控制台报 JS 404 | `dist` 上传不完整或路径不对 | 确认 `index.html` 在网站根目录，`assets/` 在同级 |
| 证书图片保存失败 | 后端服务未启动或代理未配置 | 按步骤 3、4 操作 |
| `/diploma-select` 页面 404 | 代理规则 `location /diploma` 过于宽泛 | 使用正则 `location ~ ^/diploma/.+\.(jpg\|jpeg\|png)$` |

---

## Nginx 完整配置参考

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name your-domain.com;

    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # 前端根目录
    root /var/www/unicom-university;
    index index.html;

    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript image/svg+xml;

    # 文件上传大小限制（证书图片可能较大）
    client_max_body_size 20M;

    # SPA 路由回退
    location / {
        try_files $uri $uri/ /index.html;
    }

    # === 后端 API 反向代理 ===

    # 登录 API（RSA 公钥获取 + 登录验证）
    location /login {
        proxy_pass http://127.0.0.1:8082;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # 保存录取通知书
    location /save-image {
        proxy_pass http://127.0.0.1:8082;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        client_max_body_size 20M;
    }

    # 保存毕业证
    location /save-diploma {
        proxy_pass http://127.0.0.1:8082;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        client_max_body_size 20M;
    }

    # 查询录取通知书
    location /search-certificate {
        proxy_pass http://127.0.0.1:8082;
        proxy_set_header Host $host;
        proxy_set_header Content-Type $content_type;
    }

    # 查询毕业证
    location /search-diploma {
        proxy_pass http://127.0.0.1:8082;
        proxy_set_header Host $host;
        proxy_set_header Content-Type $content_type;
    }

    # 获取录取通知书图片
    location /certificate/ {
        proxy_pass http://127.0.0.1:8082;
        proxy_set_header Host $host;
        expires 1h;
        add_header Cache-Control "public, max-age=3600";
    }

    # 获取毕业证图片（仅匹配图片文件，不拦截 /diploma 和 /diploma-select 路由）
    location ~ ^/diploma/.+\.(jpg|jpeg|png)$ {
        proxy_pass http://127.0.0.1:8082;
        proxy_set_header Host $host;
        expires 1h;
        add_header Cache-Control "public, max-age=3600";
    }

    # === 静态资源缓存 ===

    # JS/CSS 长期缓存（文件名含 hash）
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # 图片缓存
    location /images/ {
        expires 30d;
        add_header Cache-Control "public";
    }

    # favicon
    location = /favicon.ico {
        expires 30d;
        access_log off;
        log_not_found off;
    }
}
```

---

## 后端服务管理

### 常用命令

```bash
# 启动
sudo systemctl start unicom-backend

# 停止
sudo systemctl stop unicom-backend

# 重启
sudo systemctl restart unicom-backend

# 查看状态
sudo systemctl status unicom-backend

# 查看实时日志
sudo journalctl -u unicom-backend -f

# 查看最近 100 行日志
sudo journalctl -u unicom-backend -n 100
```

### 修改端口

如需修改后端端口（默认 8082），同时修改两处：

1. `server/server.js` 中的 `PORT` 常量：
   ```javascript
   const PORT = 8082  // 改为你的端口
   ```

2. Nginx 配置中所有 `proxy_pass http://127.0.0.1:8082;`

3. 如果使用 Vite 开发模式，还需修改 `vite.config.js` 中的 `proxyConfig` target

---

## HTTPS 配置

### 使用 Let's Encrypt 免费证书

```bash
# 1. 安装 Certbot
sudo apt install certbot python3-certbot-nginx

# 2. 申请证书（自动修改 Nginx 配置）
sudo certbot --nginx -d your-domain.com

# 3. 设置自动续期
sudo systemctl enable certbot.timer
```

### 手动 HTTPS 配置

```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # ... 其余配置同 HTTP
}

# HTTP 跳转 HTTPS
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$host$request_uri;
}
```

---

## 常见问题排查

### 1. 页面空白 / 路由 404

**原因**：Nginx 未配置 SPA 回退。

**解决**：确保 `location /` 中有 `try_files $uri $uri/ /index.html;`。

> 使用宝塔面板时：**网站 → 设置 → 伪静态**，粘贴 `location / { try_files $uri $uri/ /index.html; }` 即可。详见 [部署方式四：宝塔面板](#部署方式四宝塔面板)。

### 2. 证书图片无法保存（404 / 502）

**原因**：后端服务未启动，或 Nginx 代理配置缺失。

**排查步骤**：

```bash
# 检查后端是否运行
sudo systemctl status unicom-backend

# 检查端口是否监听
ss -tlnp | grep 8082

# 检查 Nginx 代理
curl -X POST http://localhost/save-image -v
```

### 3. `/diploma-select` 页面 404

**原因**：Nginx 的 `/diploma` 代理规则过于宽泛，拦截了前端路由。

**解决**：使用正则匹配，仅代理图片文件请求：

```nginx
# 错误写法 — 会拦截 /diploma 和 /diploma-select
location /diploma {
    proxy_pass http://127.0.0.1:8082;
}

# 正确写法 — 仅匹配带图片扩展名的请求
location ~ ^/diploma/.+\.(jpg|jpeg|png)$ {
    proxy_pass http://127.0.0.1:8082;
}
```

### 4. 上传证书图片失败（413 Request Entity Too Large）

**原因**：Nginx 默认上传限制 1MB。

**解决**：在 Nginx 配置中增加：

```nginx
client_max_body_size 20M;
```

### 5. 语言切换后页面空白

**原因**：翻译文件 JSON 结构不一致（如某语言的 `home.stats` 是对象而非数组）。

**排查**：

```bash
# 验证所有 locale 文件的 JSON 语法
node -e "JSON.parse(require('fs').readFileSync('src/locales/zh.json','utf8'))" && echo "zh OK"
node -e "JSON.parse(require('fs').readFileSync('src/locales/en.json','utf8'))" && echo "en OK"
node -e "JSON.parse(require('fs').readFileSync('src/locales/ja.json','utf8'))" && echo "ja OK"
node -e "JSON.parse(require('fs').readFileSync('src/locales/ko.json','utf8'))" && echo "ko OK"
```

**预防**：修改翻译文件后务必运行 `npm run build` 检查是否有编译错误。

### 6. 手机端语言切换器不可见

**原因**：语言切换器被隐藏。

**解决**：确认 `AppHeader.vue` 中：
- 桌面端语言切换器 `.lang-switcher-desktop` 在 `min-width: 769px` 时 `display: flex`
- 移动端语言切换器 `.lang-switcher-mobile` 在 `max-width: 768px` 时 `display: flex`，位于汉堡菜单内

### 7. 后端 multipart 解析失败

**原因**：`server.js` 中 image_data 和 filename 在同一 multipart part 中提取，解析逻辑需正确处理 boundary。

**确认**：`server.js` 中的 multipart 解析逻辑正确提取 `image` 和 `filename` 字段，确保图片数据和文件名都被正确获取。

### 8. footer 版权年份显示不完整（如 "© 1990-" 缺少年份）

**原因**：footer 年份已改为模板拼接方式，不再使用 vue-i18n 占位符。翻译文件中 `footer.copyright` 不含 `{year}` 占位符，年份在 Vue 模板中直接拼接。

**确认**：`AppFooter.vue` 中使用模板拼接：

```vue
<!-- 正确：年份直接在模板中拼接，不通过 i18n 占位符 -->
<p>© 1990-{{ currentYear }} {{ t('footer.copyright') }}</p>
```

```javascript
// currentYear 是 computed ref，模板中自动解包
const currentYear = computed(() => new Date().getFullYear())
```

### 9. 登录页面报错"获取公钥失败: Unexpected token '<'"

**原因**：Nginx 未配置 `/login` 反向代理，请求被 SPA 回退规则拦截，返回了 `index.html`（HTML），前端试图解析为 JSON 报错。

**排查步骤**：

```bash
# 1. 检查 Nginx 配置中是否有 /login 代理
grep -r "location /login" /etc/nginx/

# 2. 直接访问后端，确认后端正常运行
curl http://127.0.0.1:8082/login/public-key
# 预期：返回 PEM 格式的公钥字符串

# 3. 通过域名访问，确认代理生效
curl https://your-domain.com/login/public-key
# 预期：与上面相同的公钥字符串（而非 HTML）
```

**解决**：在 Nginx 配置中添加（详见 [Nginx 完整配置参考](#nginx-完整配置参考)）：

```nginx
location /login {
    proxy_pass http://127.0.0.1:8082;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

**宝塔面板用户**：在 **网站 → 设置 → 配置文件** 中添加上述配置，保存后重载 Nginx。

**确认后端已启动**：

```bash
# 检查 Node.js 后端是否运行
ps aux | grep "node server.js"

# 如未运行，启动后端
cd /var/www/unicom-university
node server/server.js &

# 或使用 PM2 守护进程
pm2 start server/server.js --name unicom-backend
```

### 10. 页面空白，控制台报 "SyntaxError: Invalid linked format"

**原因**：vue-i18n 9.x 中 `@` 是保留字符（用于 Linked Messages `@:key` 语法）。翻译文件中邮箱地址的 `@`（如 `uniomo@10010.edu.pl`）被消息编译器误解析为链接消息，导致运行时错误。

**解决**：将所有翻译字符串中的 `@` 转义为 `{'@'}`（vue-i18n 字面插值语法），运行时会正确输出 `@` 字符：

```json
// 错误 — @ 会被解析为 Linked Messages 语法
"email": "uniomo@10010.edu.pl"

// 正确 — @ 被转义为字面量
"email": "uniomo{'@'}10010.edu.pl"
```

**排查**：

```bash
# 检查 locale 文件中是否有未转义的 @ 字符
grep -n "@" src/locales/*.json | grep -v "{'@'}"
# 如有输出，说明存在未转义的 @，需要修复
```
