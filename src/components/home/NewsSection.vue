<template>
  <section class="news-section section-alt">
    <div class="container">
      <div class="section-title">
        <h2>{{ t('home.newsTitle') }}</h2>
        <p>{{ t('home.newsDesc') }}</p>
      </div>
      <div class="news-grid">
        <article
          v-for="(news, index) in newsItems"
          :key="index"
          class="news-card"
          v-scroll-reveal="{ delay: index * 100 }"
        >
          <div class="news-image">
            <img :src="news.image" :alt="news.title" loading="lazy" />
            <span class="news-date">{{ news.date }}</span>
          </div>
          <div class="news-body">
            <span class="news-category">{{ news.category }}</span>
            <h3>{{ news.title }}</h3>
            <p>{{ news.desc }}</p>
            <a href="#" class="news-read-more">
              {{ t('home.readMore') }}
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </a>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, tm, locale } = useI18n()

const images = ['/images/picsum_4.jpg', '/images/picsum_5.jpg', '/images/picsum_6.jpg']

const getNewsItems = () => {
  const raw = tm('home.newsItems')
  return raw.map((item, i) => ({
    ...item,
    image: images[i] || '/images/picsum_4.jpg'
  }))
}

const newsItems = ref(getNewsItems())

watch(locale, () => {
  newsItems.value = getNewsItems()
})
</script>

<style scoped>
.news-section {
  padding: 80px 0;
  background: var(--bg-alt);
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.news-card {
  background: var(--white);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.news-card:hover {
  box-shadow: var(--shadow-xl);
  transform: translateY(-6px);
}

.news-image {
  position: relative;
  height: 220px;
  overflow: hidden;
}

.news-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.news-card:hover .news-image img {
  transform: scale(1.08);
}

.news-date {
  position: absolute;
  bottom: 12px;
  left: 12px;
  background: var(--primary);
  color: var(--white);
  padding: 4px 12px;
  border-radius: var(--radius-sm);
  font-size: 0.8rem;
  font-weight: 500;
}

.news-body {
  padding: 24px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.news-category {
  display: inline-block;
  font-size: 0.75rem;
  color: var(--accent-dark);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 8px;
}

.news-body h3 {
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--primary-dark);
  margin-bottom: 12px;
  line-height: 1.4;
  transition: color 0.2s;
}

.news-card:hover .news-body h3 {
  color: var(--primary);
}

.news-body p {
  font-size: 0.88rem;
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: 16px;
  flex: 1;
}

.news-read-more {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--primary);
  transition: gap 0.2s;
}

.news-read-more:hover {
  gap: 10px;
  color: var(--primary-dark);
}

@media (max-width: 768px) {
  .news-grid {
    grid-template-columns: 1fr;
  }
}
</style>
