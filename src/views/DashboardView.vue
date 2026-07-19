<template>
  <div class="dashboard-page">
    <AppHeader />

    <div class="page-banner">
      <div class="container">
        <h1>校务管理系统</h1>
        <p>请选择需要使用的管理功能</p>
      </div>
    </div>

    <div class="container content-area">
      <div class="system-grid">
        <router-link to="/admission-letter" class="system-card" v-scroll-reveal>
          <div class="system-icon admission-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
          </div>
          <div class="system-content">
            <h2>录取通知书生成</h2>
            <p>填写学生信息，生成正式录取通知书，支持下载和在线查询验证。</p>
          </div>
          <div class="system-arrow">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </div>
        </router-link>

        <router-link to="/diploma" class="system-card" v-scroll-reveal="{ delay: 100 }">
          <div class="system-icon diploma-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
              <path d="M6 12v5c3 3 9 3 12 0v-5"/>
            </svg>
          </div>
          <div class="system-content">
            <h2>毕业证颁发</h2>
            <p>为毕业生颁发正式毕业证书，支持下载和在线查询验证。</p>
          </div>
          <div class="system-arrow">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </div>
        </router-link>
      </div>

      <div class="query-links" v-scroll-reveal="{ delay: 200 }">
        <h3 class="links-title">公开查询入口</h3>
        <div class="query-links-grid">
          <router-link to="/select" class="query-link-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            录取通知书查询
          </router-link>
          <router-link to="/diploma-select" class="query-link-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            毕业证查询
          </router-link>
        </div>
      </div>
    </div>

    <AppFooter />
    <ScrollToTop />
  </div>
</template>

<script setup>
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import ScrollToTop from '@/components/common/ScrollToTop.vue'
</script>

<style scoped>
.dashboard-page {
  min-height: 100vh;
  background: var(--bg-page);
}

.page-banner {
  background: var(--gradient-primary);
  color: var(--white);
  padding: 40px 0;
  margin-top: var(--header-height);
  text-align: center;
}

.page-banner h1 {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.page-banner p {
  font-size: 0.95rem;
  opacity: 0.9;
}

.content-area {
  padding: 48px 0 60px;
}

.system-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  max-width: 900px;
  margin: 0 auto;
}

.system-card {
  display: flex;
  align-items: center;
  gap: 24px;
  background: var(--white);
  border-radius: var(--radius-lg);
  padding: 36px 32px;
  box-shadow: var(--shadow-md);
  transition: all 0.3s ease;
  border: 1px solid var(--border-light);
  text-decoration: none;
  color: inherit;
}

.system-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-xl);
  border-color: var(--primary-lighter);
}

.system-icon {
  width: 72px;
  height: 72px;
  flex-shrink: 0;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--white);
}

.admission-icon {
  background: var(--gradient-primary);
}

.diploma-icon {
  background: linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%);
}

.system-content {
  flex: 1;
}

.system-content h2 {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--primary-dark);
  margin-bottom: 8px;
}

.system-content p {
  font-size: 0.88rem;
  color: var(--text-muted);
  line-height: 1.6;
}

.system-arrow {
  color: var(--gray-400);
  transition: all 0.3s ease;
}

.system-card:hover .system-arrow {
  color: var(--primary);
  transform: translateX(6px);
}

/* Query links section */
.query-links {
  max-width: 900px;
  margin: 48px auto 0;
  padding-top: 36px;
  border-top: 1px solid var(--border-light);
}

.links-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--primary-dark);
  margin-bottom: 20px;
  text-align: center;
}

.query-links-grid {
  display: flex;
  justify-content: center;
  gap: 24px;
}

.query-link-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 28px;
  background: var(--white);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: 0.9rem;
  color: var(--text-secondary);
  transition: all 0.3s ease;
  text-decoration: none;
}

.query-link-item:hover {
  border-color: var(--primary);
  color: var(--primary);
  background: var(--primary-bg);
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .system-grid {
    grid-template-columns: 1fr;
  }

  .system-card {
    padding: 24px 20px;
    gap: 16px;
  }

  .system-icon {
    width: 56px;
    height: 56px;
  }

  .query-links-grid {
    flex-direction: column;
    align-items: center;
  }
}
</style>
