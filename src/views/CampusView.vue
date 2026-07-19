<template>
  <div class="campus-page">
    <AppHeader />
    <PageHero :title="$t('campus.title')" :subtitle="$t('campus.subtitle')" image="/images/picsum_11.jpg" />

    <!-- 校园设施 -->
    <section>
      <div class="container">
        <div class="section-title">
          <h2>{{ $t('campus.sectionTitles.facilitiesTitle') }}</h2>
          <p>{{ $t('campus.sectionTitles.facilitiesSubtitle') }}</p>
        </div>
        <div class="facilities-grid">
          <div
            v-for="(facility, index) in facilities"
            :key="index"
            class="facility-card"
            v-scroll-reveal="{ delay: index * 100 }"
          >
            <div class="facility-icon" v-html="facility.icon"></div>
            <h3>{{ facility.title }}</h3>
            <p>{{ facility.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 学生活动 -->
    <section class="section-alt">
      <div class="container">
        <div class="section-title">
          <h2>{{ $t('campus.sectionTitles.activitiesTitle') }}</h2>
          <p>{{ $t('campus.sectionTitles.activitiesSubtitle') }}</p>
        </div>
        <div class="activities-grid">
          <div
            v-for="(activity, index) in activities"
            :key="index"
            class="activity-card"
            v-scroll-reveal="{ delay: index * 100 }"
          >
            <div class="activity-image">
              <img :src="activity.image" :alt="activity.title" loading="lazy" />
              <div class="activity-overlay">
                <span class="activity-date">{{ activity.date }}</span>
              </div>
            </div>
            <div class="activity-body">
              <span class="activity-tag">{{ activity.tag }}</span>
              <h3>{{ activity.title }}</h3>
              <p>{{ activity.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 学生组织 -->
    <section>
      <div class="container">
        <div class="section-title">
          <h2>{{ $t('campus.sectionTitles.orgsTitle') }}</h2>
          <p>{{ $t('campus.sectionTitles.orgsSubtitle') }}</p>
        </div>
        <div class="orgs-grid">
          <div
            v-for="(org, index) in organizations"
            :key="index"
            class="org-card"
            v-scroll-reveal="{ delay: index * 100 }"
          >
            <div class="org-header">
              <div class="org-icon" v-html="org.icon"></div>
              <h3>{{ org.title }}</h3>
            </div>
            <p>{{ org.desc }}</p>
            <div class="org-members">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              <span>{{ org.members }} {{ $t('campus.membersSuffix') }}</span>
            </div>
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

const { t, tm, locale } = useI18n()

const facilities = computed(() => {
  const fac = tm('campus.facilities') || []
  const icons = [
    '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><line x1="2" y1="12" x2="22" y2="12"/></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H5a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>'
  ]
  return fac.map((item, index) => ({
    ...item,
    icon: icons[index] || ''
  }))
})

const activityImages = ['/images/picsum_8.jpg', '/images/picsum_13.jpg', '/images/picsum_14.jpg']

const activities = computed(() => {
  const raw = tm('campus.activities') || []
  return raw.map((item, index) => ({
    ...item,
    image: activityImages[index] || '/images/picsum_8.jpg'
  }))
})

const organizations = computed(() => {
  const orgs = tm('campus.organizations') || []
  const icons = [
    '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 1-3 3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 0 3 3h7z"/></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>'
  ]
  return orgs.map((item, index) => ({
    ...item,
    icon: icons[index] || ''
  }))
})
</script>

<style scoped>
/* Facilities */
.facilities-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.facility-card {
  background: var(--white);
  border-radius: var(--radius-lg);
  padding: 36px 28px;
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
  border: 1px solid var(--border-light);
  text-align: center;
}

.facility-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-6px);
  border-color: var(--primary-lighter);
}

.facility-icon {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: var(--primary-bg);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  transition: all 0.3s ease;
}

.facility-card:hover .facility-icon {
  background: var(--primary);
  color: var(--white);
}

.facility-card h3 {
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--primary-dark);
  margin-bottom: 10px;
}

.facility-card p {
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.7;
}

/* Activities */
.activities-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.activity-card {
  background: var(--white);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
}

.activity-card:hover {
  box-shadow: var(--shadow-xl);
  transform: translateY(-6px);
}

.activity-image {
  position: relative;
  height: 240px;
  overflow: hidden;
}

.activity-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.activity-card:hover .activity-image img {
  transform: scale(1.08);
}

.activity-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px 20px;
  background: linear-gradient(180deg, transparent, rgba(0,0,0,0.6));
}

.activity-date {
  color: var(--white);
  font-size: 0.8rem;
  font-weight: 500;
}

.activity-body {
  padding: 24px;
}

.activity-tag {
  display: inline-block;
  padding: 3px 12px;
  background: var(--primary-bg);
  color: var(--primary);
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 10px;
}

.activity-body h3 {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--primary-dark);
  margin-bottom: 10px;
}

.activity-body p {
  font-size: 0.88rem;
  color: var(--text-secondary);
  line-height: 1.7;
}

/* Organizations */
.orgs-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.org-card {
  background: var(--white);
  border-radius: var(--radius-lg);
  padding: 36px 28px;
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
  border: 1px solid var(--border-light);
}

.org-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-6px);
  border-color: var(--primary-lighter);
}

.org-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.org-icon {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-md);
  background: var(--primary-bg);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.org-header h3 {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--primary-dark);
}

.org-card > p {
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: 16px;
}

.org-members {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.82rem;
  color: var(--text-muted);
  padding-top: 16px;
  border-top: 1px solid var(--border-light);
}

.org-members svg {
  color: var(--accent);
}

@media (max-width: 1024px) {
  .facilities-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .activities-grid,
  .orgs-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .facilities-grid,
  .activities-grid,
  .orgs-grid {
    grid-template-columns: 1fr;
  }
}
</style>
