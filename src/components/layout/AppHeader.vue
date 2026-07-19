<template>
  <header class="site-header" :class="{ scrolled: isScrolled }">
    <div class="header-top">
      <div class="container">
        <div class="header-top-content">
          <span class="header-top-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            +48 22 107 98 99
          </span>
          <span class="header-top-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            uniomo@10010.edu.pl
          </span>
          <span class="header-top-spacer"></span>
          <router-link to="/select" class="header-top-link">{{ t('header.queryLetter') }}</router-link>
          <router-link to="/login" class="header-top-link">{{ t('header.adminLogin') }}</router-link>
        </div>
      </div>
    </div>

    <div class="header-main">
      <div class="container">
        <div class="header-inner">
          <router-link to="/" class="logo">
            <img src="/images/favicon.ico" alt="校徽" class="logo-img" />
            <div class="logo-text">
              <span class="logo-name">{{ t('siteName') }}</span>
              <span class="logo-name-en">{{ t('siteNameEn') }}</span>
            </div>
          </router-link>

          <nav class="nav-menu" :class="{ open: mobileMenuOpen }">
            <router-link
              v-for="item in navItems"
              :key="item.path"
              :to="item.path"
              class="nav-link"
              @click="closeMobileMenu"
            >
              {{ t(item.labelKey) }}
            </router-link>
            <div class="lang-switcher lang-switcher-mobile">
              <button
                v-for="lang in languages"
                :key="lang.code"
                class="lang-btn lang-btn-mobile"
                :class="{ active: locale === lang.code }"
                @click="switchLanguage(lang.code)"
              >{{ lang.label }}</button>
            </div>
          </nav>

          <div class="header-right">
            <div class="lang-switcher lang-switcher-desktop">
              <button
                v-for="lang in languages"
                :key="lang.code"
                class="lang-btn"
                :class="{ active: locale === lang.code }"
                @click="switchLanguage(lang.code)"
              >{{ lang.label }}</button>
            </div>
            <button class="mobile-toggle" @click="toggleMobileMenu" aria-label="菜单">
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale, t } = useI18n()

const isScrolled = ref(false)
const mobileMenuOpen = ref(false)

const navItems = [
  { path: '/', labelKey: 'nav.home' },
  { path: '/about', labelKey: 'nav.about' },
  { path: '/academics', labelKey: 'nav.academics' },
  { path: '/admissions', labelKey: 'nav.admissions' },
  { path: '/campus', labelKey: 'nav.campus' },
  { path: '/contact', labelKey: 'nav.contact' }
]

const languages = [
  { code: 'en', label: 'EN' },
  { code: 'zh', label: '中文' },
  { code: 'ja', label: '日本語' },
  { code: 'ko', label: '한국어' }
]

const switchLanguage = (code) => {
  locale.value = code
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.site-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: var(--white);
  transition: box-shadow 0.3s ease;
}

.site-header.scrolled .header-main {
  box-shadow: var(--shadow-md);
}

/* 顶栏 */
.header-top {
  background: var(--primary-dark);
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.8rem;
  padding: 6px 0;
}

.header-top-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.header-top-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.header-top-item svg {
  opacity: 0.7;
}

.header-top-spacer {
  flex: 1;
}

.header-top-link {
  color: rgba(255, 255, 255, 0.85);
  transition: color 0.2s;
}

.header-top-link:hover {
  color: var(--accent-light);
}

/* 主导航 */
.header-main {
  transition: box-shadow 0.3s ease;
  border-bottom: 1px solid var(--border-light);
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--header-height);
}

/* Logo */
.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  min-width: 0;
  flex-shrink: 1;
  margin-right: auto;
}

.logo-img {
  width: 44px;
  height: 44px;
  object-fit: contain;
  flex-shrink: 0;
}

.logo-text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.logo-name {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--primary-dark);
  letter-spacing: 1px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.logo-name-en {
  font-size: 0.7rem;
  color: var(--text-muted);
  letter-spacing: 0.5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 右侧区域（桌面端语言切换 + 移动端汉堡按钮）*/
.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

/* 导航 */
.nav-menu {
  display: flex;
  align-items: center;
  gap: 4px;
}

.nav-link {
  padding: 8px 16px;
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--text-primary);
  border-radius: var(--radius-md);
  transition: all 0.2s ease;
  position: relative;
}

.nav-link:hover {
  color: var(--primary);
  background: var(--primary-bg);
}

.nav-link.router-link-exact-active {
  color: var(--primary);
  font-weight: 600;
}

.nav-link.router-link-exact-active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 3px;
  background: var(--accent);
  border-radius: 2px;
}

/* 移动端 */
.mobile-toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  padding: 6px;
}

.mobile-toggle span {
  width: 24px;
  height: 2px;
  background: var(--primary-dark);
  border-radius: 2px;
  transition: all 0.3s ease;
}

@media (max-width: 768px) {
  .header-top {
    display: none;
  }

  .header-inner {
    height: 60px;
  }

  .logo-name {
    font-size: 0.95rem;
  }

  .logo-name-en {
    display: none;
  }

  .mobile-toggle {
    display: flex;
  }

  .nav-menu {
    position: fixed;
    top: 60px;
    left: 0;
    right: 0;
    background: var(--white);
    flex-direction: column;
    padding: 16px;
    box-shadow: var(--shadow-lg);
    gap: 0;
    transform: translateY(-100%);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    max-height: calc(100vh - 60px);
    overflow-y: auto;
  }

  .nav-menu.open {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }

  .nav-link {
    width: 100%;
    padding: 14px 16px;
    border-radius: 0;
    border-bottom: 1px solid var(--border-light);
  }

  .nav-link.router-link-exact-active::after {
    display: none;
  }
}

/* 桌面端语言切换器 - 默认隐藏（避免手机上意外显示）*/
.lang-switcher-desktop {
  display: none;
}

@media (min-width: 769px) {
  .lang-switcher-desktop {
    display: flex;
    margin-left: 12px;
  }
}

/* 移动端语言切换器 - 默认显示在汉堡菜单内 */
.lang-switcher-mobile {
  display: flex;
  width: 100%;
  padding: 16px 0 4px;
  border-top: 1px solid var(--border-light);
  margin-top: 8px;
  gap: 8px;
}

@media (min-width: 769px) {
  .lang-switcher-mobile {
    display: none;
  }
}

.lang-btn {
  background: var(--white);
  border: 1px solid var(--border-light);
  color: var(--text-primary);
  font-size: 0.8rem;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  line-height: 1.2;
}

.lang-btn:hover {
  background: var(--primary-bg);
  color: var(--primary);
  border-color: var(--primary);
}

.lang-btn.active {
  background: var(--primary);
  color: #fff;
  border-color: var(--primary);
}

.lang-btn-mobile {
  flex: 1;
  background: var(--white);
  color: var(--text-primary);
  border: 1px solid var(--border-light);
  font-size: 0.85rem;
  padding: 8px 12px;
  border-radius: 4px;
}

.lang-btn-mobile.active {
  background: var(--primary);
  color: #fff;
  border-color: var(--primary);
}
</style>
