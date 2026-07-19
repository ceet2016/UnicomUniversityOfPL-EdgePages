import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import { scrollReveal } from './directives/scrollReveal.js'
import './styles/main.css'

const app = createApp(App)
app.use(router)
app.use(i18n)
app.directive('scroll-reveal', scrollReveal)
app.mount('#app')
