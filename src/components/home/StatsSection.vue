<template>
  <section class="stats-section">
    <div class="stats-bg"></div>
    <div class="stats-overlay"></div>
    <div class="container">
      <div class="section-title">
        <h2 class="stats-title">{{ t('home.statsTitle') }}</h2>
        <p class="stats-subtitle">{{ t('home.statsDesc') }}</p>
      </div>
      <div class="stats-grid">
        <div
          v-for="(stat, index) in stats"
          :key="index"
          class="stat-item"
          v-scroll-reveal="{ delay: index * 100 }"
        >
          <div class="stat-number">
            <span class="stat-value">{{ animatedValues[index] }}</span>
            <span class="stat-suffix">{{ stat.suffix }}</span>
          </div>
          <div class="stat-label">{{ stat.label }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, tm, locale } = useI18n()

const getStats = () => {
  const raw = tm('home.stats')
  return raw.map(item => ({
    value: item.value,
    suffix: item.suffix,
    label: item.label
  }))
}

const stats = ref(getStats())
const animatedValues = ref([])

let animationFrame = null
let observer = null

const animateStats = () => {
  const duration = 2000
  const startTime = performance.now()

  const update = (currentTime) => {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    const easeOut = 1 - Math.pow(1 - progress, 3)

    animatedValues.value = stats.value.map((stat) => {
      return Math.floor(stat.value * easeOut).toLocaleString()
    })

    if (progress < 1) {
      animationFrame = requestAnimationFrame(update)
    } else {
      animatedValues.value = stats.value.map((stat) => stat.value.toLocaleString())
    }
  }

  animationFrame = requestAnimationFrame(update)
}

watch(locale, () => {
  stats.value = getStats()
})

onMounted(() => {
  animatedValues.value = stats.value.map(() => 0)
  const section = document.querySelector('.stats-section')
  if (section) {
    observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          animateStats()
          observer.unobserve(section)
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(section)
  }
})

onUnmounted(() => {
  if (animationFrame) cancelAnimationFrame(animationFrame)
  if (observer) observer.disconnect()
})
</script>

<style scoped>
.stats-section {
  position: relative;
  padding: 80px 0;
  overflow: hidden;
}

.stats-bg {
  position: absolute;
  inset: 0;
  background-image: url('/images/picsum_7.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}

.stats-overlay {
  position: absolute;
  inset: 0;
  background: rgba(13, 45, 90, 0.88);
}

.stats-section .container {
  position: relative;
  z-index: 1;
}

.stats-title {
  color: var(--white) !important;
}

.stats-title::after {
  background: var(--accent) !important;
}

.stats-subtitle {
  color: rgba(255, 255, 255, 0.7) !important;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
  margin-top: 40px;
}

.stat-item {
  text-align: center;
  padding: 30px 20px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-lg);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  transition: all 0.3s ease;
}

.stat-item:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-6px);
}

.stat-number {
  font-size: 3rem;
  font-weight: 700;
  color: var(--accent-light);
  line-height: 1;
  margin-bottom: 12px;
}

.stat-suffix {
  font-size: 2rem;
}

.stat-label {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
  letter-spacing: 1px;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .stat-number {
    font-size: 2.2rem;
  }

  .stat-suffix {
    font-size: 1.5rem;
  }

  .stats-bg {
    background-attachment: scroll;
  }
}
</style>
