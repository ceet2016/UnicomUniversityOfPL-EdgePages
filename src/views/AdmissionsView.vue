<template>
  <div class="admissions-page">
    <AppHeader />
    <PageHero :title="$t('admissions.title')" :subtitle="$t('admissions.subtitle')" image="/images/picsum_10.jpg" />

    <!-- 招生计划 -->
    <section>
      <div class="container">
        <div class="section-title">
          <h2>{{ $t('admissions.overviewTitle') }}</h2>
          <p>{{ $t('admissions.overviewText') }}</p>
        </div>
        <div class="plans-grid">
          <div
            v-for="(plan, index) in plans"
            :key="index"
            class="plan-card"
            :class="{ 'plan-featured': plan.featured }"
            v-scroll-reveal="{ delay: index * 100 }"
          >
            <div v-if="plan.featured" class="plan-badge">{{ $t('admissions.featuredBadge') }}</div>
            <div class="plan-header">
              <h3>{{ plan.title }}</h3>
              <p class="plan-degree">{{ plan.degree }}</p>
            </div>
            <div class="plan-deadline">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span>{{ $t('admissions.deadlinePrefix') }}{{ plan.deadline }}</span>
            </div>
            <div class="plan-duration">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <span>{{ $t('admissions.durationPrefix') }}{{ plan.duration }}</span>
            </div>
            <ul class="plan-features">
              <li v-for="feature in plan.features" :key="feature">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                {{ feature }}
              </li>
            </ul>
            <router-link to="/contact" class="btn" :class="plan.featured ? 'btn-accent' : 'btn-outline'">
              {{ $t('admissions.applyNow') }}
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- 入学要求 -->
    <section class="section-alt">
      <div class="container">
        <div class="section-title">
          <h2>{{ $t('admissions.requirementsTitle') }}</h2>
          <p>{{ $t('admissions.requirementsSubtitle') }}</p>
        </div>
        <div class="requirements-grid">
          <div
            v-for="(req, index) in requirements"
            :key="index"
            class="req-card"
            v-scroll-reveal="{ delay: index * 100 }"
          >
            <div class="req-icon" v-html="req.icon"></div>
            <h3>{{ req.title }}</h3>
            <p>{{ req.desc }}</p>
            <ul class="req-list">
              <li v-for="item in req.items" :key="item">{{ item }}</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- 申请流程 -->
    <section>
      <div class="container">
        <div class="section-title">
          <h2>{{ $t('admissions.processTitle') }}</h2>
          <p>{{ $t('admissions.processSubtitle') }}</p>
        </div>
        <div class="process-grid">
          <div
            v-for="(step, index) in processSteps"
            :key="index"
            class="process-item"
            v-scroll-reveal="{ delay: index * 100 }"
          >
            <div class="process-number">{{ index + 1 }}</div>
            <div class="process-line" v-if="index < processSteps.length - 1"></div>
            <h3>{{ step.title }}</h3>
            <p>{{ step.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-content">
          <h2>{{ $t('admissions.ctaTitle') }}</h2>
          <p>{{ $t('admissions.ctaText') }}</p>
          <div class="cta-actions">
            <router-link to="/select" class="btn btn-accent btn-lg">{{ $t('admissions.checkAdmission') }}</router-link>
            <router-link to="/contact" class="btn btn-outline-white btn-lg">{{ $t('admissions.contactForDetails') }}</router-link>
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

const plans = computed(() => tm('admissions.plans') || [])

const requirements = computed(() => {
  const req = tm('admissions.requirements') || []
  const icons = [
    '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>'
  ]
  return req.map((item, index) => ({
    ...item,
    icon: icons[index] || ''
  }))
})

const processSteps = computed(() => {
  const steps = tm('admissions.applySteps') || []
  const descs = tm('admissions.applyStepDescs') || []
  return steps.map((title, index) => ({
    title,
    desc: descs[index] || ''
  }))
})
</script>

<style scoped>
/* Plans */
.plans-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.plan-card {
  background: var(--white);
  border-radius: var(--radius-lg);
  padding: 36px 32px;
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
  border: 2px solid var(--border-light);
  position: relative;
  display: flex;
  flex-direction: column;
}

.plan-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-6px);
}

.plan-featured {
  border-color: var(--accent);
  background: linear-gradient(180deg, #fffdf5 0%, var(--white) 100%);
}

.plan-badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--accent);
  color: var(--white);
  padding: 4px 20px;
  border-radius: var(--radius-full);
  font-size: 0.8rem;
  font-weight: 600;
}

.plan-header {
  text-align: center;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border-light);
}

.plan-header h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-dark);
  margin-bottom: 4px;
}

.plan-degree {
  font-size: 0.85rem;
  color: var(--text-muted);
  letter-spacing: 1px;
}

.plan-deadline,
.plan-duration {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: 10px;
}

.plan-deadline svg {
  color: var(--accent-dark);
}

.plan-duration svg {
  color: var(--primary);
}

.plan-features {
  margin: 20px 0;
  flex: 1;
}

.plan-features li {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.88rem;
  color: var(--text-secondary);
  margin-bottom: 10px;
}

.plan-features svg {
  color: var(--primary);
  flex-shrink: 0;
}

.plan-card .btn {
  width: 100%;
}

/* Requirements */
.requirements-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.req-card {
  background: var(--white);
  border-radius: var(--radius-lg);
  padding: 36px 28px;
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
  border: 1px solid var(--border-light);
}

.req-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-6px);
  border-color: var(--primary-lighter);
}

.req-icon {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-md);
  background: var(--primary-bg);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.req-card h3 {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--primary-dark);
  margin-bottom: 10px;
}

.req-card > p {
  font-size: 0.88rem;
  color: var(--text-muted);
  margin-bottom: 16px;
}

.req-list {
  padding-left: 0;
}

.req-list li {
  position: relative;
  padding-left: 20px;
  font-size: 0.88rem;
  color: var(--text-secondary);
  margin-bottom: 8px;
  line-height: 1.6;
}

.req-list li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 8px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
}

/* Process */
.process-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  position: relative;
}

.process-item {
  text-align: center;
  position: relative;
  padding: 0 10px;
}

.process-number {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--primary);
  color: var(--white);
  font-size: 1.8rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  position: relative;
  z-index: 1;
  transition: all 0.3s ease;
}

.process-item:hover .process-number {
  background: var(--accent);
  transform: scale(1.1);
}

.process-line {
  position: absolute;
  top: 32px;
  left: 60%;
  width: 80%;
  height: 2px;
  background: var(--border-color);
  z-index: 0;
}

.process-item h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--primary-dark);
  margin-bottom: 8px;
}

.process-item p {
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.6;
}

/* CTA */
.cta-section {
  background: var(--gradient-hero);
  padding: 80px 0;
  text-align: center;
  color: var(--white);
}

.cta-content h2 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 12px;
}

.cta-content p {
  font-size: 1.1rem;
  opacity: 0.9;
  margin-bottom: 30px;
}

.cta-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-outline-white {
  background: transparent;
  color: var(--white);
  border: 2px solid rgba(255, 255, 255, 0.6);
}

.btn-outline-white:hover {
  background: var(--white);
  color: var(--primary-dark);
  border-color: var(--white);
  transform: translateY(-2px);
}

@media (max-width: 1024px) {
  .plans-grid,
  .requirements-grid {
    grid-template-columns: 1fr;
    max-width: 500px;
    margin: 0 auto;
  }

  .process-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 40px 20px;
  }

  .process-line {
    display: none;
  }
}

@media (max-width: 768px) {
  .process-grid {
    grid-template-columns: 1fr;
  }

  .cta-content h2 {
    font-size: 1.5rem;
  }

  .cta-content p {
    font-size: 0.95rem;
  }
}
</style>
