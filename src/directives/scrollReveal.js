/**
 * Scroll Reveal Directive
 * 使用: v-scroll-reveal 或 v-scroll-reveal="{ delay: 200 }"
 */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target
        const delay = el._scrollRevealDelay || 0
        setTimeout(() => {
          el.classList.add('revealed')
        }, delay)
        observer.unobserve(el)
      }
    })
  },
  { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
)

const scrollReveal = {
  mounted(el, binding) {
    el.classList.add('scroll-reveal')
    if (binding.value && binding.value.delay) {
      el._scrollRevealDelay = binding.value.delay
    }
    observer.observe(el)
  },
  unmounted(el) {
    observer.unobserve(el)
  }
}

export { scrollReveal }
export default scrollReveal
