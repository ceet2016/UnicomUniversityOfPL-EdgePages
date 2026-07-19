<template>
  <section class="page-hero">
    <div class="page-hero-bg" :style="{ backgroundImage: `url(${image})` }"></div>
    <div class="page-hero-overlay"></div>
    <div class="page-hero-content container">
      <h1>{{ title }}</h1>
      <p v-if="subtitle">{{ subtitle }}</p>
    </div>
  </section>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    required: true
  }
})
</script>

<style scoped>
.page-hero {
  position: relative;
  height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: var(--white);
  overflow: hidden;
  margin-top: var(--header-height);
}

.page-hero-bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
}

.page-hero-overlay {
  position: absolute;
  inset: 0;
  background: var(--gradient-overlay);
}

.page-hero-content {
  position: relative;
  z-index: 1;
}

.page-hero-content h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  letter-spacing: 2px;
}

.page-hero-content p {
  font-size: 1.1rem;
  opacity: 0.9;
  letter-spacing: 1px;
}

@media (max-width: 768px) {
  .page-hero {
    height: 240px;
  }

  .page-hero-content h1 {
    font-size: 1.75rem;
  }

  .page-hero-content p {
    font-size: 0.95rem;
  }
}
</style>
