<template>
  <footer class="site-footer">
    <div class="footer-main">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-col footer-about">
            <div class="footer-logo">
              <img src="/images/favicon.ico" alt="校徽" />
              <div>
                <span class="footer-logo-name">{{ t('siteName') }}</span>
                <span class="footer-logo-en">{{ t('siteNameEn') }}</span>
              </div>
            </div>
            <p class="footer-desc">{{ t('footer.desc') }}</p>
            <div class="footer-social">
              <a href="#" class="social-link" aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="#" class="social-link" aria-label="Twitter">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>
              </a>
              <a href="#" class="social-link" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href="#" class="social-link" aria-label="LinkedIn">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
            </div>
          </div>

          <div class="footer-col">
            <h4 class="footer-title">{{ t('footer.quickLinks') }}</h4>
            <ul class="footer-links">
              <li><router-link to="/">{{ t('nav.home') }}</router-link></li>
              <li><router-link to="/about">{{ t('nav.about') }}</router-link></li>
              <li><router-link to="/academics">{{ t('nav.academics') }}</router-link></li>
              <li><router-link to="/admissions">{{ t('nav.admissions') }}</router-link></li>
              <li><router-link to="/campus">{{ t('nav.campus') }}</router-link></li>
              <li><router-link to="/contact">{{ t('nav.contact') }}</router-link></li>
            </ul>
          </div>

          <div class="footer-col">
            <h4 class="footer-title">{{ t('footer.services') }}</h4>
            <ul class="footer-links">
              <li><router-link to="/select">{{ t('header.queryLetter') }}</router-link></li>
              <li><router-link to="/diploma-select">{{ t('diplomaSelect.title') }}</router-link></li>
              <li><router-link to="/login">{{ t('header.adminLogin') }}</router-link></li>
              <li><a href="#">{{ t('footer.library') }}</a></li>
              <li><a href="#">{{ t('footer.academic') }}</a></li>
              <li><a href="#">{{ t('footer.onlineLearning') }}</a></li>
              <li><a href="#">{{ t('footer.calendar') }}</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <h4 class="footer-title">{{ t('footer.contactUs') }}</h4>
            <ul class="footer-contact">
              <li>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <span>{{ t('address') }}</span>
              </li>
              <li>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                <span>{{ t('phone') }}</span>
              </li>
              <li>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <span>{{ t('email') }}</span>
              </li>
              <li>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <span>{{ t('officeHours') }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <div class="container">
        <div class="footer-bottom-content">
          <p>© 1990-{{ currentYear }} {{ t('footer.copyright') }}</p>
          <p>
            <a href="#">{{ t('footer.privacy') }}</a>
            <span class="divider">|</span>
            <a href="#">{{ t('footer.terms') }}</a>
            <span class="divider">|</span>
            <a href="#">{{ t('footer.sitemap') }}</a>
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

const { t, locale } = useI18n()
const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
.site-footer {
  background: var(--primary-dark);
  color: rgba(255, 255, 255, 0.8);
}

.footer-main {
  padding: 60px 0 40px;
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.5fr;
  gap: 40px;
}

/* About column */
.footer-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.footer-logo img {
  width: 44px;
  height: 44px;
}

.footer-logo-name {
  display: block;
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--white);
}

.footer-logo-en {
  display: block;
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.5);
}

.footer-desc {
  font-size: 0.85rem;
  line-height: 1.7;
  margin-bottom: 20px;
  color: rgba(255, 255, 255, 0.6);
}

.footer-social {
  display: flex;
  gap: 10px;
}

.social-link {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.7);
  transition: all 0.3s ease;
}

.social-link:hover {
  background: var(--accent);
  color: var(--white);
  transform: translateY(-3px);
}

/* Link columns */
.footer-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--white);
  margin-bottom: 20px;
  position: relative;
  padding-bottom: 10px;
}

.footer-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 30px;
  height: 2px;
  background: var(--accent);
  border-radius: 1px;
}

.footer-links li {
  margin-bottom: 10px;
}

.footer-links a {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.85rem;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.footer-links a::before {
  content: '›';
  font-size: 1rem;
  color: var(--accent);
}

.footer-links a:hover {
  color: var(--white);
  transform: translateX(4px);
}

/* Contact column */
.footer-contact li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 14px;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
}

.footer-contact svg {
  flex-shrink: 0;
  margin-top: 2px;
  color: var(--accent);
}

/* Bottom bar */
.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 20px 0;
}

.footer-bottom-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
}

.footer-bottom-content a {
  color: rgba(255, 255, 255, 0.5);
  transition: color 0.2s;
}

.footer-bottom-content a:hover {
  color: var(--accent-light);
}

.divider {
  margin: 0 8px;
  color: rgba(255, 255, 255, 0.2);
}

@media (max-width: 1024px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;
    gap: 30px;
  }
}

@media (max-width: 600px) {
  .footer-grid {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .footer-main {
    padding: 40px 0 30px;
  }

  .footer-bottom-content {
    flex-direction: column;
    gap: 10px;
    text-align: center;
  }
}
</style>
