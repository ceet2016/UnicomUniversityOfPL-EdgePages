#!/usr/bin/env node
// -*- coding: utf-8 -*-

/**
 * 波兰联通大学 - 证书后端服务 (Node.js 版本)
 * 支持：录取通知书 + 毕业证书 + 登录验证（RSA 2048 加密）
 *
 * 启动: node server.js
 * 端口: 8082
 */

import http from 'http'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { fileURLToPath } from 'url'

// ========== 配置 ==========
const PORT = 8082
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// 从环境变量读取登录凭据，默认 admin / ceet2016
const VALID_USERNAME = process.env.ADMIN_USERNAME || 'admin'
const VALID_PASSWORD = process.env.ADMIN_PASSWORD || 'ceet2016'

// 签名会话令牌所用的密钥。生产环境务必通过 TOKEN_SECRET 环境变量设置强随机值，
// 否则登录令牌可被离线伪造。
const TOKEN_SECRET = process.env.TOKEN_SECRET || 'dev-only-insecure-secret-change-me'
// 令牌有效期与前端路由守卫一致（24 小时）。
const TOKEN_TTL_MS = 24 * 60 * 60 * 1000

if (VALID_USERNAME === 'admin' && VALID_PASSWORD === 'ceet2016') {
  console.warn('[安全警告] 正在使用默认管理员账号/密码，请通过 ADMIN_USERNAME / ADMIN_PASSWORD 环境变量设置强凭据。')
}
if (TOKEN_SECRET === 'dev-only-insecure-secret-change-me') {
  console.warn('[安全警告] 正在使用默认 TOKEN_SECRET，请通过环境变量 TOKEN_SECRET 设置强随机值，否则登录令牌可被伪造。')
}

// RSA 密钥文件路径
const KEYS_DIR = path.join(__dirname, 'keys')
const PUBLIC_KEY_PATH = path.join(KEYS_DIR, 'public.pem')
const PRIVATE_KEY_PATH = path.join(KEYS_DIR, 'private.pem')

// 证书存储目录
const ROOT_DIR = path.join(__dirname, '..')
const CERTIFICATE_DIR = path.join(ROOT_DIR, 'certificate')
const DIPLOMA_DIR = path.join(ROOT_DIR, 'diploma')
;[CERTIFICATE_DIR, DIPLOMA_DIR, KEYS_DIR].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true })
})

// ===== 无状态签名会话令牌（与 cloud function 保持一致）=====
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

function bearerFromReq(req) {
  const auth = req.headers['authorization'] || ''
  if (auth.startsWith('Bearer ')) return auth.slice(7).trim()
  return ''
}

// ========== RSA 工具函数 ==========

function getPublicKeyPem() {
  return fs.readFileSync(PUBLIC_KEY_PATH, 'utf8')
}

function rsaDecrypt(encryptedBase64) {
  const privateKeyPem = fs.readFileSync(PRIVATE_KEY_PATH, 'utf8')
  const ciphertext = Buffer.from(encryptedBase64, 'base64')
  const decrypted = crypto.privateDecrypt(
    {
      key: privateKeyPem,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256'
    },
    ciphertext
  )
  return decrypted.toString('utf8')
}

// ========== HTTP 请求工具 ==========

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', chunk => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

function sendJson(res, statusCode, data, cors = true) {
  const body = JSON.stringify(data, null, 2)
  if (cors) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  }
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' })
  res.end(body)
}

function sendError(res, statusCode, message) {
  res.writeHead(statusCode)
  res.end(message)
}

// ========== 处理 multipart/form-data（保存图片）==========
function parseMultipart(body, contentType) {
  const boundary = contentType.split('boundary=')[1]
  if (!boundary) throw new Error('Missing boundary')

  const parts = { image: null, filename: null }
  const boundaryBuf = Buffer.from('--' + boundary)
  let pos = 0

  while (pos < body.length) {
    let boundaryPos = body.indexOf(boundaryBuf, pos)
    if (boundaryPos === -1) break

    let dataStart = boundaryPos + boundaryBuf.length + 2
    if (body[dataStart] === 0x2D && body[dataStart + 1] === 0x2D) break

    let headerEnd = body.indexOf(Buffer.from('\r\n\r\n'), dataStart)
    if (headerEnd === -1) break

    const headerStr = body.slice(dataStart, headerEnd).toString('utf8')
    let partBody = body.slice(headerEnd + 4)

    let nextBoundary = partBody.indexOf(boundaryBuf)
    if (nextBoundary !== -1) {
      let end = nextBoundary
      if (partBody[end - 2] === 0x0D && partBody[end - 1] === 0x0A) end -= 2
      partBody = partBody.slice(0, end)
    }

    if (headerStr.includes('name="image"')) {
      parts.image = partBody
    }
    if (headerStr.includes('filename="')) {
      const match = headerStr.match(/filename="([^"]+)"/)
      if (match) parts.filename = match[1]
    }

    pos = boundaryPos + boundaryBuf.length
  }

  return parts
}

// ========== 请求处理 ==========

async function handleRequest(req, res) {
  const urlObj = new URL(req.url, `http://${req.headers.host}`)
  const pathname = urlObj.pathname

  // CORS 预检
  if (req.method === 'OPTIONS') {
    sendJson(res, 200, {})
    return
  }

  try {
    // ===== GET /login/public-key =====
    if (req.method === 'GET' && pathname === '/login/public-key') {
      if (!fs.existsSync(PUBLIC_KEY_PATH)) {
        sendJson(res, 200, { success: false, message: '公钥文件不存在' })
        return
      }
      const publicKey = getPublicKeyPem()
      sendJson(res, 200, { success: true, publicKey })
      console.log('[公钥] 已发送 RSA 公钥')
      return
    }

    // ===== POST /login =====
    if (req.method === 'POST' && pathname === '/login') {
      const body = await readBody(req)
      const data = JSON.parse(body.toString('utf8'))

      const username = (data.username || '').trim()
      const encryptedPassword = data.encryptedPassword || ''

      if (!username || !encryptedPassword) {
        sendJson(res, 200, { success: false, message: '用户名或密码不能为空' })
        return
      }

      // RSA 解密
      let password
      try {
        password = rsaDecrypt(encryptedPassword)
        console.log(`[登录] 解密成功，用户: ${username}`)
      } catch (e) {
        console.error(`[登录] 解密失败:`, e.message)
        sendJson(res, 200, { success: false, message: '密码解密失败，请刷新页面后重试' })
        return
      }

      // 验证凭据
      if (username === VALID_USERNAME && password === VALID_PASSWORD) {
        const token = signToken(username)
        sendJson(res, 200, { success: true, token, message: '登录成功' })
        console.log(`[登录成功] 用户: ${username}`)
      } else {
        sendJson(res, 200, { success: false, message: '用户名或密码错误' })
        console.log(`[登录失败] 用户: ${username}`)
      }
      return
    }

    // ===== POST /save-image (requires login — add/modify operation) =====
    if (req.method === 'POST' && pathname === '/save-image') {
      if (!verifyToken(bearerFromReq(req))) {
        sendJson(res, 401, { success: false, message: '未授权：请先登录后再保存通知书' })
        return
      }
      const body = await readBody(req)
      const contentType = req.headers['content-type'] || ''
      const parts = parseMultipart(body, contentType)

      if (!parts.image || !parts.filename) {
        sendJson(res, 200, { success: false, message: '图片数据或文件名缺失' })
        return
      }

      const safeFilename = path.basename(parts.filename)
      const filepath = path.join(CERTIFICATE_DIR, safeFilename)
      fs.writeFileSync(filepath, parts.image)

      sendJson(res, 200, { success: true, message: `通知书已保存: ${safeFilename}`, filename: safeFilename })
      console.log(`[通知书保存] ${filepath} (${parts.image.length} bytes)`)
      return
    }

    // ===== POST /save-diploma (requires login — add/modify operation) =====
    if (req.method === 'POST' && pathname === '/save-diploma') {
      if (!verifyToken(bearerFromReq(req))) {
        sendJson(res, 401, { success: false, message: '未授权：请先登录后再保存毕业证' })
        return
      }
      const body = await readBody(req)
      const contentType = req.headers['content-type'] || ''
      const parts = parseMultipart(body, contentType)

      if (!parts.image || !parts.filename) {
        sendJson(res, 200, { success: false, message: '图片数据或文件名缺失' })
        return
      }

      const safeFilename = path.basename(parts.filename)
      const filepath = path.join(DIPLOMA_DIR, safeFilename)
      fs.writeFileSync(filepath, parts.image)

      sendJson(res, 200, { success: true, message: `毕业证已保存: ${safeFilename}`, filename: safeFilename })
      console.log(`[毕业证保存] ${filepath} (${parts.image.length} bytes)`)
      return
    }

    // ===== POST /search-certificate =====
    if (req.method === 'POST' && pathname === '/search-certificate') {
      const body = await readBody(req)
      const data = JSON.parse(body.toString('utf8'))

      const fullName = (data.fullName || '').trim()
      const idNumber = (data.idNumber || '').trim()

      if (!fullName || !idNumber) {
        sendJson(res, 200, { success: false, message: '请提供姓名和身份证号' })
        return
      }

      const certFilename = `${fullName}_${idNumber}.jpg`
      const certPath = path.join(CERTIFICATE_DIR, certFilename)
      const oldPath = path.join(CERTIFICATE_DIR, `${idNumber}.jpg`)

      let foundPath = null
      let foundFilename = null
      if (fs.existsSync(certPath)) {
        foundPath = certPath
        foundFilename = certFilename
      } else if (fs.existsSync(oldPath)) {
        foundPath = oldPath
        foundFilename = `${idNumber}.jpg`
      }

      if (foundPath) {
        const imageData = fs.readFileSync(foundPath)
        const imageBase64 = imageData.toString('base64')
        sendJson(res, 200, { success: true, message: '查询成功', image: imageBase64, filename: foundFilename })
        console.log(`[通知书查询成功] ${foundPath}`)
      } else {
        sendJson(res, 200, { success: false, message: `未找到姓名为 ${fullName}、证件号为 ${idNumber} 的录取通知书` })
        console.log(`[通知书未找到] ${certPath}`)
      }
      return
    }

    // ===== POST /search-diploma =====
    if (req.method === 'POST' && pathname === '/search-diploma') {
      const body = await readBody(req)
      const data = JSON.parse(body.toString('utf8'))

      const fullName = (data.fullName || '').trim()
      const idNumber = (data.idNumber || '').trim()

      if (!fullName || !idNumber) {
        sendJson(res, 200, { success: false, message: '请提供姓名和身份证号' })
        return
      }

      const certFilename = `${fullName}_${idNumber}.jpg`
      const certPath = path.join(DIPLOMA_DIR, certFilename)
      const oldPath = path.join(DIPLOMA_DIR, `${idNumber}.jpg`)

      let foundPath = null
      let foundFilename = null
      if (fs.existsSync(certPath)) {
        foundPath = certPath
        foundFilename = certFilename
      } else if (fs.existsSync(oldPath)) {
        foundPath = oldPath
        foundFilename = `${idNumber}.jpg`
      }

      if (foundPath) {
        const imageData = fs.readFileSync(foundPath)
        const imageBase64 = imageData.toString('base64')
        sendJson(res, 200, { success: true, message: '查询成功', image: imageBase64, filename: foundFilename })
        console.log(`[毕业证查询成功] ${foundPath}`)
      } else {
        sendJson(res, 200, { success: false, message: `未找到姓名为 ${fullName}、证件号为 ${idNumber} 的毕业证` })
        console.log(`[毕业证未找到] ${certPath}`)
      }
      return
    }

    // ===== GET /certificate/... =====
    if (req.method === 'GET' && pathname.startsWith('/certificate/')) {
      const filename = decodeURIComponent(pathname.replace('/certificate/', ''))
      const safeFilename = path.basename(filename)
      const filepath = path.join(CERTIFICATE_DIR, safeFilename)

      if (fs.existsSync(filepath) && safeFilename.toLowerCase().endsWith('.jpg')) {
        const imageData = fs.readFileSync(filepath)
        res.setHeader('Content-Type', 'image/jpeg')
        res.setHeader('Content-Length', String(imageData.length))
        res.setHeader('Cache-Control', 'public, max-age=3600')
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Content-Disposition', `inline; filename="${safeFilename}"`)
        res.writeHead(200)
        res.end(imageData)
        console.log(`[通知书图片] 已提供: ${filepath} (${imageData.length} bytes)`)
      } else {
        sendError(res, 404, 'Not Found')
      }
      return
    }

    // ===== GET /diploma/... =====
    if (req.method === 'GET' && pathname.startsWith('/diploma/')) {
      const filename = decodeURIComponent(pathname.replace('/diploma/', ''))
      const safeFilename = path.basename(filename)
      const filepath = path.join(DIPLOMA_DIR, safeFilename)

      if (fs.existsSync(filepath) && safeFilename.toLowerCase().endsWith('.jpg')) {
        const imageData = fs.readFileSync(filepath)
        res.setHeader('Content-Type', 'image/jpeg')
        res.setHeader('Content-Length', String(imageData.length))
        res.setHeader('Cache-Control', 'public, max-age=3600')
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Content-Disposition', `inline; filename="${safeFilename}"`)
        res.writeHead(200)
        res.end(imageData)
        console.log(`[毕业证图片] 已提供: ${filepath} (${imageData.length} bytes)`)
      } else {
        sendError(res, 404, 'Not Found')
      }
      return
    }

    // 404
    sendError(res, 404, 'Not Found')

  } catch (e) {
    console.error('[错误]', e)
    sendJson(res, 200, { success: false, message: `服务器错误: ${e.message}` })
  }
}

// ========== 检查 RSA 密钥文件 ==========
if (!fs.existsSync(PUBLIC_KEY_PATH) || !fs.existsSync(PRIVATE_KEY_PATH)) {
  console.log('='.repeat(55))
  console.log('  [错误] RSA 密钥文件不存在！')
  console.log(`  公钥路径: ${PUBLIC_KEY_PATH}`)
  console.log(`  私钥路径: ${PRIVATE_KEY_PATH}`)
  console.log('  请先运行以下命令生成密钥对：')
  console.log('    cd server && node -e "')
  console.log("      const crypto = require('crypto');")
  console.log("      const fs = require('fs');")
  console.log("      const path = require('path');")
  console.log("      const dir = path.join(__dirname, 'keys');")
  console.log("      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });")
  console.log("      const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {")
  console.log("        modulusLength: 2048,")
  console.log("        publicKeyEncoding: { type: 'spki', format: 'pem' },")
  console.log("        privateKeyEncoding: { type: 'pkcs8', format: 'pem' }")
  console.log("      });")
  console.log("      fs.writeFileSync(path.join(dir, 'public.pem'), publicKey);")
  console.log("      fs.writeFileSync(path.join(dir, 'private.pem'), privateKey);")
  console.log("      console.log('密钥对已生成');")
  console.log('    "')
  console.log('='.repeat(55))
  process.exit(1)
}

// ========== 启动服务器 ==========
const server = http.createServer(handleRequest)

server.listen(PORT, '0.0.0.0', () => {
  console.log('='.repeat(55))
  console.log('  波兰联通大学 - 证书后端服务（RSA 2048 加密）')
  console.log('='.repeat(55))
  console.log(`  服务地址: <ADDRESS_REMOVE>http://localhost:${PORT}`)
  console.log(`  通知书目录: ${CERTIFICATE_DIR}`)
  console.log(`  毕业证目录: ${DIPLOMA_DIR}`)
  console.log('  API 端点:')
  console.log('    GET  /login/public-key  - 获取 RSA 公钥')
  console.log('    POST /login              - 登录（密码需 RSA 加密）')
  console.log('    POST /save-image         - 保存通知书图片')
  console.log('    POST /save-diploma       - 保存毕业证图片')
  console.log('    POST /search-certificate - 查询通知书')
  console.log('    POST /search-diploma     - 查询毕业证')
  console.log('    GET  /certificate/{fn}  - 获取通知书图片')
  console.log('    GET  /diploma/{fn}      - 获取毕业证图片')
  console.log('='.repeat(55))
  console.log(`  管理员账号: ${VALID_USERNAME}`)
  console.log(`  RSA 密钥: ${KEYS_DIR}`)
  console.log(`  前端开发服务器: <ADDRESS_REMOVE>http://localhost:3000`)
  console.log('  Vite 代理已配置 API 转发')
  console.log('='.repeat(55))
})

server.on('error', (e) => {
  console.error('[服务器错误]', e)
})
