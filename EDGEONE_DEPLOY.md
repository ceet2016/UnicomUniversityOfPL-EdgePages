# 部署到 EdgeOne Makers（免备案 / 无自建服务器）

本指南说明如何把「波兰联通大学官网」整套站点（Vue 前端 + 证书后端）部署到
**腾讯云 EdgeOne Makers**，完全脱离你自己的服务器，并且**绑定未备案域名**。

---

## 架构变化（部署前必读）

| 原来（自建服务器） | 现在（EdgeOne Makers） |
|---|---|
| 前端 `dist/` 由 Nginx 托管 | EdgeOne 自动托管 `dist/` 静态资源 |
| 后端 `server/server.js`（Node http，端口 8082）常驻进程 | `cloud-functions/[[default]].js`（Makers Node.js 函数，按请求运行） |
| 图片存本地 `certificate/`、`diploma/` 目录 | 存 **EdgeOne Blob 存储**（自动创建命名空间） |
| RSA 密钥存本地 `server/keys/` | 首次访问自动生成并存入 **Blob 存储**（或放环境变量） |
| 域名需备案 + 自建服务器 | 选「海外/全球加速区域」即可绑定**未备案域名** |

> 前端代码（Vue）**无需任何修改**：它调用的全是同源相对路径
> （`/login`、`/save-image`、`/search-certificate` …），在 Makers 上与本地一致。

---

## 一、准备代码

仓库（或上传目录）根目录现在应包含：

```
UnicomUniversityOfPL-main/
├── cloud-functions/
│   └── [[default]].js      # 后端（替代 server/server.js）；SPA 回退用 includeFiles 兜底
├── edgeone.json           # 静态资源服务 + cloudFunctions.includeFiles 注入 index.html
├── scripts/
│   ├── upload-index.mjs   # postbuild 自动把 dist/index.html 上传到 Blob（兜底）
│   └── sync-index.mjs     # 手动补充上传 SPA 外壳（遇到权限问题时用）
├── src/                   # Vue 前端源码
├── public/                # 静态图片等
├── package.json           # 已加入 @edgeone/pages-blob 依赖
├── vite.config.js
└── index.html
```

> `server/`、`certificate/`、`diploma/` 仅用于**本地开发**（配合旧 `server.js`），
> 上线部署时不会被使用，可保留也可删除。

---

## 二、在 EdgeOne Makers 创建项目

1. 登录 [边缘安全加速平台 EO 控制台](https://console.cloud.tencent.com/edgeone)，进入 **Makers**。
2. 创建项目，选择 **「导入 Git 仓库」** 或 **「直接上传」**：
   - Git 方式：授权并选择本仓库，后续提交自动部署。
   - 上传方式：把整个项目目录打包上传（注意 `cloud-functions/` 和 `edgeone.json` 必须带上）。
3. **加速区域（关键）**：选择 **海外 / 全球加速** 区域。
   - 只有选择了非中国大陆加速区域，绑定**未备案域名**才不会要求 ICP 备案。
   - 这与你的需求（域名未备案）一致。

---

## 三、构建配置

在「自定义构建」中填写：

| 配置项 | 值 |
|---|---|
| 构建命令 (Build Command) | `npm run build` |
| 输出目录 (Output Directory) | `dist` |
| 运行环境 / Node 版本 | **Node.js 24.11**（在环境选项中选择） |

点击 **开始部署**，Makers 会执行：
- `npm install`（含 `@edgeone/pages-blob`）
- `npm run build` → 产出 `dist/`
- 自动识别 `cloud-functions/` → 挂载后端函数
- `postbuild` 会把 `dist/index.html` 写入 Blob 命名空间 `spa-shell`（兜底用）

> **SPA 路由方案（已改为 Hash 模式）**：EdgeOne Makers 不支持 SPA history 重写，
> 且函数内 `fetch('/index.html')` 会重新进入函数（死循环）。因此本版前端改用
> **`createWebHashHistory`**（所有路由形如 `/#/select`），二维码也改为
> `/#/select?name=…&id=…&auto=1`。扫码时浏览器只请求 `/`（静态 `index.html` 由 CDN
> 直接返回，**永不进函数**），客户端路由自行解析查询参数并自动查询——彻底摆脱对
> 服务端 SPA 回退的依赖。`[[default]].js` 仍保留对**旧 history 深链**的兜底：通过
> `edgeone.json` 的 `cloudFunctions.includeFiles` 把 `dist/index.html` 注入函数包，
> 用 `readFileSync` 直接返回（官方、不循环），Blob `spa-shell` 仅作 warm 缓存。

---

## 四、绑定未备案域名

1. 部署成功后进入项目 **域名管理 → 自定义域名**。
2. 添加你的域名，按提示在域名服务商处设置 **CNAME** 记录指向 Makers 提供的地址。
3. 由于第（二）步选了海外/全球加速区域，此处**不要求备案**。
4. Makers 会自动下发 SSL 证书，启用 HTTPS。

---

## 五、无需手动创建的存储：Blob 与 RSA 密钥

- **证书图片**：首次调用 `/save-image` 或 `/save-diploma` 时，SDK 自动创建
  两个 Blob 命名空间 `certificates`、`diplomas`，图片直接写入，无需任何配置。
- **RSA 密钥**：首次访问 `/login/public-key` 时，后端自动生成 2048 位 RSA
  密钥对并存入 Blob 命名空间 `app-keys`，之后复用。
  - 免费版 Blob 单账户容量 **1 GB**，对证书图片场景足够。
  - 控制台 **Blob 存储** 页面可只读浏览命名空间与对象。

> 你也可以在 Makers 的「环境变量 / Secrets」中直接设置
> `RSA_PUBLIC_KEY` 与 `RSA_PRIVATE_KEY`（PEM 文本），后端会优先使用环境变量，
> 不再写入 Blob。

---

## 六、管理员凭据（可选环境变量）

默认账号：`admin` / `ceet2016`（与原 `server.js` 一致）。

如需修改，在 Makers 项目「环境变量」中设置：

```
ADMIN_USERNAME=your_admin
ADMIN_PASSWORD=your_strong_password
```

---

## 七、验证部署

打开你的域名，逐项确认：

1. **首页与子页面**：访问 `/`、`/about`、`/select`、`/diploma-select` 等，
   直接刷新也不会 404（SPA 回退生效）。
   - **录取通知书二维码扫码**：用手机扫生成的录取通知书二维码，应直接打开
     `/#/select?name=…&id=…&auto=1` 查询页并自动回填、自动查询出该生通知书
     （不再跳回首页）。若仍异常，见下方「常见问题」。
2. **登录**：进入 `/login`，页面会自动拉取 RSA 公钥（首次会触发密钥生成，稍慢），
   用 `admin / ceet2016` 登录成功并跳转到 `/dashboard`。
3. **生成证书**：`/admission-letter` 或 `/diploma` 填写信息 → 生成预览 →
   「下载图片」会同时把 JPG 存入 Blob（控制台 Blob 存储可见）。
4. **查询证书**：`/select` 或 `/diploma-select` 输入姓名+证件号，
   能查回对应图片（说明 Blob 读取链路正常）。

---

## 八、常见问题

| 现象 | 原因 / 解决 |
|---|---|
| 登录页一直转圈，控制台报「服务器响应格式错误」 | 旧 `vite.config.js` 代理仅在本地生效；上线后由 Makers 函数处理，无需代理。确认域名根路径直接访问且函数已部署。 |
| 生成图片成功但查询不到 | 确认使用的域名/环境一致；Blob 命名空间按项目隔离，不同项目不互通。 |
| 证书图片查询返回旧数据 | Blob 默认「最终一致」（秒级），极少概率需强一致；如需立即读取可在 `getStore` 时设 `{ consistency: 'strong' }`。 |
| 函数报错 `Cannot find module '@edgeone/pages-blob'` | 确认 `package.json` 已包含该依赖且构建时执行了 `npm install`；重新部署一次。 |
| **扫描二维码 / 打开子页面跳回首页或“资源暂未就绪”** | 旧版 SPA 回退用 `context.next`/`fetch` 失效所致。本版已改为 **Hash 路由**（`/#/select?…`），扫码浏览器只请求 `/`、由 CDN 直接返回 `index.html`，不再进函数、不会回首页、不会 503。请确认已部署最新代码（含 `src/router` 的 `createWebHashHistory` 与二维码的 `/#/` 前缀）。旧 history 深链由函数 `includeFiles`+`readFileSync` 兜底返回 `index.html`。 |

---

## 九、本地开发（可选）

如果还想在本地跑旧的后端做调试：

```bash
npm install
npm run dev            # 前端 + vite 代理到 localhost:8082
node server/server.js  # 旧后端（本地用，非线上）
```

线上生产环境**不依赖** `server/server.js`，真正实现「完全脱离自己的服务器」。
