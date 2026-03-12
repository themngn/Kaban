import { onMounted, ref } from 'vue'

const THEME_STORAGE_KEY = 'kanban-theme'
const isDark = ref(false)

export function useTheme() {
  function applyTheme(dark: boolean) {
    const html = document.documentElement
    if (dark) {
      html.setAttribute('data-theme', 'dark')
    } else {
      html.removeAttribute('data-theme')
    }
    isDark.value = dark
    localStorage.setItem(THEME_STORAGE_KEY, dark ? 'dark' : 'light')
  }

  function toggleTheme() {
    applyTheme(!isDark.value)
  }

  function initTheme() {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    let preferDark: boolean

    if (stored) {
      preferDark = stored === 'dark'
    } else {
      // Respect system preference as default
      preferDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    }

    applyTheme(preferDark)
  }

  onMounted(() => {
    initTheme()
  })

  return {
    isDark,
    toggleTheme,
    initTheme,
  }
}
