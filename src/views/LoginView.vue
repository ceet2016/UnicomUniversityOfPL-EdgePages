<template>
  <div class="login-page">
    <AppHeader />

    <div class="login-hero">
      <!-- Left branded panel -->
      <div class="login-brand-panel">
        <div class="brand-overlay"></div>
        <div class="brand-content">
          <div class="brand-logo">
            <img src="/images/favicon.ico" :alt="t('siteName')" />
          </div>
          <h2 class="brand-title">{{ t('siteName') }}</h2>
          <p class="brand-title-en">{{ t('siteNameEn') }}</p>
          <div class="brand-divider"></div>
          <p class="brand-motto">{{ t('login.brandMotto') }}</p>
          <p class="brand-motto-en">{{ t('login.brandMottoEn') }}</p>
          <div class="brand-decoration">
            <div class="decoration-line"></div>
            <div class="decoration-diamond"></div>
            <div class="decoration-line"></div>
          </div>
          <p class="brand-desc">
            {{ t('login.loginTitle') }}<br />
            {{ t('login.loginDesc') }}
          </p>
        </div>
      </div>

      <!-- Right form panel -->
      <div class="login-form-panel">
        <div class="login-box">
          <div class="login-header">
            <div class="header-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <h1>{{ t('login.loginTitle') }}</h1>
            <p>{{ t('login.loginSubtitle') }}</p>
          </div>

          <div v-if="isMobile" class="mobile-warning">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            <span>{{ t('login.mobileWarning') }}</span>
          </div>

          <form @submit.prevent="handleLogin" class="login-form">
            <div class="form-group">
              <label class="form-label">{{ t('login.username') }}</label>
              <div class="input-wrapper">
                <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <input
                  v-model="username"
                  type="text"
                  class="form-input login-input"
                  :class="{ error: loginError }"
                  :placeholder="t('login.usernamePlaceholder')"
                  autocomplete="username"
                />
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">{{ t('login.password') }}</label>
              <div class="input-wrapper">
                <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <input
                  v-model="password"
                  type="password"
                  class="form-input login-input"
                  :class="{ error: loginError }"
                  :placeholder="t('login.passwordPlaceholder')"
                  autocomplete="current-password"
                />
              </div>
            </div>

            <Transition name="fade">
              <div v-if="loginError" class="login-error">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <span>{{ loginError }}</span>
                <button
                  v-if="!publicKeyPem && !loginError.includes('配置错误')"
                  type="button"
                  class="retry-btn"
                  @click="fetchPublicKey"
                >
                  重试
                </button>
              </div>
            </Transition>

            <button type="submit" class="login-btn" :disabled="loading">
              <span v-if="loading" class="btn-spinner"></span>
              {{ loading ? t('login.loggingIn') : t('login.loginBtn') }}
            </button>
          </form>

          <div class="login-footer">
            <router-link to="/" class="footer-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
              {{ $t('common.backToHome') }}
            </router-link>
            <router-link to="/select" class="footer-link">
              {{ $t('header.queryLetter') }}
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </router-link>
            <router-link to="/diploma-select" class="footer-link">
              {{ $t('diplomaSelect.title') }}
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <AppFooter />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'

const { t } = useI18n()
const router = useRouter()

const username = ref('')
const password = ref('')
const loginError = ref('')
const loading = ref(false)
const isMobile = ref(false)
const publicKeyPem = ref('') // 存储从后端获取的公钥

const checkMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

// 将 PEM 格式公钥转换为 Web Crypto API 可用的格式
const pemToArrayBuffer = (pem) => {
  const b64 = pem.replace(/-----BEGIN[^-----]+-----/, '').replace(/-----END[^-----]+-----/, '').replace(/\s+/g, '')
  const binaryStr = atob(b64)
  const buffer = new ArrayBuffer(binaryStr.length)
  const view = new Uint8Array(buffer)
  for (let i = 0; i < binaryStr.length; i++) {
    view[i] = binaryStr.charCodeAt(i)
  }
  return buffer
}

// 用 RSA 公钥加密数据（OAEP + SHA-256）
const encryptWithRSA = async (data, pemPublicKey) => {
  const arrayBuffer = pemToArrayBuffer(pemPublicKey)
  const cryptoKey = await window.crypto.subtle.importKey(
    'spki',
    arrayBuffer,
    { name: 'RSA-OAEP', hash: 'SHA-256' },
    false,
    ['encrypt']
  )
  const encoder = new TextEncoder()
  const dataBuffer = encoder.encode(data)
  const encrypted = await window.crypto.subtle.encrypt(
    { name: 'RSA-OAEP', hash: 'SHA-256' },
    cryptoKey,
    dataBuffer
  )
  // 返回 base64 编码的加密数据
  return btoa(String.fromCharCode(...new Uint8Array(encrypted)))
}

// 获取 RSA 公钥（独立函数，支持重试）
const fetchPublicKey = async () => {
  loginError.value = ''
  publicKeyPem.value = ''

  try {
    const resp = await fetch('/login/public-key')

    // 检查响应类型——如果不是 JSON，说明被 Nginx 拦截返回了 HTML
    const contentType = resp.headers.get('content-type') || ''
    if (!contentType.includes('application/json')) {
      const text = await resp.text()
      if (text.includes('<!DOCTYPE') || text.includes('<html')) {
        loginError.value = '服务器配置错误：未配置登录 API 代理，请联系管理员'
        console.error('获取公钥失败: 服务器返回了 HTML 而非 JSON，请检查 Nginx 代理配置')
      } else {
        loginError.value = '服务器响应格式错误，请稍后重试'
      }
      return
    }

    const result = await resp.json()
    if (result.success) {
      publicKeyPem.value = result.publicKey
      loginError.value = ''
    } else {
      loginError.value = '获取加密公钥失败：' + (result.message || '请刷新页面重试')
    }
  } catch (e) {
    if (!navigator.onLine) {
      loginError.value = '网络连接已断开，请检查网络后重试'
    } else {
      loginError.value = '无法连接服务器，请稍后重试'
    }
    console.error('获取公钥失败:', e)
  }
}

// 页面加载时获取公钥
onMounted(async () => {
  isMobile.value = checkMobile()

  // 检查是否已登录
  const token = localStorage.getItem('sessionToken')
  const loginTime = localStorage.getItem('loginTime')
  if (token && loginTime) {
    const elapsed = Date.now() - parseInt(loginTime)
    if (elapsed < 24 * 60 * 60 * 1000) {
      router.push('/dashboard')
      return
    } else {
      localStorage.removeItem('sessionToken')
      localStorage.removeItem('loginTime')
    }
  }

  // 获取 RSA 公钥
  await fetchPublicKey()
})

const handleLogin = async () => {
  loginError.value = ''

  if (!username.value.trim()) {
    loginError.value = t('login.loginErrorUser')
    return
  }
  if (!password.value.trim()) {
    loginError.value = t('login.loginErrorPass')
    return
  }
  if (!publicKeyPem.value) {
    loginError.value = '加密公钥未加载，请刷新页面'
    return
  }

  loading.value = true

  try {
    // 用 RSA 公钥加密密码
    const encryptedPassword = await encryptWithRSA(password.value, publicKeyPem.value)

    const response = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username.value,
        encryptedPassword: encryptedPassword // 发送加密后的密码
      })
    })

    const result = await response.json()

    if (result.success) {
      localStorage.setItem('sessionToken', result.token)
      localStorage.setItem('loginTime', Date.now().toString())
      router.push('/dashboard')
    } else {
      loginError.value = result.message || t('login.loginErrorWrong')
      loading.value = false
    }
  } catch (error) {
    loginError.value = '登录请求失败，请稍后重试'
    loading.value = false
    console.error('登录请求失败:', error)
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-page);
}

.login-hero {
  flex: 1;
  display: flex;
  margin-top: var(--header-height);
  min-height: calc(100vh - var(--header-height));
}

/* === Left brand panel === */
.login-brand-panel {
  flex: 1;
  position: relative;
  background: var(--gradient-hero);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.login-brand-panel::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url('/images/unsplash_17.jpg');
  background-size: cover;
  background-position: center;
  opacity: 0.12;
}

.brand-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(13, 45, 90, 0.92) 0%, rgba(26, 75, 140, 0.88) 100%);
}

.brand-content {
  position: relative;
  z-index: 1;
  text-align: center;
  color: var(--white);
  padding: 60px 50px;
  max-width: 480px;
}

.brand-logo {
  width: 90px;
  height: 90px;
  margin: 0 auto 24px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.brand-logo img {
  width: 54px;
  height: 54px;
}

.brand-title {
  font-size: 1.9rem;
  font-weight: 700;
  letter-spacing: 2px;
  margin-bottom: 6px;
}

.brand-title-en {
  font-size: 0.85rem;
  opacity: 0.75;
  letter-spacing: 1px;
  font-family: var(--font-serif);
}

.brand-divider {
  width: 40px;
  height: 2px;
  background: var(--accent);
  margin: 24px auto;
  border-radius: 1px;
}

.brand-motto {
  font-size: 1.15rem;
  font-weight: 600;
  letter-spacing: 4px;
  margin-bottom: 4px;
}

.brand-motto-en {
  font-size: 0.75rem;
  opacity: 0.6;
  font-family: var(--font-serif);
  letter-spacing: 1px;
}

.brand-decoration {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin: 36px 0;
}

.decoration-line {
  flex: 1;
  max-width: 60px;
  height: 1px;
  background: rgba(255, 255, 255, 0.25);
}

.decoration-diamond {
  width: 8px;
  height: 8px;
  background: var(--accent);
  transform: rotate(45deg);
}

.brand-desc {
  font-size: 0.85rem;
  line-height: 2;
  opacity: 0.7;
}

/* === Right form panel === */
.login-form-panel {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 30px;
  background: var(--bg-page);
}

.login-box {
  width: 100%;
  max-width: 400px;
}

.login-header {
  text-align: center;
  margin-bottom: 36px;
}

.header-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 20px;
  background: var(--primary-bg);
  color: var(--primary);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-header h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-dark);
  margin-bottom: 6px;
}

.login-header p {
  font-size: 0.85rem;
  color: var(--text-muted);
  letter-spacing: 1px;
}

.mobile-warning {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: #fef3cd;
  color: #856404;
  border-radius: var(--radius-md);
  margin-bottom: 24px;
  font-size: 0.8rem;
}

.input-wrapper {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--gray-400);
  pointer-events: none;
  z-index: 1;
}

.login-input {
  height: 50px;
  padding-left: 44px;
}

.login-input.error {
  border-color: #e53e3e;
}

.login-error {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #e53e3e;
  font-size: 0.85rem;
  margin-bottom: 16px;
  padding: 10px 14px;
  background: #fef2f2;
  border-radius: var(--radius-md);
  border-left: 3px solid #ef4444;
}

.retry-btn {
  margin-left: auto;
  padding: 4px 12px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.2s;
}

.retry-btn:hover {
  background: #dc2626;
}

.login-btn {
  width: 100%;
  height: 50px;
  background: var(--gradient-primary);
  color: var(--white);
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 4px;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 8px;
  box-shadow: var(--shadow-blue);
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(26, 75, 140, 0.3);
}

.login-btn:active:not(:disabled) {
  transform: translateY(0);
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: var(--white);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.login-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid var(--border-light);
}

.footer-link {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  color: var(--text-muted);
  transition: color 0.2s;
}

.footer-link:hover {
  color: var(--primary);
}

/* Animations */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* === Responsive === */
@media (max-width: 900px) {
  .login-hero {
    flex-direction: column;
  }

  .login-brand-panel {
    min-height: 240px;
    flex: none;
  }

  .brand-content {
    padding: 40px 30px;
  }

  .brand-title {
    font-size: 1.5rem;
  }

  .brand-decoration {
    margin: 20px 0;
  }

  .brand-desc {
    display: none;
  }

  .login-form-panel {
    padding: 40px 20px;
  }
}

@media (max-width: 480px) {
  .login-footer {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }

  .footer-link {
    justify-content: center;
  }
}
</style>
