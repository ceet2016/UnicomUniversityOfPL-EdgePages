<template>
  <div class="home">
    <AppHeader />
    <HeroSlider />
    <QuickLinks />
    <NewsSection />
    <StatsSection />
    <AppFooter />
    <ScrollToTop />
  </div>
</template>

<script setup>
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import ScrollToTop from '@/components/common/ScrollToTop.vue'
import HeroSlider from '@/components/home/HeroSlider.vue'
import QuickLinks from '@/components/home/QuickLinks.vue'
import NewsSection from '@/components/home/NewsSection.vue'
import StatsSection from '@/components/home/StatsSection.vue'
</script>
