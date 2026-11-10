import { defineConfig } from 'vitepress'
import { locales } from './theme/content'

const base = '/sapphire-star-codex/'
const hostname = 'https://eurekaffeine.github.io'

export default defineConfig({
  base,
  title: 'Sapphire Star Codex',
  description: locales.root.description,
  srcExclude: ['README.md', 'ASSETS.md', 'AGENTS.md', 'openspec/**'],
  cleanUrls: false,
  sitemap: { hostname: `${hostname}${base}` },
  head: [
    ['link', { rel: 'icon', type: 'image/png', href: `${base}icon.png` }],
    ['meta', { name: 'theme-color', content: '#F0E1C2' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'Sapphire Star Codex' }],
    ['meta', { property: 'og:image', content: `${hostname}${base}social.jpg` }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
  ],
  transformPageData(pageData) {
    const path = pageData.relativePath.replace(/index\.md$/, '').replace(/\.md$/, '.html')
    pageData.frontmatter.head ??= []
    pageData.frontmatter.head.push(
      ['link', { rel: 'canonical', href: `${hostname}${base}${path}` }],
      ['meta', { property: 'og:url', content: `${hostname}${base}${path}` }],
      ['meta', { property: 'og:title', content: `${pageData.title} | Sapphire Star Codex` }],
      ['meta', { property: 'og:description', content: pageData.description || locales.root.description }],
    )
  },
  locales: Object.fromEntries(Object.entries(locales).map(([key, locale]) => [key, {
    label: locale.label,
    lang: locale.lang,
    link: locale.path,
    description: locale.description,
    themeConfig: {
      nav: [
        { text: locale.nav[0], link: `${locale.path}#features` },
        { text: locale.nav[1], link: `${locale.path}faq/` },
        { text: locale.nav[2], link: `${locale.path}others/` },
        { text: locale.support, link: `${locale.path}support/` },
        { text: locale.privacy, link: `${locale.path}privacy/` },
        { text: locale.nav[3], link: `${locale.path}#download` },
      ],
      outline: { label: locale.contents, level: [2, 3] },
      docFooter: { prev: false, next: false },
      returnToTopLabel: locale.top,
      darkModeSwitchLabel: locale.appearance,
      sidebarMenuLabel: locale.menu,
    },
  }])),
  themeConfig: {
    logo: '/icon.png',
    siteTitle: 'Sapphire Star Codex',
    search: { provider: 'local' },
  },
})
