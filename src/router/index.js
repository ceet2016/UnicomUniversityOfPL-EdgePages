import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: '首页 - 波兰联通大学' }
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/AboutView.vue'),
    meta: { title: '学校概况 - 波兰联通大学' }
  },
  {
    path: '/academics',
    name: 'academics',
    component: () => import('@/views/AcademicsView.vue'),
    meta: { title: '学术研究 - 波兰联通大学' }
  },
  {
    path: '/admissions',
    name: 'admissions',
    component: () => import('@/views/AdmissionsView.vue'),
    meta: { title: '招生信息 - 波兰联通大学' }
  },
  {
    path: '/campus',
    name: 'campus',
    component: () => import('@/views/CampusView.vue'),
    meta: { title: '校园生活 - 波兰联通大学' }
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import('@/views/ContactView.vue'),
    meta: { title: '联系我们 - 波兰联通大学' }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { title: '管理员登录 - 波兰联通大学' }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { title: '校务管理系统 - 波兰联通大学', requiresAuth: true }
  },
  {
    path: '/admission-letter',
    name: 'admission-letter',
    component: () => import('@/views/AdmissionLetterView.vue'),
    meta: { title: '录取通知书生成系统 - 波兰联通大学', requiresAuth: true }
  },
  {
    path: '/diploma',
    name: 'diploma',
    component: () => import('@/views/DiplomaView.vue'),
    meta: { title: '毕业证颁发系统 - 波兰联通大学', requiresAuth: true }
  },
  {
    path: '/select',
    name: 'select',
    component: () => import('@/views/SelectView.vue'),
    meta: { title: '录取通知书查询 - 波兰联通大学' }
  },
  {
    path: '/diploma-select',
    name: 'diploma-select',
    component: () => import('@/views/DiplomaSelectView.vue'),
    meta: { title: '毕业证查询 - 波兰联通大学' }
  }
]

const router = createRouter({
  // Hash mode: all routes live under "/#/..." so deep links (e.g. QR codes)
  // only ever request "/" — the static index.html is served directly by the
  // CDN without hitting the serverless function. This makes SPA routing work
  // reliably on EdgeOne Makers, which does not support SPA history rewrites.
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth', top: 80 }
    return { top: 0, behavior: 'smooth' }
  }
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || '波兰联通大学'

  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('sessionToken')
    const loginTime = localStorage.getItem('loginTime')
    if (token && loginTime) {
      const elapsed = Date.now() - parseInt(loginTime)
      const twentyFourHours = 24 * 60 * 60 * 1000
      if (elapsed < twentyFourHours) {
        next()
        return
      }
    }
    next('/login')
    return
  }

  next()
})

export default router
