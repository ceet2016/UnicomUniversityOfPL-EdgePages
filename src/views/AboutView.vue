<template>
  <div class="about-page">
    <AppHeader />
    <PageHero :title="$t('about.title')" :subtitle="$t('about.subtitle')" image="/images/picsum_7.jpg" />

    <!-- 关于我们 -->
    <section class="about-intro">
      <div class="container">
        <div class="about-grid">
          <div class="about-text" v-scroll-reveal>
            <h2 class="about-heading">{{ $t('about.title') }}</h2>
            <p>
              {{ $t('about.historyText1') }}
            </p>
            <p>
              {{ $t('about.historyText2') }}
            </p>
            <p>
              {{ $t('about.introText3') }}
            </p>
            <router-link to="/contact" class="btn btn-primary mt-lg">{{ $t('about.contactUs') }}</router-link>
          </div>
          <div class="about-image" v-scroll-reveal="{ delay: 200 }">
            <img src="/images/picsum_8.jpg" alt="校园环境" />
            <div class="about-image-badge">
              <span class="badge-number">30+</span>
              <span class="badge-text">年办学历史</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 学校特色 -->
    <section class="section-alt">
      <div class="container">
        <div class="section-title">
          <h2>{{ $t('about.featuresTitle') }}</h2>
          <p>{{ $t('about.featuresDesc') }}</p>
        </div>
        <div class="features-grid">
          <div
            v-for="(feature, index) in features"
            :key="index"
            class="feature-card"
            v-scroll-reveal="{ delay: index * 100 }"
          >
            <div class="feature-icon" v-html="feature.icon"></div>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 使命愿景 -->
    <section class="mission-section">
      <div class="container">
        <div class="section-title">
          <h2>{{ $t('about.missionSectionTitle') }}</h2>
          <p>{{ $t('about.missionSectionDesc') }}</p>
        </div>
        <div class="mission-grid">
          <div
            v-for="(item, index) in missions"
            :key="index"
            class="mission-card"
            :class="'mission-card-' + (index + 1)"
            v-scroll-reveal="{ delay: index * 150 }"
          >
            <div class="mission-icon" v-html="item.icon"></div>
            <h3>{{ item.title }}</h3>
            <p>{{ item.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 历史沿革 -->
    <section class="section-alt">
      <div class="container">
        <div class="section-title">
          <h2>{{ $t('about.timelineTitle') }}</h2>
          <p>{{ $t('about.timelineDesc') }}</p>
        </div>
        <div class="timeline">
          <div
            v-for="(item, index) in timeline"
            :key="index"
            class="timeline-item"
            v-scroll-reveal="{ delay: index * 100 }"
          >
            <div class="timeline-year">{{ item.year }}</div>
            <div class="timeline-title">{{ item.title }}</div>
            <div class="timeline-desc">{{ item.desc }}</div>
          </div>
        </div>
      </div>
    </section>

    <AppFooter />
    <ScrollToTop />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import ScrollToTop from '@/components/common/ScrollToTop.vue'
import PageHero from '@/components/common/PageHero.vue'
import { scrollReveal as vScrollReveal } from '@/directives/scrollReveal.js'

const { t, tm, locale } = useI18n()

// Icon SVG strings (not translatable, so kept in component)
const featureIcons = [
  '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>',
  '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2v7.31M14 9.3V2M8.5 2h7M5.52 16h12.96M9 9L5.52 16M15 9l3.48 7M2 22h20"/></svg>',
  '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
  '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
  '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>'
]

const missionIcons = [
  '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
  '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
  '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>'
]

// Computed properties that merge translations with icons
const features = computed(() => {
  const translated = tm('about.features') || []
  return translated.map((item, index) => ({
    ...item,
    icon: featureIcons[index] || ''
  }))
})

const missions = computed(() => {
  const translated = tm('about.missions') || []
  return translated.map((item, index) => ({
    ...item,
    icon: missionIcons[index] || ''
  }))
})

const timeline = computed(() => tm('about.timeline') || [])
</script>

<style scoped>
.about-intro {
  padding: 80px 0;
}

.about-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

.about-heading {
  font-size: 2rem;
  color: var(--primary-dark);
  font-weight: 700;
  margin-bottom: 24px;
  position: relative;
  padding-bottom: 16px;
}

.about-heading::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 60px;
  height: 3px;
  background: var(--accent);
  border-radius: 2px;
}

.about-text p {
  color: var(--text-secondary);
  font-size: 1rem;
  line-height: 1.8;
  margin-bottom: 16px;
}

.about-image {
  position: relative;
}

.about-image img {
  width: 100%;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
}

.about-image-badge {
  position: absolute;
  bottom: -20px;
  right: -20px;
  background: var(--primary);
  color: var(--white);
  padding: 20px 30px;
  border-radius: var(--radius-lg);
  text-align: center;
  box-shadow: var(--shadow-xl);
}

.badge-number {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  line-height: 1;
}

.badge-text {
  display: block;
  font-size: 0.8rem;
  margin-top: 4px;
  opacity: 0.9;
}

/* Features */
.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.feature-card {
  background: var(--white);
  border-radius: var(--radius-lg);
  padding: 36px 28px;
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
  border: 1px solid var(--border-light);
  height: 100%;
}

.feature-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-6px);
  border-color: var(--primary-lighter);
}

.feature-icon {
  width: 64px;
  height: 64px;
  border-radius: var(--radius-md);
  background: var(--primary-bg);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  transition: all 0.3s ease;
}

.feature-card:hover .feature-icon {
  background: var(--primary);
  color: var(--white);
}

.feature-card h3 {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--primary-dark);
  margin-bottom: 12px;
}

.feature-card p {
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.7;
}

/* Mission */
.mission-section {
  padding: 80px 0;
}

.mission-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.mission-card {
  padding: 40px 32px;
  border-radius: var(--radius-lg);
  color: var(--white);
  text-align: center;
  transition: all 0.3s ease;
}

.mission-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-xl);
}

.mission-card-1 {
  background: linear-gradient(135deg, #1a4b8c 0%, #2d6cb8 100%);
}

.mission-card-2 {
  background: linear-gradient(135deg, #0d2d5a 0%, #1a4b8c 100%);
}

.mission-card-3 {
  background: linear-gradient(135deg, #c8a04a 0%, #a67e2e 100%);
}

.mission-icon {
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  opacity: 0.9;
}

.mission-card h3 {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 16px;
}

.mission-card p {
  font-size: 0.95rem;
  line-height: 1.8;
  opacity: 0.9;
}

@media (max-width: 768px) {
  .about-grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .about-image-badge {
    bottom: -15px;
    right: 15px;
    padding: 16px 24px;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .mission-grid {
    grid-template-columns: 1fr;
  }
}
</style>
