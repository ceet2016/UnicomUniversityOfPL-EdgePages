import { createI18n } from 'vue-i18n'
import zh from './locales/zh.json'
import en from './locales/en.json'
import ja from './locales/ja.json'
import ko from './locales/ko.json'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: { zh, en, ja, ko }
})

export default i18n
