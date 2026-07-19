<template>
  <div class="select-page">
    <AppHeader />

    <!-- Hero banner with campus background -->
    <div class="page-hero-banner">
      <div class="hero-bg"></div>
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <div class="hero-crest">
          <img src="/images/favicon.ico" alt="校徽" />
        </div>
        <h1>{{ t('diploma.queryTitle') }}</h1>
        <p>{{ t('diploma.querySubtitle') }}</p>
        <div class="hero-decoration">
          <span class="deco-line"></span>
          <span class="deco-diamond"></span>
          <span class="deco-line"></span>
        </div>
      </div>
    </div>

    <div class="container content-area">
      <!-- Search card -->
      <div class="search-card" v-scroll-reveal>
          <div class="card-header">
            <div class="card-header-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <path d="M9 15l2 2 4-4"/>
              </svg>
            </div>
            <div>
              <h2>{{ t('diploma.onlineQuery') }}</h2>
              <p>{{ t('diploma.queryDesc') }}</p>
            </div>
          </div>

        <form @submit.prevent="handleSearch" class="search-form">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">{{ t('diploma.name') }} <span class="required">*</span></label>
              <div class="input-wrapper">
                <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <input
                  v-model="searchForm.fullName"
                  type="text"
                  class="form-input search-input"
                  maxlength="8"
                  :placeholder="t('diploma.namePlaceholder')"
                  @input="searchForm.fullName = searchForm.fullName.replace(/[^a-zA-Z\u4e00-\u9fa5]/g, '')"
                />
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">{{ t('diploma.idNumber') }} <span class="required">*</span></label>
              <div class="input-wrapper">
                <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><circle cx="12" cy="10" r="2"/><path d="M8 16c0-2 2-3 4-3s4 1 4 3"/></svg>
                <input
                  v-model="searchForm.idNumber"
                  type="text"
                  class="form-input search-input"
                  maxlength="20"
                  :placeholder="t('diploma.idPlaceholder')"
                  @input="searchForm.idNumber = searchForm.idNumber.toUpperCase().replace(/[^A-Z0-9]/g, '')"
                />
              </div>
            </div>
          </div>

            <button type="submit" class="search-btn" :disabled="loading">
              <span v-if="loading" class="btn-spinner"></span>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              {{ loading ? t('diploma.querying') : t('diploma.queryBtn') }}
            </button>
        </form>

        <!-- Error message -->
        <Transition name="fade">
          <div v-if="errorMsg" class="search-error">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <span>{{ errorMsg }}</span>
          </div>
        </Transition>

        <!-- Query result -->
        <Transition name="slide-up">
            <div v-if="resultImage" class="search-result">
              <div class="result-badge">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                {{ t('diploma.querySuccess') }}
              </div>
              <h3 class="result-title">{{ t('diploma.diplomaTitle') }}</h3>
            <div class="result-frame">
              <div class="frame-corner top-left"></div>
              <div class="frame-corner top-right"></div>
              <div class="frame-corner bottom-left"></div>
              <div class="frame-corner bottom-right"></div>
              <img :src="resultImage" alt="毕业证书" class="result-image" />
            </div>
            <button @click="downloadResult" class="download-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              {{ t('diploma.download') }}
            </button>
          </div>
        </Transition>
      </div>

      <!-- Info section -->
      <div class="info-section" v-scroll-reveal="{ delay: 100 }">
        <div class="info-card-item">
          <div class="info-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
          </div>
          <h4>{{ t('diploma.instructions') }}</h4>
          <p>{{ t('diploma.instructionsText') }}</p>
        </div>
        <div class="info-card-item">
          <div class="info-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          </div>
          <h4>{{ t('diploma.contact') }}</h4>
          <p>{{ t('diploma.contactText') }}</p>
        </div>
        <div class="info-card-item">
          <div class="info-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <h4>{{ t('diploma.security') }}</h4>
          <p>{{ t('diploma.securityText') }}</p>
        </div>
      </div>

      <div class="back-link-wrapper">
        <router-link to="/" class="back-link">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          {{ $t('common.backToHome') }}
        </router-link>
      </div>
    </div>

    <AppFooter />
    <ScrollToTop />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import ScrollToTop from '@/components/common/ScrollToTop.vue'

const { t } = useI18n()
const route = useRoute()

const searchForm = reactive({
  fullName: '',
  idNumber: ''
})

const loading = ref(false)
const errorMsg = ref('')
const resultImage = ref('')
const resultName = ref('')
const resultId = ref('')

/**
 * Read ?name= and ?id= from the URL (set by the QR code on the diploma),
 * pre-fill the form, and — if ?auto=1 is present — fire the search immediately.
 * This lets a phone scan of the diploma open the page and return the result
 * without any manual input.
 */
onMounted(() => {
  const qName = route.query.name
  const qId = route.query.id
  const qAuto = route.query.auto
  if (qName) searchForm.fullName = String(qName)
  if (qId) searchForm.idNumber = String(qId)
  if (qAuto && qName && qId) {
    Promise.resolve().then(() => handleSearch())
  }
})

const handleSearch = async () => {
  errorMsg.value = ''
  resultImage.value = ''

  if (searchForm.fullName.length < 2) {
    errorMsg.value = '请输入完整的姓名（至少2个字符）'
    return
  }

  if (searchForm.idNumber.length < 6) {
    errorMsg.value = '请输入完整的身份证号/护照号（至少6位）'
    return
  }

  loading.value = true

  try {
    const response = await fetch('/search-diploma', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: searchForm.fullName,
        idNumber: searchForm.idNumber
      })
    })

    const data = await response.json()

    if (data.success && data.image) {
      resultImage.value = `data:image/jpeg;base64,${data.image}`
      resultName.value = searchForm.fullName
      resultId.value = searchForm.idNumber
    } else {
      errorMsg.value = data.message || '未找到毕业证书，请检查姓名和身份证号是否正确'
    }
  } catch (err) {
    errorMsg.value = '查询服务暂时不可用，请稍后重试或联系学校教务处'
  } finally {
    loading.value = false
  }
}

const downloadResult = () => {
  if (!resultImage.value) return

  const fileName = `${resultName.value}_${resultId.value}.jpg`
  const a = document.createElement('a')
  a.href = resultImage.value
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}
</script>

<style scoped>
.select-page {
  min-height: 100vh;
  background: var(--bg-page);
}

/* === Hero banner === */
.page-hero-banner {
  position: relative;
  height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: var(--white);
  overflow: hidden;
  margin-top: var(--header-height);
}

.hero-bg {
  position: absolute;
  inset: 0;
  background-image: url('/images/unsplash_18.jpg');
  background-size: cover;
  background-position: center;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(13, 45, 90, 0.88) 0%, rgba(26, 75, 140, 0.82) 100%);
}

.hero-content {
  position: relative;
  z-index: 1;
  padding: 0 20px;
}

.hero-crest {
  width: 72px;
  height: 72px;
  margin: 0 auto 18px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.hero-crest img {
  width: 44px;
  height: 44px;
}

.hero-content h1 {
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: 3px;
  margin-bottom: 8px;
}

.hero-content p {
  font-size: 0.85rem;
  opacity: 0.7;
  font-family: var(--font-serif);
  letter-spacing: 1px;
}

.hero-decoration {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 20px;
}

.deco-line {
  width: 50px;
  height: 1px;
  background: rgba(255, 255, 255, 0.3);
}

.deco-diamond {
  width: 8px;
  height: 8px;
  background: var(--accent);
  transform: rotate(45deg);
}

/* === Content area === */
.content-area {
  padding: 48px 0 60px;
}

/* === Search card === */
.search-card {
  background: var(--white);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  padding: 44px 48px;
  max-width: 820px;
  margin: 0 auto;
  position: relative;
  border-top: 4px solid var(--primary);
}

.search-card::before {
  content: '';
  position: absolute;
  top: -4px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background: var(--accent);
  border-radius: 0 0 2px 2px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 36px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--border-light);
}

.card-header-icon {
  width: 52px;
  height: 52px;
  flex-shrink: 0;
  background: var(--primary-bg);
  color: var(--primary);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-header h2 {
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--primary-dark);
  margin-bottom: 4px;
}

.card-header p {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.search-form {
  margin-bottom: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
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

.search-input {
  height: 50px;
  padding-left: 44px;
}

.search-btn {
  width: 100%;
  height: 52px;
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
  gap: 10px;
  box-shadow: var(--shadow-blue);
}

.search-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(26, 75, 140, 0.3);
}

.search-btn:disabled {
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

/* === Error === */
.search-error {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 20px;
  background: #fef2f2;
  color: #991b1b;
  border-radius: var(--radius-md);
  border-left: 4px solid #ef4444;
  font-size: 0.9rem;
  margin-top: 20px;
}

/* === Result === */
.search-result {
  margin-top: 32px;
  padding: 36px;
  background: linear-gradient(180deg, var(--primary-bg) 0%, var(--white) 100%);
  border-radius: var(--radius-lg);
  text-align: center;
  border: 1px solid var(--border-light);
}

.result-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px;
  background: #dcfce7;
  color: #166534;
  border-radius: var(--radius-full);
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 16px;
}

.result-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--primary-dark);
  margin-bottom: 24px;
  letter-spacing: 2px;
}

.result-frame {
  position: relative;
  display: inline-block;
  padding: 20px;
  margin-bottom: 24px;
}

.frame-corner {
  position: absolute;
  width: 24px;
  height: 24px;
  border: 3px solid var(--accent);
}

.frame-corner.top-left {
  top: 0;
  left: 0;
  border-right: none;
  border-bottom: none;
  border-radius: 4px 0 0 0;
}

.frame-corner.top-right {
  top: 0;
  right: 0;
  border-left: none;
  border-bottom: none;
  border-radius: 0 4px 0 0;
}

.frame-corner.bottom-left {
  bottom: 0;
  left: 0;
  border-right: none;
  border-top: none;
  border-radius: 0 0 0 4px;
}

.frame-corner.bottom-right {
  bottom: 0;
  right: 0;
  border-left: none;
  border-top: none;
  border-radius: 0 0 4px 0;
}

.result-image {
  width: 100%;
  max-width: 580px;
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-lg);
}

.download-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 32px;
  background: var(--accent);
  color: var(--white);
  font-size: 0.95rem;
  font-weight: 600;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.3s ease;
}

.download-btn:hover {
  background: var(--accent-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(200, 160, 74, 0.3);
}

/* === Info section === */
.info-section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  max-width: 820px;
  margin: 40px auto 0;
}

.info-card-item {
  background: var(--white);
  border-radius: var(--radius-lg);
  padding: 28px 24px;
  text-align: center;
  border: 1px solid var(--border-light);
  transition: all 0.3s ease;
}

.info-card-item:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-4px);
  border-color: var(--primary-lighter);
}

.info-icon {
  width: 48px;
  height: 48px;
  margin: 0 auto 16px;
  background: var(--primary-bg);
  color: var(--primary);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
}

.info-card-item h4 {
  font-size: 1rem;
  font-weight: 700;
  color: var(--primary-dark);
  margin-bottom: 8px;
}

.info-card-item p {
  font-size: 0.83rem;
  color: var(--text-muted);
  line-height: 1.7;
}

/* === Back link === */
.back-link-wrapper {
  text-align: center;
  margin-top: 40px;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  color: var(--text-muted);
  transition: color 0.2s;
}

.back-link:hover {
  color: var(--primary);
}

/* === Animations === */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.4s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* === Responsive === */
@media (max-width: 768px) {
  .page-hero-banner {
    height: 220px;
  }

  .hero-content h1 {
    font-size: 1.5rem;
  }

  .search-card {
    padding: 28px 20px;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .card-header {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }

  .info-section {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .search-result {
    padding: 20px 16px;
  }
}
</style>
