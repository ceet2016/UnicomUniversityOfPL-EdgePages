<template>
  <section class="hero">
    <div class="hero-slider">
      <div
        v-for="(slide, index) in slides"
        :key="index"
        class="hero-slide"
        :class="{ active: currentSlide === index }"
        :style="{ backgroundImage: `url(${slide.image})` }"
      >
        <div class="hero-overlay"></div>
        <div class="hero-content container">
          <h1 class="hero-title">{{ slide.title }}</h1>
          <p class="hero-subtitle">{{ slide.subtitle }}</p>
          <div class="hero-actions">
            <router-link to="/admissions" class="btn btn-accent btn-lg">{{ t('home.heroApply') }}</router-link>
            <router-link to="/about" class="btn btn-outline-white btn-lg">{{ t('home.heroLearnMore') }}</router-link>
          </div>
        </div>
      </div>
    </div>

    <button class="hero-arrow hero-arrow-left" @click="prevSlide" aria-label="Previous">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
    </button>
    <button class="hero-arrow hero-arrow-right" @click="nextSlide" aria-label="Next">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
    </button>

    <div class="hero-dots">
      <button
        v-for="(slide, index) in slides"
        :key="index"
        class="hero-dot"
        :class="{ active: currentSlide === index }"
        @click="goToSlide(index)"
        :aria-label="`${index + 1}`"
      ></button>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

const imageList = ['/images/picsum_1.jpg', '/images/picsum_2.jpg', '/images/picsum_3.jpg']

const getSlides = () => [
  {
    title: t('home.hero.0.title'),
    subtitle: t('home.hero.0.subtitle'),
    image: imageList[0]
  },
  {
    title: t('home.hero.1.title'),
    subtitle: t('home.hero.1.subtitle'),
    image: imageList[1]
  },
  {
    title: t('home.hero.2.title'),
    subtitle: t('home.hero.2.subtitle'),
    image: imageList[2]
  }
]

const slides = ref(getSlides())

watch(locale, () => {
  slides.value = getSlides()
})

let timer = null

const currentSlide = ref(0)

const startSlider = () => {
  timer = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % slides.value.length
  }, 6000)
}

const stopSlider = () => {
  if (timer) clearInterval(timer)
}

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.value.length
  restartSlider()
}

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + slides.value.length) % slides.value.length
  restartSlider()
}

const goToSlide = (index) => {
  currentSlide.value = index
  restartSlider()
}

const restartSlider = () => {
  stopSlider()
  startSlider()
}

onMounted(() => {
  startSlider()
})

onUnmounted(() => {
  stopSlider()
})
</script>

<style scoped>
.hero {
  position: relative;
  height: 100vh;
  min-height: 600px;
  margin-top: 0;
  overflow: hidden;
}

.hero-slider {
  position: absolute;
  inset: 0;
}

.hero-slide {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  opacity: 0;
  transition: opacity 1.5s ease;
  display: flex;
  align-items: center;
}

.hero-slide.active {
  opacity: 1;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(13, 45, 90, 0.85) 0%,
    rgba(26, 75, 140, 0.7) 50%,
    rgba(45, 108, 184, 0.5) 100%
  );
}

.hero-content {
  position: relative;
  z-index: 1;
  color: var(--white);
  max-width: 700px;
}

.hero-slide.active .hero-title {
  animation: fadeInUp 0.8s ease 0.3s both;
}

.hero-slide.active .hero-subtitle {
  animation: fadeInUp 0.8s ease 0.5s both;
}

.hero-slide.active .hero-actions {
  animation: fadeInUp 0.8s ease 0.7s both;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  line-height: 1.2;
  letter-spacing: 2px;
}

.hero-subtitle {
  font-size: 1.3rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  letter-spacing: 1px;
}

.hero-actions {
  display: flex;
  gap: 16px;
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

/* Arrows */
.hero-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: var(--white);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 2;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.hero-arrow:hover {
  background: rgba(255, 255, 255, 0.3);
}

.hero-arrow-left {
  left: 30px;
}

.hero-arrow-right {
  right: 30px;
}

/* Dots */
.hero-dots {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 2;
}

.hero-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.hero-dot.active {
  background: var(--white);
  width: 36px;
  border-radius: 6px;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 768px) {
  .hero {
    min-height: 500px;
  }

  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .hero-arrow {
    width: 36px;
    height: 36px;
  }

  .hero-arrow-left {
    left: 12px;
  }

  .hero-arrow-right {
    right: 12px;
  }

  .btn-lg {
    padding: 12px 28px;
    font-size: 0.95rem;
  }
}
</style>
