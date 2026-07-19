const fs = require('fs');
const filePath = 'src/views/AcademicsView.vue';

let content = fs.readFileSync(filePath, 'utf8');

const oldScript = `<script setup>
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import ScrollToTop from '@/components/common/ScrollToTop.vue'
import PageHero from '@/components/common/PageHero.vue'
import { scrollReveal as vScrollReveal } from '@/directives/scrollReveal.js'

const researchAreas = [
  {
    title: '人工智能',
    titleEn: 'Artificial Intelligence',
    desc: '深度学习、自然语言处理、计算机视觉、智能决策等方向的前沿研究，在医疗AI、自动驾驶等领域取得突破性进展。',
    image: '/images/picsum_4.jpg',
    tags: ['深度学习', 'NLP', '计算机视觉']
  },
  {
    title: '生物科技',
    titleEn: 'Biotechnology',
    desc: '生物信息学、基因工程、合成生物学等交叉学科研究，致力于解决人类健康和可持续发展的关键问题。',
    image: '/images/picsum_5.jpg',
    tags: ['基因工程', '生物信息', '合成生物']
  },
  {
    title: '环境科学',
    titleEn: 'Environmental Science',
    desc: '气候变化、环境污染治理、可再生能源等领域的研究，为可持续发展提供科学依据和技术支持。',
    image: '/images/picsum_6.jpg',
    tags: ['气候研究', '污染治理', '可再生能源']
  },
  {
    title: '数据科学',
    titleEn: 'Data Science',
    desc: '大数据分析、数据挖掘、分布式计算等方向，构建智能数据处理平台，服务科学研究和产业应用。',
    image: '/images/picsum_8.jpg',
    tags: ['大数据', '数据挖掘', '分布式计算']
  }
]

const projects = [
  {
    title: '智能医疗诊断系统',
    desc: '基于深度学习的医学影像分析系统，能够辅助医生进行疾病诊断，准确率已达到国际领先水平。',
    status: '进行中',
    statusClass: 'status-active',
    leader: '张教授团队',
    duration: '2023-2025',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>'
  },
  {
    title: '可持续能源解决方案',
    desc: '开发新型太阳能电池和储能技术，提高能源利用效率，为波兰及欧洲的能源转型提供技术支撑。',
    status: '已完成',
    statusClass: 'status-done',
    leader: '李教授团队',
    duration: '2021-2024',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>'
  },
  {
    title: '智慧城市物联网',
    desc: '构建城市级物联网平台，实现交通、安防、环境监测等领域的智能化管理，已在华沙市试点应用。',
    status: '进行中',
    statusClass: 'status-active',
    leader: '王教授团队',
    duration: '2022-2026',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>'
  }
]

const resources = [
  { title: '图书馆', desc: '藏书超过100万册，提供丰富的电子资源和数据库访问服务。' },
  { title: '实验室', desc: '拥有50余个专业实验室，配备先进的科研仪器和设备。' },
  { title: '学术期刊', desc: '学校主办3本国际学术期刊，覆盖通信、计算机和数据科学领域。' },
  { title: '学术交流', desc: '定期举办国际学术会议和讲座，促进学术交流与合作。' }
]
</script>`;

const newScript = `<script setup>
import { computed } from 'vue'
import { useI18n, tm } from 'vue-i18n'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import ScrollToTop from '@/components/common/ScrollToTop.vue'
import PageHero from '@/components/common/PageHero.vue'
import { scrollReveal as vScrollReveal } from '@/directives/scrollReveal.js'

const { t, locale } = useI18n()

const researchAreas = computed(() => {
  const data = tm('academics.researchAreas')
  return Array.isArray(data) ? data : []
})

const projects = computed(() => {
  const data = tm('academics.projects')
  return Array.isArray(data) ? data : []
})

const resources = computed(() => {
  const data = tm('academics.resources')
  return Array.isArray(data) ? data : []
})
</script>`;

if (!content.includes(oldScript)) {
  console.log('ERROR: oldScript not found!');
  process.exit(1);
}

content = content.replace(oldScript, newScript);
fs.writeFileSync(filePath, content, 'utf8');
console.log('AcademicsView.vue script section updated!');
