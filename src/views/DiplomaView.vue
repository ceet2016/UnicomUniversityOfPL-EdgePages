<template>
  <div class="diploma-page">
    <AppHeader />

    <div class="page-banner">
      <div class="container">
        <h1>毕业证颁发系统</h1>
        <p>填写学生信息，生成正式毕业证书</p>
      </div>
    </div>

    <div class="container content-area">
      <div class="main-grid">
        <!-- 表单区域 -->
        <div class="form-panel">
          <h2 class="panel-title">学生信息</h2>
          <form @submit.prevent="handlePreview">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">学生姓名 <span class="required">*</span></label>
                <input
                  v-model="formData.name"
                  type="text"
                  class="form-input"
                  :class="{ error: errors.name }"
                  maxlength="8"
                  placeholder="最多8个字符"
                />
                <span v-if="errors.name" class="form-error-msg">{{ errors.name }}</span>
              </div>
              <div class="form-group">
                <label class="form-label">英文姓名 <span class="required">*</span></label>
                <input
                  v-model="formData.englishName"
                  type="text"
                  class="form-input"
                  :class="{ error: errors.englishName }"
                  maxlength="32"
                  placeholder="仅字母和空格"
                  @input="formData.englishName = formData.englishName.toUpperCase().replace(/[^A-Z\s]/g, '')"
                />
                <span v-if="errors.englishName" class="form-error-msg">{{ errors.englishName }}</span>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">身份证号/护照号 <span class="required">*</span></label>
                <input
                  v-model="formData.idNumber"
                  type="text"
                  class="form-input"
                  :class="{ error: errors.idNumber }"
                  maxlength="20"
                  placeholder="数字和字母"
                  @input="formData.idNumber = formData.idNumber.toUpperCase().replace(/[^A-Z0-9]/g, '')"
                />
                <span v-if="errors.idNumber" class="form-error-msg">{{ errors.idNumber }}</span>
              </div>
              <div class="form-group">
                <label class="form-label">专业 <span class="required">*</span></label>
                <select v-model="formData.specialty" class="form-select" :class="{ error: errors.specialty }">
                  <option value="">请选择专业</option>
                  <option v-for="s in specialties" :key="s" :value="s">{{ s }}</option>
                </select>
                <span v-if="errors.specialty" class="form-error-msg">{{ errors.specialty }}</span>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">学位类型 <span class="required">*</span></label>
                <select v-model="formData.degree" class="form-select" :class="{ error: errors.degree }">
                  <option value="">请选择学位</option>
                  <option v-for="d in degrees" :key="d" :value="d">{{ d }}</option>
                </select>
                <span v-if="errors.degree" class="form-error-msg">{{ errors.degree }}</span>
              </div>
              <div class="form-group">
                <label class="form-label">入学年份 <span class="required">*</span></label>
                <select v-model="formData.enrollmentYear" class="form-select" :class="{ error: errors.enrollmentYear }">
                  <option value="">请选择年份</option>
                  <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
                </select>
                <span v-if="errors.enrollmentYear" class="form-error-msg">{{ errors.enrollmentYear }}</span>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">性别</label>
                <select v-model="formData.gender" class="form-select">
                  <option value="">请选择</option>
                  <option value="男">男</option>
                  <option value="女">女</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">学制</label>
                <select v-model="formData.studyDuration" class="form-select">
                  <option value="四年">四年</option>
                  <option value="三年">三年</option>
                  <option value="两年">两年（硕士）</option>
                  <option value="五年">五年</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">毕业日期 <span class="required">*</span></label>
                <input
                  v-model="formData.graduationDate"
                  type="date"
                  class="form-input"
                  :class="{ error: errors.graduationDate }"
                />
                <span v-if="errors.graduationDate" class="form-error-msg">{{ errors.graduationDate }}</span>
              </div>
            </div>

            <button type="submit" class="btn btn-primary btn-lg preview-btn">
              生成预览
            </button>
          </form>
        </div>

        <!-- 预览区域 -->
        <div class="preview-panel" ref="previewPanel">
          <div v-if="!previewHTML" class="preview-empty">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M9 15l2 2 4-4"/></svg>
            <p>填写左侧表单并点击"生成预览"按钮</p>
            <p class="preview-empty-sub">毕业证书将在此处显示</p>
          </div>

          <div v-else class="preview-content">
            <div class="preview-actions">
              <button @click="downloadImage" class="btn btn-primary" :disabled="downloading">
                {{ downloading ? '下载中...' : '下载图片' }}
              </button>
              <button @click="printDoc" class="btn btn-outline">打印</button>
              <button @click="resetPreview" class="btn btn-outline">重新填写</button>
            </div>
            <div class="preview-letter-wrapper" v-html="previewHTML"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 通知 -->
    <Transition name="slide">
      <div v-if="notification.show" class="notification" :class="notification.type">
        <span>{{ notification.message }}</span>
      </div>
    </Transition>

    <AppFooter />
    <ScrollToTop />
  </div>
</template>

<script setup>
import { ref, reactive, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import html2canvas from 'html2canvas'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import ScrollToTop from '@/components/common/ScrollToTop.vue'
import {
  DIPLOMA_SPECIALTIES,
  DIPLOMA_DEGREES,
  generateDiplomaNumber,
  generateDiplomaHTML,
  generateQRCodeDataURL,
  validateDiplomaForm
} from '@/utils/diploma.js'

const { tm } = useI18n()
const specialties = DIPLOMA_SPECIALTIES
const degrees = DIPLOMA_DEGREES
const years = ['2020', '2021', '2022', '2023', '2024', '2025', '2026']

const formData = reactive({
  name: '',
  englishName: '',
  idNumber: '',
  specialty: '',
  degree: '',
  enrollmentYear: '',
  gender: '',
  studyDuration: '四年',
  graduationDate: ''
})

const errors = reactive({})
const previewHTML = ref('')
const previewData = ref(null)
const downloading = ref(false)
const previewPanel = ref(null)

const notification = reactive({ show: false, message: '', type: 'success' })

const showNotification = (message, type = 'success') => {
  notification.message = message
  notification.type = type
  notification.show = true
  setTimeout(() => { notification.show = false }, 3000)
}

const handlePreview = async () => {
  const validationErrors = validateDiplomaForm(formData)
  Object.keys(errors).forEach(k => delete errors[k])
  Object.assign(errors, validationErrors)

  if (Object.keys(validationErrors).length > 0) {
    showNotification('请完善表单信息', 'error')
    return
  }

  const diplomaNumber = generateDiplomaNumber(formData.enrollmentYear)
  const data = {
    ...formData,
    diplomaNumber
  }

  // Generate QR code data URL — encodes a deep link to the public query page
  // with the holder's identity, so scanning auto-fills and auto-triggers a search
  const origin = window.location.origin
  // Hash-mode deep link: browser only requests "/", the static index.html is
  // served directly by the CDN; the client router handles "/#/diploma-select?...".
  const qrText = `${origin}/#/diploma-select?name=${encodeURIComponent(data.name)}&id=${encodeURIComponent(data.idNumber)}&auto=1`
  const qrCodeDataURL = await generateQRCodeDataURL(qrText)

  // Fetch favicon and convert to data URL for reliable html2canvas rendering
  let logoDataURL = ''
  try {
    const resp = await fetch('/images/favicon.ico')
    if (resp.ok) {
      const blob = await resp.blob()
      logoDataURL = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = () => reject(reader.error)
        reader.readAsDataURL(blob)
      })
    }
  } catch (e) {
    logoDataURL = ''
  }

  previewData.value = data
  previewHTML.value = generateDiplomaHTML(data, qrCodeDataURL, logoDataURL, tm('diplomaDoc'))

  nextTick(() => {
    if (previewPanel.value) {
      previewPanel.value.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  })

  showNotification('毕业证书已生成', 'success')
}

const downloadImage = async () => {
  if (!previewData.value) return

  downloading.value = true

  try {
    const docEl = document.getElementById('diplomaDoc')
    if (!docEl) {
      showNotification('未找到证书元素，请重新生成预览', 'error')
      downloading.value = false
      return
    }

    const canvas = await html2canvas(docEl, {
      scale: 2,
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
      width: 1240,
      height: 1754,
      windowWidth: 1240,
      windowHeight: 1754,
      logging: false
    })

    const fileName = `${previewData.value.name}_${previewData.value.idNumber}.jpg`

    const blob = await new Promise((resolve, reject) => {
      canvas.toBlob((b) => {
        if (b) resolve(b)
        else reject(new Error('Canvas toBlob failed'))
      }, 'image/jpeg', 0.95)
    })

    // Download locally
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    // Save to server
    try {
      await saveDiplomaToServer(blob, fileName)
      showNotification('图片已下载并保存到服务器', 'success')
    } catch (e) {
      showNotification('图片已下载（服务器保存失败，查询功能将不可用）', 'success')
    }

    downloading.value = false
  } catch (err) {
    showNotification(`下载失败: ${err.message || '未知错误'}`, 'error')
    downloading.value = false
  }
}

const saveDiplomaToServer = async (blob, fileName) => {
  const formDataObj = new FormData()
  formDataObj.append('image', blob, fileName)

  const response = await fetch('/save-diploma', {
    method: 'POST',
    body: formDataObj
  })

  if (!response.ok) {
    throw new Error('Server save failed')
  }
}

const printDoc = () => {
  window.print()
}

const resetPreview = () => {
  previewHTML.value = ''
  previewData.value = null
  Object.keys(formData).forEach(k => { formData[k] = '' })
  formData.studyDuration = '四年'
  Object.keys(errors).forEach(k => delete errors[k])
}
</script>

<style scoped>
.diploma-page {
  min-height: 100vh;
  background: var(--bg-page);
}

.page-banner {
  background: var(--gradient-primary);
  color: var(--white);
  padding: 40px 0;
  margin-top: var(--header-height);
  text-align: center;
}

.page-banner h1 {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.page-banner p {
  font-size: 0.95rem;
  opacity: 0.9;
}

.content-area {
  padding: 40px 0 60px;
}

.main-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  align-items: start;
}

.form-panel,
.preview-panel {
  background: var(--white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  padding: 32px;
}

.panel-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--primary-dark);
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid var(--primary-bg);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  align-items: start;
}

.preview-btn {
  width: 100%;
  margin-top: 8px;
}

/* Preview empty state */
.preview-empty {
  text-align: center;
  padding: 80px 20px;
  color: var(--text-muted);
}

.preview-empty svg {
  color: var(--gray-300);
  margin-bottom: 16px;
}

.preview-empty p {
  font-size: 0.95rem;
  margin-bottom: 4px;
}

.preview-empty-sub {
  font-size: 0.85rem !important;
  color: var(--gray-400);
}

/* Preview content */
.preview-actions {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.preview-letter-wrapper {
  overflow: auto;
  max-height: 800px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 20px;
  background: #fafafa;
}

/* Notification */
.notification {
  position: fixed;
  top: 90px;
  right: 20px;
  z-index: 9999;
  padding: 16px 24px;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
  font-weight: 500;
  max-width: 360px;
}

.notification.success {
  background: #f0fdf4;
  color: #166534;
  border-left: 4px solid #22c55e;
}

.notification.error {
  background: #fef2f2;
  color: #991b1b;
  border-left: 4px solid #ef4444;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* === Diploma Document Styles (for v-html content) === */
:deep(.diploma-doc) {
  position: relative;
  width: 1240px;
  min-height: 1754px;
  margin: 0 auto;
  background: #ffffff;
  border: 3px solid #8B4513;
  padding: 60px 80px;
  font-family: 'Noto Sans SC', 'Microsoft YaHei', serif;
  color: #333;
  overflow: hidden;
}

:deep(.diploma-doc::before) {
  content: '';
  position: absolute;
  top: 12px;
  left: 12px;
  right: 12px;
  bottom: 12px;
  border: 1.5px solid #8B4513;
  pointer-events: none;
}

:deep(.diploma-doc::after) {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 30px,
    rgba(139, 69, 19, 0.02) 30px,
    rgba(139, 69, 19, 0.02) 60px
  );
  pointer-events: none;
}

:deep(.wave-border) {
  position: absolute;
  background: repeating-linear-gradient(
    90deg,
    #8B4513 0,
    #8B4513 5px,
    transparent 5px,
    transparent 10px
  );
  z-index: 1;
}

:deep(.wave-top) {
  top: 4px;
  left: 20px;
  right: 20px;
  height: 3px;
}

:deep(.wave-bottom) {
  bottom: 4px;
  left: 20px;
  right: 20px;
  height: 3px;
}

:deep(.wave-left) {
  left: 4px;
  top: 20px;
  bottom: 20px;
  width: 3px;
  background: repeating-linear-gradient(
    0deg,
    #8B4513 0,
    #8B4513 5px,
    transparent 5px,
    transparent 10px
  );
}

:deep(.wave-right) {
  right: 4px;
  top: 20px;
  bottom: 20px;
  width: 3px;
  background: repeating-linear-gradient(
    0deg,
    #8B4513 0,
    #8B4513 5px,
    transparent 5px,
    transparent 10px
  );
}

/* Anti-counterfeit watermark: microtext */
:deep(.watermark-micro) {
  position: absolute;
  font-size: 7px;
  font-weight: 600;
  color: #8B4513;
  pointer-events: none;
  z-index: 0;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

/* Anti-counterfeit watermark: guilloche pattern */
:deep(.guilloche-pattern) {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

:deep(.diploma-header) {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  margin-bottom: 40px;
  position: relative;
  z-index: 1;
}

:deep(.diploma-logo-img) {
  width: 80px;
  height: 80px;
  flex-shrink: 0;
  object-fit: contain;
}

:deep(.diploma-title-group) {
  text-align: center;
}

:deep(.diploma-uni-name) {
  font-size: 38px;
  color: #8B4513;
  font-weight: 700;
  letter-spacing: 4px;
  margin-bottom: 6px;
  font-family: 'Noto Serif SC', 'STSong', 'SimSun', serif;
}

:deep(.diploma-uni-name-en) {
  font-size: 15px;
  color: #8B4513;
  letter-spacing: 2px;
  margin-bottom: 4px;
  font-family: 'Times New Roman', serif;
  font-style: italic;
}

:deep(.diploma-website) {
  font-size: 13px;
  color: #999;
  font-family: 'Times New Roman', serif;
}

:deep(.diploma-main-title) {
  text-align: center;
  margin-bottom: 30px;
  position: relative;
  z-index: 1;
}

:deep(.diploma-main-title h2) {
  font-size: 48px;
  color: #8B4513;
  letter-spacing: 8px;
  font-weight: 700;
}

:deep(.diploma-main-title p) {
  font-size: 16px;
  color: #8B4513;
  letter-spacing: 4px;
  margin-top: 8px;
}

:deep(.diploma-number) {
  text-align: right;
  font-size: 14px;
  color: #666;
  margin-bottom: 30px;
  position: relative;
  z-index: 1;
}

:deep(.student-info) {
  background: #FAF6F0;
  border-left: 4px solid #8B4513;
  padding: 24px 32px;
  margin-bottom: 30px;
  position: relative;
  z-index: 1;
}

:deep(.info-row) {
  display: flex;
  align-items: baseline;
  margin-bottom: 12px;
  font-size: 18px;
}

:deep(.info-row:last-child) {
  margin-bottom: 0;
}

:deep(.info-label) {
  color: #8B4513;
  font-weight: 600;
  min-width: 160px;
}

:deep(.info-value) {
  color: #333;
  font-weight: 500;
  flex: 1;
}

:deep(.diploma-info) {
  margin-bottom: 40px;
  position: relative;
  z-index: 1;
}

:deep(.diploma-info p) {
  font-size: 18px;
  line-height: 2;
  color: #333;
  margin-bottom: 16px;
  text-indent: 2em;
}

:deep(.diploma-info strong) {
  color: #8B4513;
  font-weight: 700;
}

:deep(.diploma-signatures) {
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
  margin-bottom: 30px;
  padding: 0 40px;
  position: relative;
  z-index: 1;
}

:deep(.signature-item) {
  text-align: center;
}

:deep(.signature-role) {
  font-size: 16px;
  color: #666;
  margin-bottom: 8px;
}

:deep(.signature-name) {
  font-size: 22px;
  color: #8B4513;
  font-weight: 700;
  font-family: 'STKaiti', 'KaiTi', '楷体', 'Noto Serif SC', serif;
  letter-spacing: 4px;
  margin-bottom: 8px;
}

:deep(.signature-line) {
  width: 120px;
  height: 1px;
  background: #8B4513;
  margin: 0 auto;
}

:deep(.diploma-qr-img) {
  width: 90px;
  height: 90px;
  margin: 0 auto;
  display: block;
}

:deep(.qr-label) {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

:deep(.diploma-footer) {
  text-align: right;
  position: relative;
  z-index: 1;
  margin-bottom: 30px;
}

:deep(.diploma-footer p) {
  font-size: 16px;
  color: #333;
  margin-bottom: 4px;
}

:deep(.diploma-notice) {
  background: #FFF8E1;
  border: 1px solid #8B4513;
  border-radius: 4px;
  padding: 20px 24px;
  position: relative;
  z-index: 1;
}

:deep(.diploma-notice h3) {
  font-size: 16px;
  color: #8B4513;
  margin-bottom: 12px;
}

:deep(.diploma-notice p) {
  font-size: 14px;
  color: #555;
  line-height: 1.8;
  margin-bottom: 4px;
}

:deep(.diploma-watermark-logo) {
  position: absolute;
  bottom: 30px;
  right: 40px;
  width: 80px;
  opacity: 0.1;
  z-index: 0;
}

@media (max-width: 1024px) {
  .main-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .form-panel,
  .preview-panel {
    padding: 20px;
  }
}

@media print {
  .site-header,
  .page-banner,
  .form-panel,
  .preview-actions,
  .site-footer,
  .back-to-top,
  .scroll-progress {
    display: none !important;
  }

  .preview-letter-wrapper {
    border: none;
    padding: 0;
    max-height: none;
  }
}
</style>
