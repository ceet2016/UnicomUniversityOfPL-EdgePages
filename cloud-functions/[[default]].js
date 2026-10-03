// EdgeOne Makers — Node.js Functions backend (single catch-all handler)
//
// This file replaces the original `server/server.js` (Node http server) so the
// whole application can run on EdgeOne Makers WITHOUT any self-managed server.
//
// Responsibilities:
//   1. Expose the same API the Vue frontend already calls (relative URLs):
//        GET  /login/public-key      -> RSA public key (PEM)
//        POST /login                 -> verify credentials, return token
//        POST /save-image            -> store admission certificate (Blob)
//        POST /save-diploma          -> store graduation certificate (Blob)
//        POST /search-certificate    -> find admission certificate (Blob)
//        POST /search-diploma        -> find graduation certificate (Blob)
//        GET  /certificate/{file}    -> return admission image bytes
//        GET  /diploma/{file}        -> return graduation image bytes
//   2. Serve the SPA (index.html) for legacy history-mode deep links only.
//      With hash routing, the browser only ever requests "/", which EdgeOne
//      serves as a static file (NOT via this function). The built entry is still
//      shipped into the function bundle via edgeone.json `cloudFunctions.includeFiles`
//      (dist/index.html) so this function can answer history-mode links. All
//      function responses here carry a custom `Server: ChinaUnicomWAF` header.
//
// Persistence: all mutable data (images, RSA keys) lives in EdgeOne Blob
// storage (@edgeone/pages-blob), which is the serverless equivalent of the
// old local `certificate/`, `diploma/` and `server/keys/` directories.

import crypto from 'node:crypto'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { getStore } from '@edgeone/pages-blob'

// ===== Configuration (env-overridable, like the original server) =====
const VALID_USERNAME = process.env.ADMIN_USERNAME || 'admin'
const VALID_PASSWORD = process.env.ADMIN_PASSWORD || 'ceet2016'

// Secret used to sign session tokens. MUST be overridden in production via the
// TOKEN_SECRET environment variable — otherwise tokens can be forged offline.
const TOKEN_SECRET = process.env.TOKEN_SECRET || 'dev-only-insecure-secret-change-me'
// Token lifetime matches the frontend route guard (24h).
const TOKEN_TTL_MS = 24 * 60 * 60 * 1000

if (VALID_USERNAME === 'admin' && VALID_PASSWORD === 'ceet2016') {
  console.warn('[安全警告] 正在使用默认管理员账号/密码，请在部署环境中通过 ADMIN_USERNAME / ADMIN_PASSWORD 环境变量设置强凭据。')
}
if (TOKEN_SECRET === 'dev-only-insecure-secret-change-me') {
  console.warn('[安全警告] 正在使用默认 TOKEN_SECRET，请通过环境变量 TOKEN_SECRET 设置强随机值，否则登录令牌可被伪造。')
}

// Custom `Server` value. NOTE: EdgeOne Pages/Makers DOES NOT allow overriding
// the `Server` header on *static* responses (it is a platform-reserved header
// injected by the node as `edgeone-pages`, and edgeone.json `headers` cannot
// change it). This constant only affects responses emitted by THIS function
// (API routes + SPA fallback). To mask `Server` on static assets, the domain
// must be configured as a managed EdgeOne "站点" and use the console Rule
// Engine ("修改 HTTP 节点响应头" -> 设置 Server).
const SERVER_HEADER_VALUE = 'ChinaUnicomWAF'

// Blob namespaces (auto-created on first use by the SDK)
const CERT_STORE = 'certificates'
const DIPLOMA_STORE = 'diplomas'
const KEY_STORE = 'app-keys'

const certStore = () => getStore(CERT_STORE)
const dipStore = () => getStore(DIPLOMA_STORE)
const keyStore = () => getStore(KEY_STORE)

// In-memory cache so we don't re-read keys from Blob on every warm request.
let keyCache = null

// ===== RSA key pair (persisted in Blob so it survives across invocations) =====
async function getKeys() {
  // Optional: keep the private key in a secret env var instead of Blob.
  if (process.env.RSA_PUBLIC_KEY && process.env.RSA_PRIVATE_KEY) {
    return { publicKey: process.env.RSA_PUBLIC_KEY, privateKey: process.env.RSA_PRIVATE_KEY }
  }
  if (keyCache) return keyCache

  const ks = keyStore()
  let publicKey = await ks.get('public.pem', { type: 'text' })
  let privateKey = await ks.get('private.pem', { type: 'text' })

  if (!publicKey || !privateKey) {
    const pair = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
    })
    publicKey = pair.publicKey
    privateKey = pair.privateKey
    await ks.set('public.pem', publicKey)
    await ks.set('private.pem', privateKey)
    console.log('[RSA] generated and persisted new key pair to Blob')
  }

  keyCache = { publicKey, privateKey }
  return keyCache
}

function rsaDecrypt(encryptedBase64, privateKeyPem) {
  const ciphertext = Buffer.from(encryptedBase64, 'base64')
  return crypto
    .privateDecrypt(
      {
        key: privateKeyPem,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256'
      },
      ciphertext
    )
    .toString('utf8')
}

// ===== Stateless signed session token (serverless-friendly) =====
// The login endpoint issues an HMAC-SHA256 signed token. Write endpoints
// (/save-image, /save-diploma) verify it. No shared server state is required,
// so it works correctly across EdgeOne's isolated function invocations and the
// dev server alike. The token embeds its own expiry (24h).
function signToken(username) {
  const payload = { sub: username, iat: Date.now(), exp: Date.now() + TOKEN_TTL_MS }
  const data = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url')
  const sig = crypto.createHmac('sha256', TOKEN_SECRET).update(data).digest('base64url')
  return `${data}.${sig}`
}

function verifyToken(token) {
  if (!token || typeof token !== 'string') return null
  const parts = token.split('.')
  if (parts.length !== 2) return null
  const [data, sig] = parts
  const expected = crypto.createHmac('sha256', TOKEN_SECRET).update(data).digest('base64url')
  const a = Buffer.from(sig)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null
  let payload
  try {
    payload = JSON.parse(Buffer.from(data, 'base64url').toString('utf8'))
  } catch {
    return null
  }
  if (!payload.exp || Date.now() > payload.exp) return null
  return payload
}

function extractBearer(request) {
  const auth = request.headers && request.headers.get ? request.headers.get('authorization') : ''
  if (auth && auth.startsWith('Bearer ')) return auth.slice(7).trim()
  return null
}

// Returns the verified token payload, or null if missing/invalid/expired.
function requireAuth(request) {
  return verifyToken(extractBearer(request))
}

// ===== Response helpers =====
function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Server': SERVER_HEADER_VALUE
    }
  })
}

function handleOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Server': SERVER_HEADER_VALUE
    }
  })
}

// ===== Image storage handlers =====
async function saveImageHandler(request, store) {
  const form = await request.formData()
  const file = form.get('image')
  if (!file) {
    return json({ success: false, message: '图片数据或文件名缺失' })
  }
  const buffer = Buffer.from(await file.arrayBuffer())
  // Defense-in-depth: cap upload size to avoid storage/DoS abuse.
  const MAX_IMAGE_BYTES = 10 * 1024 * 1024
  if (buffer.length > MAX_IMAGE_BYTES) {
    return json({ success: false, message: '文件过大，单次上传不能超过 10MB' })
  }
  const filename = (file.name || `image_${Date.now()}.jpg`).replace(/[^\w.\-\u4e00-\u9fa5]/g, '_')
  await store.set(filename, buffer)
  console.log(`[保存] ${filename} (${buffer.length} bytes)`)
  return json({ success: true, message: `已保存: ${filename}`, filename })
}

async function searchHandler(store, fullName, idNumber) {
  const candidates = [`${fullName}_${idNumber}.jpg`, `${idNumber}.jpg`]
  for (const key of candidates) {
    const data = await store.get(key, { type: 'arrayBuffer' })
    if (data) {
      const base64 = Buffer.from(data).toString('base64')
      return json({ success: true, message: '查询成功', image: base64, filename: key })
    }
  }
  return json({
    success: false,
    message: `未找到姓名为 ${fullName}、证件号为 ${idNumber} 的证书`
  })
}

async function getImageHandler(store, rawFilename) {
  const filename = decodeURIComponent(rawFilename).split('/').pop()
  if (!filename.toLowerCase().endsWith('.jpg')) {
    return new Response('Not Found', { status: 404, headers: { 'Server': SERVER_HEADER_VALUE } })
  }
  const data = await store.get(filename, { type: 'arrayBuffer' })
  if (!data) {
    return new Response('Not Found', { status: 404, headers: { 'Server': SERVER_HEADER_VALUE } })
  }
  return new Response(new Uint8Array(data), {
    status: 200,
    headers: {
      'Content-Type': 'image/jpeg',
      'Cache-Control': 'public, max-age=3600',
      'Access-Control-Allow-Origin': '*',
      'Content-Disposition': `inline; filename="${filename}"`,
      'Server': SERVER_HEADER_VALUE
    }
  })
}

// ===== SPA fallback =====
// EdgeOne Makers does NOT support SPA history rewrites, and an in-function
// fetch('/index.html') re-enters this same catch-all function (loop). The
// correct, official way to return the built entry is to read it from disk via
// the `cloudFunctions.includeFiles` mechanism (edgeone.json ships
// dist/index.html into the function bundle). Blob is kept only as a warm-cache
// backup. With the SPA now using hash routing, the browser only ever requests
// "/" (which is served as a static file), so this function path is rarely hit;
// it mainly covers legacy history-mode deep links.
const SPA_STORE = 'spa-shell'
let spaIndexCache = null

// includeFiles copies dist/index.html into the bundle; try the most likely
// relative locations so the lookup is robust to the bundler's layout.
const SPA_CANDIDATES = [
  join(process.cwd(), 'dist', 'index.html'),
  join(process.cwd(), 'index.html'),
  join(process.cwd(), 'cloud-functions', 'dist', 'index.html'),
  'dist/index.html',
  'index.html'
]

async function readSpaFromBlob() {
  try {
    const html = await getStore(SPA_STORE).get('index.html', { type: 'text' })
    if (html) return html
  } catch (e) {
    console.error('[SPA] Blob read failed:', e.message)
  }
  return null
}

function loadIndexFromDisk() {
  for (const p of SPA_CANDIDATES) {
    try {
      const html = readFileSync(p, 'utf8')
      if (html && html.includes('</html>')) return html
    } catch (e) {
      // not at this candidate path; try the next one
    }
  }
  return null
}

function spaResponse(html) {
  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-cache',
      'Server': SERVER_HEADER_VALUE
    }
  })
}

async function serveIndexHtml(context, request) {
  // 1) In-memory warm cache
  if (spaIndexCache) return spaResponse(spaIndexCache)

  // 2) Blob copy (cached at runtime on a previous hit, or uploaded at build time)
  const blobHtml = await readSpaFromBlob()
  if (blobHtml) {
    spaIndexCache = blobHtml
    return spaResponse(blobHtml)
  }

  // 3) Read the bundled index.html directly from disk (official includeFiles path)
  const diskHtml = loadIndexFromDisk()
  if (diskHtml) {
    spaIndexCache = diskHtml
    // best-effort: cache into Blob so subsequent warm requests skip disk I/O
    try { await getStore(SPA_STORE).set('index.html', diskHtml) } catch (e) { /* ignore */ }
    return spaResponse(diskHtml)
  }

  // 4) Last resort: a self-contained loading page that sends the user to the
  //    SPA root. No external fetch, no loop, no dependency on the platform.
  return new Response(
    '<!DOCTYPE html><html lang="zh-CN"><head><meta charset="utf-8"><title>页面加载中</title>' +
    '<meta http-equiv="refresh" content="0;url=/#/"></head>' +
    '<body style="font-family:sans-serif;padding:40px;text-align:center;color:#666">' +
    '正在加载，即将进入…</body></html>',
    { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Server': SERVER_HEADER_VALUE } }
  )
}

// ===== Main router =====
export async function onRequest(context) {
  const { request } = context
  const url = new URL(request.url)
  const pathname = url.pathname
  const method = request.method

  if (method === 'OPTIONS') return handleOptions()

  try {
    // GET /login/public-key
    if (method === 'GET' && pathname === '/login/public-key') {
      const { publicKey } = await getKeys()
      return json({ success: true, publicKey })
    }

    // POST /login
    if (method === 'POST' && pathname === '/login') {
      const body = await request.json().catch(() => ({}))
      const username = (body.username || '').trim()
      const encryptedPassword = body.encryptedPassword || ''

      if (!username || !encryptedPassword) {
        return json({ success: false, message: '用户名或密码不能为空' })
      }

      let password
      try {
        const { privateKey } = await getKeys()
        password = rsaDecrypt(encryptedPassword, privateKey)
      } catch (e) {
        return json({ success: false, message: '密码解密失败，请刷新页面后重试' })
      }

      if (username === VALID_USERNAME && password === VALID_PASSWORD) {
        const token = signToken(username)
        return json({ success: true, token, message: '登录成功' })
      }
      return json({ success: false, message: '用户名或密码错误' })
    }

    // POST /save-image  (requires login — add/modify operation)
    if (method === 'POST' && pathname === '/save-image') {
      if (!requireAuth(request)) {
        return json({ success: false, message: '未授权：请先登录后再保存通知书' }, 401)
      }
      return await saveImageHandler(request, certStore())
    }

    // POST /save-diploma  (requires login — add/modify operation)
    if (method === 'POST' && pathname === '/save-diploma') {
      if (!requireAuth(request)) {
        return json({ success: false, message: '未授权：请先登录后再保存毕业证' }, 401)
      }
      return await saveImageHandler(request, dipStore())
    }

    // POST /search-certificate
    if (method === 'POST' && pathname === '/search-certificate') {
      const body = await request.json().catch(() => ({}))
      const fullName = (body.fullName || '').trim()
      const idNumber = (body.idNumber || '').trim()
      if (!fullName || !idNumber) {
        return json({ success: false, message: '请提供姓名和证件号' })
      }
      return await searchHandler(certStore(), fullName, idNumber)
    }

    // POST /search-diploma
    if (method === 'POST' && pathname === '/search-diploma') {
      const body = await request.json().catch(() => ({}))
      const fullName = (body.fullName || '').trim()
      const idNumber = (body.idNumber || '').trim()
      if (!fullName || !idNumber) {
        return json({ success: false, message: '请提供姓名和证件号' })
      }
      return await searchHandler(dipStore(), fullName, idNumber)
    }

    // GET /certificate/{filename}
    if (method === 'GET' && pathname.startsWith('/certificate/')) {
      const filename = pathname.replace('/certificate/', '')
      return await getImageHandler(certStore(), filename)
    }

    // GET /diploma/{filename}  (note: /diploma-select is a SPA page, not matched here)
    if (method === 'GET' && pathname.startsWith('/diploma/')) {
      const filename = pathname.replace('/diploma/', '')
      return await getImageHandler(dipStore(), filename)
    }

    // SPA fallback for everything else (GET navigation to client-side routes)
    if (method === 'GET') {
      return await serveIndexHtml(context, request)
    }

    return new Response('Not Found', { status: 404, headers: { 'Server': SERVER_HEADER_VALUE } })
  } catch (e) {
    console.error('[错误]', e)
    return json({ success: false, message: `服务器错误: ${e.message}` }, 200)
  }
}
