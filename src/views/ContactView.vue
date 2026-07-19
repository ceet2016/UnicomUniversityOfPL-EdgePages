<template>
  <div class="contact-page">
    <AppHeader />
    <PageHero :title="$t('contact.title')" :subtitle="$t('contact.subtitle')" image="/images/picsum_15.jpg" />

    <!-- 联系方式 -->
    <section>
      <div class="container">
        <div class="section-title">
          <h2>{{ $t('contact.sectionTitle') }}</h2>
          <p>{{ $t('contact.sectionDesc') }}</p>
        </div>
        <div class="contact-grid">
          <div
            v-for="(item, index) in contactItems"
            :key="index"
            class="contact-card"
            v-scroll-reveal="{ delay: index * 100 }"
          >
            <div class="contact-icon" v-html="item.icon"></div>
            <h3>{{ item.title }}</h3>
            <p class="contact-value">{{ item.value }}</p>
            <p class="contact-note">{{ item.note }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 表单和地图 -->
    <section class="section-alt">
      <div class="container">
        <div class="form-map-grid">
          <div class="form-section" v-scroll-reveal>
            <h2 class="form-title">{{ $t('contact.formTitle') }}</h2>
            <p class="form-subtitle">{{ $t('contact.formDesc') }}</p>
            <form @submit.prevent="handleSubmit" class="contact-form">
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">{{ $t('contact.name') }} <span class="required">{{ $t('contact.required') }}</span></label>
                  <input
                    v-model="form.name"
                    type="text"
                    class="form-input"
                    :class="{ error: errors.name }"
                    :placeholder="$t('contact.namePlaceholder')"
                  />
                  <span v-if="errors.name" class="form-error-msg">{{ errors.name }}</span>
                </div>
                <div class="form-group">
                  <label class="form-label">{{ $t('contact.email') }} <span class="required">{{ $t('contact.required') }}</span></label>
                  <input
                    v-model="form.email"
                    type="email"
                    class="form-input"
                    :class="{ error: errors.email }"
                    :placeholder="$t('contact.emailPlaceholder')"
                  />
                  <span v-if="errors.email" class="form-error-msg">{{ errors.email }}</span>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">{{ $t('contact.phone') }}</label>
                  <input
                    v-model="form.phone"
                    type="tel"
                    class="form-input"
                    :placeholder="$t('contact.phonePlaceholder')"
                  />
                </div>
                <div class="form-group">
                  <label class="form-label">{{ $t('contact.type') }}</label>
                  <select v-model="form.type" class="form-select">
                    <option value="">{{ $t('contact.typePlaceholder') }}</option>
                    <option value="admission">{{ $t('contact.typeOptions.admission') }}</option>
                    <option value="academic">{{ $t('contact.typeOptions.academic') }}</option>
                    <option value="general">{{ $t('contact.typeOptions.general') }}</option>
                    <option value="other">{{ $t('contact.typeOptions.other') }}</option>
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">{{ $t('contact.message') }} <span class="required">{{ $t('contact.required') }}</span></label>
                <textarea
                  v-model="form.message"
                  class="form-textarea"
                  :class="{ error: errors.message }"
                  :placeholder="$t('contact.messagePlaceholder')"
                  rows="5"
                ></textarea>
                <span v-if="errors.message" class="form-error-msg">{{ errors.message }}</span>
              </div>
              <button type="submit" class="btn btn-primary btn-lg" :disabled="submitting">
                {{ submitting ? $t('contact.submitting') : $t('contact.submit') }}
              </button>
            </form>
          </div>

          <div class="map-section" v-scroll-reveal="{ delay: 200 }">
            <h2 class="form-title">{{ $t('contact.mapTitle') }}</h2>
            <p class="form-subtitle">{{ $t('contact.mapDesc') }}</p>
            <div class="map-placeholder">
              <div class="map-content">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <p>{{ $t('contact.mapDesc') }}</p>
                <p class="map-address">ul. Uniwersytecka 123, Warszawa, Polska</p>
              </div>
            </div>
            <div class="map-info">
              <div class="map-info-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <span>{{ $t('contact.mapInfo.hours') }}</span>
              </div>
              <div class="map-info-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <span>{{ $t('contact.mapInfo.security') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

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
import { ref, reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import ScrollToTop from '@/components/common/ScrollToTop.vue'
import PageHero from '@/components/common/PageHero.vue'
import { scrollReveal as vScrollReveal } from '@/directives/scrollReveal.js'

const { t, tm, locale } = useI18n()

// Contact item icons (SVG markup, not translatable)
const contactIcons = [
  '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
  '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
  '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
  '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>'
]

// Computed contact items with icons
const contactItems = computed(() => {
  const items = tm('contact.contactItems') || []
  return items.map((item, index) => ({
    ...item,
    icon: contactIcons[index] || ''
  }))
})

const form = reactive({
  name: '',
  email: '',
  phone: '',
  type: '',
  message: ''
})

const errors = reactive({})
const submitting = ref(false)
const notification = reactive({ show: false, message: '', type: 'success' })

const validate = () => {
  Object.keys(errors).forEach(k => delete errors[k])
  if (!form.name.trim()) errors.name = t('contact.error.name')
  if (!form.email.trim()) {
    errors.email = t('contact.error.email')
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = t('contact.error.emailInvalid')
  }
  if (!form.message.trim()) errors.message = t('contact.error.message')
  return Object.keys(errors).length === 0
}

const showNotification = (message, type = 'success') => {
  notification.message = message
  notification.type = type
  notification.show = true
  setTimeout(() => { notification.show = false }, 5000)
}

const handleSubmit = () => {
  if (!validate()) return
  submitting.value = true
  setTimeout(() => {
    submitting.value = false
    showNotification(t('contact.success'), 'success')
    Object.keys(form).forEach(k => { form[k] = '' })
  }, 1500)
}
</script>

<style scoped>
.contact-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.contact-card {
  background: var(--white);
  border-radius: var(--radius-lg);
  padding: 36px 28px;
  text-align: center;
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
  border: 1px solid var(--border-light);
}

.contact-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-6px);
  border-color: var(--primary-lighter);
}

.contact-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--primary-bg);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  transition: all 0.3s ease;
}

.contact-card:hover .contact-icon {
  background: var(--primary);
  color: var(--white);
}

.contact-card h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--primary-dark);
  margin-bottom: 8px;
}

.contact-value {
  font-size: 1rem;
  color: var(--text-primary);
  font-weight: 500;
  margin-bottom: 4px;
}

.contact-note {
  font-size: 0.82rem;
  color: var(--text-muted);
}

/* Form & Map */
.form-map-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

.form-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--primary-dark);
  margin-bottom: 8px;
}

.form-subtitle {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-bottom: 28px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.contact-form .btn {
  width: 100%;
  margin-top: 10px;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Map */
.map-placeholder {
  background: var(--primary-bg);
  border-radius: var(--radius-lg);
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
  border: 2px dashed var(--primary-lighter);
}

.map-content {
  text-align: center;
}

.map-content p {
  margin-top: 12px;
  font-weight: 600;
  color: var(--primary-dark);
}

.map-address {
  font-size: 0.85rem !important;
  font-weight: 400 !important;
  color: var(--text-muted) !important;
}

.map-info {
  margin-top: 24px;
}

.map-info-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.88rem;
  color: var(--text-secondary);
  margin-bottom: 10px;
}

.map-info-item svg {
  color: var(--accent-dark);
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

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

@media (max-width: 1024px) {
  .contact-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .contact-grid {
    grid-template-columns: 1fr;
  }

  .form-map-grid {
    grid-template-columns: 1fr;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
