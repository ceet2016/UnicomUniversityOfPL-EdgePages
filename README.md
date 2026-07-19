# 波兰联通大学官方网站

> Polish University of Communications — 基于 **Vue 3 + Vite** 构建的多语言大学门户网站，集成录取通知书与毕业证书在线生成 / 查询系统。
>
> 本项目为**纯无服务器架构**：前端为静态 SPA，后端为 EdgeOne Makers Node.js 函数，图片与密钥存储在 EdgeOne Blob，**完全不依赖任何自托管服务器**。

---

# 免责申明 / Disclaimer / 免責事項 / 면책 고지

## 中文

### 源代码免责申明

1. **项目归属**
   本源代码及相关部署成果（以下简称“本项目”）为波兰联通大学的官方网站，归属波兰方所有。本项目在法律、业务及组织架构上与中国及其境内的任何企业、机构或个人没有任何关联。

2. **部署限制（重要）**
   - **禁止境内部署**：本源代码不得在中国境内的任何服务器、云主机或物理机器上进行部署或运行。
   - **禁止对内开放**：本项目的部署成果（包括但不限于网站页面、API接口、生成的证书与文件）不得对中国国内人员开放或提供访问服务。

3. **责任隔离**
   无论在源代码层面还是最终部署成果层面，本项目均不代表中国任何公司或个人的立场，亦不承担与中国相关的任何义务或法律责任。任何违反上述地域限制的部署与使用行为所产生的后果，由违规操作者自行承担全部责任。

---

## English

### Source Code Disclaimer

1. **Project Ownership**
   This source code and its related deployment results (hereinafter referred to as the "Project") constitute the official website of the Polish University of Communications and are owned by the Polish entity. The Project has no legal, operational, or organizational affiliation with China or any domestic enterprises, institutions, or individuals within China.

2. **Deployment Restrictions (Important)**
   - **No Deployment in China**: This source code shall not be deployed or run on any servers, cloud hosts, or physical machines located within mainland China.
   - **No Access for Domestic Users**: The deployed results of this Project (including but not limited to web pages, API endpoints, and generated certificates) shall not be made accessible or provided to domestic personnel in China.

3. **Liability Isolation**
   At both the source code level and the final deployment level, the Project does not represent the interests of any Chinese company or individual, nor does it assume any obligations or legal liabilities related to China. Any consequences arising from deployment or usage that violates the aforementioned geographical restrictions shall be borne solely by the violator.

---

## 日本語

### ソースコード免責事項

1. **プロジェクトの帰属**
   本ソースコードおよび関連するデプロイ成果（以下「本プロジェクト」という）は、ポーランド通信大学の公式ウェブサイトであり、ポーランド側に帰属するものです。本プロジェクトは、法律、業務、および組織構造において、中国および中国国内のいかなる企業、機関、または個人とも一切の関係を持ちません。

2. **デプロイ制限（重要）**
   - **中国国内でのデプロイ禁止**：本ソースコードは、中国本土のサーバー、クラウドホスト、または物理マシンにデプロイまたは実行してはなりません。
   - **国内ユーザーへの公開禁止**：本プロジェクトのデプロイ成果（ウェブページ、APIエンドポイント、生成された証明書などを含むが、これらに限定されない）は、中国国内の人物に向けて公開またはアクセスを提供してはなりません。

3. **責任の分離**
   ソースコードレベルおよび最終的なデプロイ成果レベルのいずれにおいても、本プロジェクトは中国のいかなる会社または個人を代表するものではなく、中国に関連するいかなる義務または法的責任も負いません。上記の地域的制限に違反するデプロイや使用行為から生じるいかなる結果についても、その責任はすべて違反者が負うものとします。

---

## 한국어

### 소스 코드 면책 고지

1. **프로젝트 귀속**
   본 소스 코드 및 관련 배포 결과물(이하 "본 프로젝트")은 폴란드 통신 대학교의 공식 웹사이트로서 폴란드 측에 귀속됩니다. 본 프로젝트는 법적, 사업적, 조직적으로 중국 및 중국 내 기업, 기관 또는 개인과 어떠한 관련도 없습니다.

2. **배포 제한 (중요)**
   - **중국 내 배포 금지**: 본 소스 코드는 중국 본토의 서버, 클라우드 호스트 또는 물리적 머신에 배포하거나 실행할 수 없습니다.
   - **내국인 접근 금지**: 본 프로젝트의 배포 결과물(웹 페이지, API 엔드포인트, 생성된 증명서 등을 포함하되 이에 국한되지 않음)은 중국 내국인에게 공개하거나 접근을 제공해서는 안 됩니다.

3. **책임 분리**
   소스 코드 수준 및 최종 배포 결과물 수준 모두에서, 본 프로젝트는 중국의 어떠한 회사나 개인을 대변하지 않으며, 중국과 관련된 어떠한 의무나 법적 책임도 지지 않습니다. 전술한 지역적 제한을 위반하는 배포 및 사용 행위로 인해 발생하는 모든 결과에 대한 책임은 위반자 본인이 전적으로 부담합니다.

---

## 项目概述

本项目是波兰联通大学（Polish University of Communications）官方网站，采用**纯无服务器（Serverless）架构**，部署在腾讯云 **EdgeOne Makers** 上，完全脱离自建服务器：

- **前端**：Vue 3 SPA 单页应用（Hash 路由），负责页面渲染、用户交互、证书生成与导出。
- **后端**：EdgeOne Makers 的 Node.js 函数（`cloud-functions/[[default]].js`，Node 24.11）承接原 `server/server.js` 的全部接口。
- **存储**：证书图片与 RSA 密钥对存储在 **EdgeOne Blob**（`@edgeone/pages-blob`），对应原本地 `certificate/`、`diploma/`、`server/keys/` 目录。
- **域名**：可绑定**未备案域名**（在 Makers 选择「海外」或「全球加速」区域即可）。

网站支持中文、英文、日文、韩文四种语言实时切换，默认语言为英文。

---

## 技术栈

| 层级 | 技术 | 版本 / 说明 |
|------|------|------|
| 前端框架 | Vue 3 | ^3.4.21 |
| 构建工具 | Vite | ^6（原 ^5，见 `package.json`） |
| 路由 | Vue Router 4（**Hash 模式**） | ^4.3.0 |
| 国际化 | vue-i18n 9 | ^9.14.5 |
| 图片导出 | html2canvas | ^1.4.1 |
| 二维码生成 | qrcode | ^1.5.4 |
| 无服务器后端 | EdgeOne Makers Node.js Functions | 24.11 |
| 对象存储 | EdgeOne Blob（`@edgeone/pages-blob`） | ^0.0.14 |

> 前端无 UI 框架依赖，所有组件与样式均为手写，使用 CSS 变量实现设计系统。

---

## 功能特性

### 公开页面

| 页面 | 路由（Hash） | 说明 |
|------|------|------|
| 首页 | `/#/` | 轮播图、统计数据、快捷入口、新闻动态 |
| 学校概况 | `/#/about` | 学校简介、历史沿革、办学特色 |
| 学术研究 | `/#/academics` | 院系设置、学科建设、科研成果 |
| 招生信息 | `/#/admissions` | 招生简章、入学要求、奖学金 |
| 校园生活 | `/#/campus` | 校园设施、学生活动、住宿餐饮 |
| 联系我们 | `/#/contact` | 联系方式、地图、咨询表单 |
| 录取通知书查询 | `/#/select` | 按姓名+证件号查询录取通知书 |
| 毕业证查询 | `/#/diploma-select` | 按姓名+证件号查询毕业证 |

### 管理功能（需认证）

| 页面 | 路由（Hash） | 说明 |
|------|------|------|
| 管理员登录 | `/#/login` | 用户名密码登录，24 小时会话 |
| 管理面板 | `/#/dashboard` | 系统入口面板 |
| 录取通知书生成 | `/#/admission-letter` | 在线生成、预览、导出录取通知书 |
| 毕业证颁发 | `/#/diploma` | 在线生成、预览、导出毕业证书 |

### 其他特性

- **多语言实时切换**：四种语言无刷新切换，所有页面文本同步更新。
- **响应式设计**：适配桌面端（≥769px）与移动端（<769px），移动端含汉堡菜单。
- **滚动动画**：基于 `IntersectionObserver` 的 `v-scroll-reveal` 指令，全局注册。
- **防伪水印系统**：录取通知书与毕业证均含微文字、扭索纹、QR 码三重防伪。
- **暗色顶栏 + 浅色主体**：专业学术蓝白配色方案。

---

## 目录结构

```
UnicomUniversityOfPL/
├── cloud-functions/
│   └── [[default]].js        # EdgeOne Makers 后端函数（替代原 server/server.js）
├── scripts/
│   ├── upload-index.mjs      # postbuild：将 SPA 入口上传至 Blob（spa-shell）
│   └── sync-index.mjs        # 手动兜底上传 SPA 外壳（需 EO_PROJECT_ID + EO_TOKEN）
├── src/                      # Vue 3 前端（同原结构，路由改为 Hash 模式）
│   ├── components/  directives/  locales/  router/  styles/  utils/  views/
│   ├── App.vue  i18n.js  main.js
├── public/
│   ├── images/               # 静态图片（轮播图、校园照片、favicon 等）
│   └── qrcode.min.js         # QR 码库（备用，实际使用 npm qrcode）
├── edgeone.json              # Makers 部署配置（路由 / 响应头 / includeFiles）
├── vite.config.js            # Vite 配置（含开发代理）
└── package.json
```

> `server/`、`certificate/`、`diploma/` 为**旧版本地开发遗留目录**，线上部署不再使用；如需本地用旧版 Node 服务调试可保留，否则可删除。

---

## 多语言 (i18n) 支持

支持 **中文（zh）/ 英文（en）/ 日文（ja）/ 韩文（ko）** 四种语言，默认 `en`，回退语言 `en`。翻译键文件位于 `src/locales/`（`zh.json` / `en.json` / `ja.json` / `ko.json`）。

```javascript
// src/i18n.js
import { createI18n } from 'vue-i18n'
const i18n = createI18n({
  legacy: false,        // Composition API 模式
  locale: 'en',         // 默认英文
  fallbackLocale: 'en', // 回退语言
  messages: { zh, en, ja, ko }
})
```

在 `<script setup>` 中使用：`const { t, tm, locale } = useI18n()`。

**关键注意事项**

1. **数据结构一致性**：同一翻译键在各语言文件中数据类型必须一致（如 `home.stats` 四种语言都必须是 `[{value, suffix, label}]` 数组）。
2. **`@` 字符转义**：vue-i18n 9.x 中 `@` 为保留字符（Linked Messages），翻译字符串中的邮箱地址 `@` 必须转义为 `{'@'}`，否则运行时会报 `SyntaxError: Invalid linked format`。
3. **语言切换顺序**：EN → 中文 → 日本語 → 한국어（英文优先）。

---

## 路由系统

采用 **Hash 模式**（`createWebHashHistory`）。所有路由形如 `/#/about`、`/#/select`，浏览器实际只请求 `/`（静态 `index.html` 由 CDN 直接返回，不进入函数）。这样在 **EdgeOne Makers（不支持 SPA history 重写）** 上也能可靠工作，且二维码深链（`/#/select?name=…&id=…&auto=1`）扫码后不会回首页。

需要认证的路由：`/#/dashboard`、`/#/admission-letter`、`/#/diploma`（守卫检查 `localStorage` 的 `sessionToken` 与 `loginTime`，24 小时有效）。

---

## 认证系统

### 登录凭据

| 字段 | 值 |
|------|------|
| 用户名 | `admin` |
| 密码 | `ceet2016` |

> 可通过环境变量 `ADMIN_USERNAME` / `ADMIN_PASSWORD` 覆盖。

### 认证流程（RSA 2048 加密）

1. 加载 `/#/login` 时，前端 `GET /login/public-key` 获取函数生成的 RSA 2048 公钥（PEM）。
2. 用户输入凭据后，前端用 **Web Crypto API**（RSA-OAEP + SHA-256）加密密码，密文 Base64 编码。
3. 前端 `POST /login` 发送 `{ username, encryptedPassword }`。
4. 函数用私钥（存于 Blob `app-keys`，首次自动生成）解密并比对凭据。
5. 验证通过返回 `{ success: true, token }`，前端存入 `localStorage`，24 小时有效。

> 也可将密钥固定到环境变量 `RSA_PUBLIC_KEY` / `RSA_PRIVATE_KEY`，避免每次部署重新生成。

---

## 证书生成与存储

### 录取通知书 / 毕业证书

- 输入：姓名、证件号、专业、入学/毕业日期等。
- 输出：含防伪水印的 HTML → 通过 `html2canvas` 导出为 JPG。
- 防伪元素：40 个微文字 + 1 个 SVG 扭索纹 + QR 码（含验证信息）。
- 文件命名：`{姓名}_{证件号}.jpg`（兼容旧格式 `{证件号}.jpg`）。

### 后端 API（由 `[[default]].js` 承接）

| 端点 | 方法 | 说明 |
|------|------|------|
| `/login/public-key` | GET | 获取 RSA 2048 公钥（PEM，JSON 响应） |
| `/login` | POST | 登录验证，返回 token |
| `/save-image` | POST | 保存录取通知书图片（multipart → Blob `certificates`） |
| `/save-diploma` | POST | 保存毕业证图片（multipart → Blob `diplomas`） |
| `/search-certificate` | POST | 按姓名+证件号查询录取通知书 |
| `/search-diploma` | POST | 按姓名+证件号查询毕业证 |
| `/certificate/{filename}` | GET | 返回录取通知书图片（Blob `certificates`） |
| `/diploma/{filename}` | GET | 返回毕业证图片（Blob `diplomas`） |

### Blob 命名空间

| 命名空间 | 用途 |
|----------|------|
| `certificates` | 录取通知书图片 |
| `diplomas` | 毕业证图片 |
| `app-keys` | RSA 密钥对（首次自动创建） |
| `spa-shell` | SPA 入口兜底（构建时上传，可选） |

> Blob 命名空间由 `@edgeone/pages-blob` 在首次使用时自动创建，无需手动配置。

---

## 部署到 EdgeOne Makers

本项目专为 **EdgeOne Makers（腾讯云无服务器 Pages/Functions）** 设计，域名未备案也可绑定（选择「海外」或「全球加速」区域）。

### 控制台配置

| 项 | 值 |
|------|------|
| 构建命令 | `npm run build` |
| 安装命令 | `npm install`（通常自动执行） |
| 输出目录 | `dist` |
| Node.js 版本 | **24.11.0** |
| 加速区域 | 海外 / 全球加速（用于绑定未备案域名） |

### `edgeone.json`

仓库根目录的 `edgeone.json` 已包含部署所需配置（`version 3`、`routes: filesystem`、`cloudFunctions.includeFiles: dist/index.html`，以及为函数响应设置的 `Server` 响应头规则）。

### 环境变量（可选）

| 变量 | 说明 |
|------|------|
| `ADMIN_USERNAME` | 覆盖默认管理员用户名（默认 `admin`） |
| `ADMIN_PASSWORD` | 覆盖默认管理员密码（默认 `ceet2016`，建议改为强密码） |
| `RSA_PUBLIC_KEY` / `RSA_PRIVATE_KEY` | 固定 RSA 密钥对（不设置则由函数首次自动生成并存入 Blob） |

### 部署步骤

1. 将代码推送到 Git 仓库，或在 Makers 控制台上传/导入项目。
2. 按上表填写构建命令、输出目录、Node 版本与加速区域，触发部署。
3. 部署成功后，在「域名管理」绑定你的未备案域名（按提示添加 CNAME 解析，Makers 自动签发 SSL）。
4. 在「环境」中添加上述环境变量（至少建议设置 `ADMIN_PASSWORD`）。

> 本地调试仍可用旧版方式：`npm run dev` 启动前端，另开终端 `node server/server.js` 启动旧后端（仅本地，不参与线上部署）。

### 关于 `Server` 响应头

函数自身发出的所有响应（API、`/certificate/*`、`/diploma/*`、SPA 兜底）均带 `Server: ChinaUnicomWAF`。**但静态首页 `/` 的 `Server` 头由 EdgeOne 平台注入为 `edgeone-pages`，`edgeone.json` 与函数均无法覆盖**（Makers 将 `Server` 视为保留头）。如需连静态首页也改写 `Server`，需把域名在主 EdgeOne 控制台作为「站点」接入并用规则引擎处理。

---

## 本地开发

### 环境要求

- Node.js ≥ 18（本地开发）；部署目标 Node.js 24.11。

### 安装与启动

```bash
# 1. 安装依赖
npm install

# 2. 启动前端开发服务器（Vite，默认端口 5173）
npm run dev

# 3. （可选，旧版本地后端）另开终端
node server/server.js
```

开发环境下，以下 API 路径由 Vite 代理转发至旧后端 `http://localhost:8082`：

```
/login, /save-image, /save-diploma,
/search-certificate, /search-diploma,
/certificate, ^/diploma/
```

> 线上部署不使用该代理；所有请求由 `cloud-functions/[[default]].js` 与静态资源直接承接。

### 构建

```bash
npm run build
```

构建产物输出到 `dist/`，包含 `index.html`、`assets/`（打包后的 JS/CSS）与 `images/`（静态图片）。`postbuild` 会自动尝试将 SPA 入口上传至 Blob（`upload-index.mjs`）；构建环境无凭证时优雅跳过，不影响部署。
