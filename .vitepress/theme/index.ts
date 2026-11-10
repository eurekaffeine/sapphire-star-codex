import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import Layout from './Layout.vue'
import SupportPayments from './components/SupportPayments.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) { app.component('SupportPayments', SupportPayments) },
} satisfies Theme
