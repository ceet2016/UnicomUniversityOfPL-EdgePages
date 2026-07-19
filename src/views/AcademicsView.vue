<template>
  <div class="academics-page">
    <AppHeader />
    <PageHero :title="t('academics.title')" :subtitle="t('academics.subtitle')" image="/images/picsum_9.jpg" />

    <!-- 研究领域 -->
    <section>
      <div class="container">
        <div class="section-title">
          <h2>{{ t('academics.sectionTitles.researchTitle') }}</h2>
          <p>{{ t('academics.sectionTitles.researchSubtitle') }}</p>
        </div>
        <div class="research-grid">
          <div
            v-for="(area, index) in researchAreas"
            :key="index"
            class="research-card"
            v-scroll-reveal="{ delay: index * 100 }"
          >
            <div class="research-image">
              <img :src="area.image" :alt="area.title" loading="lazy" />
              <div class="research-overlay"></div>
              <h3 class="research-title">{{ area.title }}</h3>
            </div>
            <div class="research-body">
              <p class="research-desc">{{ area.desc }}</p>
              <div class="research-tags">
                <span v-for="tag in area.tags" :key="tag" class="research-tag">{{ tag }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 重点项目 -->
    <section class="section-alt">
      <div class="container">
        <div class="section-title">
          <h2>{{ t('academics.sectionTitles.projectsTitle') }}</h2>
          <p>{{ t('academics.sectionTitles.projectsSubtitle') }}</p>
        </div>
        <div class="projects-grid">
          <div
            v-for="(project, index) in projects"
            :key="index"
            class="project-card"
            v-scroll-reveal="{ delay: index * 150 }"
          >
            <div class="project-header">
              <div class="project-icon" v-html="project.icon"></div>
              <span class="project-status" :class="project.statusClass">{{ project.status }}</span>
            </div>
            <h3 class="project-name">{{ project.title }}</h3>
            <p class="project-desc">{{ project.desc }}</p>
            <div class="project-meta">
              <span class="project-meta-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                {{ project.leader }}
              </span>
              <span class="project-meta-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                {{ project.duration }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 学术资源 -->
    <section>
      <div class="container">
        <div class="section-title">
          <h2>{{ t('academics.sectionTitles.resourcesTitle') }}</h2>
          <p>{{ t('academics.sectionTitles.resourcesSubtitle') }}</p>
        </div>
        <div class="resources-grid">
          <div
            v-for="(resource, index) in resources"
            :key="index"
            class="resource-card"
            v-scroll-reveal="{ delay: index * 100 }"
          >
            <div class="resource-number">{{ String(index + 1).padStart(2, '0') }}</div>
            <h3>{{ resource.title }}</h3>
            <p>{{ resource.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <AppFooter />
    <ScrollToTop />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import ScrollToTop from '@/components/common/ScrollToTop.vue'
import PageHero from '@/components/common/PageHero.vue'
import { scrollReveal as vScrollReveal } from '@/directives/scrollReveal.js'

const { t, tm } = useI18n()

// Project icons (SVG markup, not translatable)
const projectIcons = [
  '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>',
  '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>',
  '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>'
]

// Computed properties from translations
const researchAreas = computed(() => tm('academics.researchAreas') || [])
const projects = computed(() => {
  const items = tm('academics.projects') || []
  return items.map((item, index) => ({
    ...item,
    icon: projectIcons[index] || ''
  }))
})
const resources = computed(() => tm('academics.resources') || [])
</script>

<style scoped>
/* Research areas */
.research-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
}

.research-card {
  background: var(--white);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
}

.research-card:hover {
  box-shadow: var(--shadow-xl);
  transform: translateY(-6px);
}

.research-image {
  position: relative;
  height: 240px;
  overflow: hidden;
}

.research-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.research-card:hover .research-image img {
  transform: scale(1.08);
}

.research-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 50%, rgba(13, 45, 90, 0.8) 100%);
}

.research-title {
  position: absolute;
  bottom: 20px;
  left: 24px;
  color: var(--white);
  font-size: 1.5rem;
  font-weight: 700;
  z-index: 1;
}

.research-body {
  padding: 24px;
}

.research-en {
  font-size: 0.8rem;
  color: var(--accent-dark);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 10px;
}

.research-desc {
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: 16px;
}

.research-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.research-tag {
  padding: 4px 12px;
  background: var(--primary-bg);
  color: var(--primary);
  border-radius: var(--radius-full);
  font-size: 0.78rem;
  font-weight: 500;
}

/* Projects */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.project-card {
  background: var(--white);
  border-radius: var(--radius-lg);
  padding: 32px 28px;
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
  border: 1px solid var(--border-light);
  display: flex;
  flex-direction: column;
}

.project-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-6px);
  border-color: var(--primary-lighter);
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.project-icon {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-md);
  background: var(--primary-bg);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.project-status {
  padding: 4px 12px;
  border-radius: var(--radius-full);
  font-size: 0.78rem;
  font-weight: 600;
}

.status-active {
  background: #fff3cd;
  color: #856404;
}

.status-done {
  background: #d4edda;
  color: #155724;
}

.project-name {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--primary-dark);
  margin-bottom: 12px;
}

.project-desc {
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: 20px;
  flex: 1;
}

.project-meta {
  display: flex;
  gap: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--border-light);
}

.project-meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.82rem;
  color: var(--text-muted);
}

/* Resources */
.resources-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.resource-card {
  text-align: center;
  padding: 36px 24px;
  background: var(--white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
  border: 1px solid var(--border-light);
}

.resource-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-6px);
  border-color: var(--primary-lighter);
}

.resource-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--primary-bg);
  line-height: 1;
  margin-bottom: 16px;
  font-family: var(--font-serif);
}

.resource-card:hover .resource-number {
  color: var(--primary-lighter);
}

.resource-card h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--primary-dark);
  margin-bottom: 10px;
}

.resource-card p {
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.6;
}

@media (max-width: 1024px) {
  .research-grid {
    grid-template-columns: 1fr;
  }

  .projects-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .resources-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .projects-grid,
  .resources-grid {
    grid-template-columns: 1fr;
  }
}
</style>
