<template>
  <section class="quick-links">
    <div class="container">
      <div class="section-title">
        <h2>{{ t('home.quickLinks') }}</h2>
        <p>{{ t('home.quickLinksDesc') }}</p>
      </div>
      <div class="links-grid">
        <router-link
          v-for="(link, index) in links"
          :key="index"
          :to="link.path"
          class="link-card"
          v-scroll-reveal="{ delay: index * 100 }"
        >
          <div class="link-icon" v-html="link.icon"></div>
          <h3>{{ link.title }}</h3>
          <p>{{ link.desc }}</p>
          <span class="link-arrow">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </span>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

const iconList = [
  '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>',
  '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>',
  '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
  '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8M15 18h-5M10 6h8v4h-8z"/></svg>',
  '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>'
]

const getLinks = () => [
  { title: t('home.links.undergraduate.title'), desc: t('home.links.undergraduate.desc'), path: '/admissions', icon: iconList[0] },
  { title: t('home.links.graduate.title'), desc: t('home.links.graduate.desc'), path: '/academics', icon: iconList[1] },
  { title: t('home.links.calendar.title'), desc: t('home.links.calendar.desc'), path: '/academics', icon: iconList[2] },
  { title: t('home.links.news.title'), desc: t('home.links.news.desc'), path: '/campus', icon: iconList[3] },
  { title: t('home.links.queryLetter.title'), desc: t('home.links.queryLetter.desc'), path: '/select', icon: iconList[4] }
]

const links = ref(getLinks())

watch(locale, () => {
  links.value = getLinks()
})
</script>

<style scoped>
.quick-links {
  padding: 80px 0;
  background: var(--white);
}

.links-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 24px;
}

.link-card {
  background: var(--white);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  padding: 32px 24px;
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
  text-decoration: none;
  color: var(--text-primary);
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
}

.link-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-6px);
  border-color: var(--primary-lighter);
  color: var(--text-primary);
}

.link-card:hover .link-icon {
  background: var(--primary);
  color: var(--white);
}

.link-card:hover .link-arrow {
  opacity: 1;
  transform: translateX(0);
}

.link-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--primary-bg);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  transition: all 0.3s ease;
}

.link-card h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--primary-dark);
  margin-bottom: 8px;
}

.link-card p {
  font-size: 0.85rem;
  color: var(--text-muted);
  line-height: 1.6;
}

.link-arrow {
  margin-top: 16px;
  color: var(--primary);
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s ease;
}

@media (max-width: 1024px) {
  .links-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .links-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .links-grid {
    grid-template-columns: 1fr;
  }
}
</style>
