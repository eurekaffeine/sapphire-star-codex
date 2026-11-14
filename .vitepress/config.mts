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
    ['meta', { name: 'theme-color', content: '#B8533A' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'Sapphire Star Codex' }],
    ['meta', { property: 'og:image', content: `${hostname}${base}social.jpg` }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
  ],
  transformPageData(pageData) {
    const locale = Object.values(locales).find(item => item.path !== '/' && pageData.relativePath.startsWith(item.path.slice(1))) ?? locales.root
    const path = pageData.relativePath.replace(/index\.md$/, '').replace(/\.md$/, '.html')
    pageData.frontmatter.head ??= []
    pageData.frontmatter.head.push(
      ['link', { rel: 'canonical', href: `${hostname}${base}${path}` }],
      ['meta', { property: 'og:url', content: `${hostname}${base}${path}` }],
      ['meta', { property: 'og:title', content: `${pageData.title} | ${locale.brand}` }],
      ['meta', { property: 'og:description', content: pageData.description || locale.description }],
    )
  },
  locales: Object.fromEntries(Object.entries(locales).map(([key, locale]) => [key, {
    label: locale.label,
    lang: locale.lang,
    dir: locale.dir,
    link: locale.path,
    description: locale.description,
    themeConfig: {
      siteTitle: locale.brand,
      langMenuLabel: locale.languageMenuLabel,
      skipToContentLabel: locale.chrome.skip,
      darkModeSwitchTitle: locale.chrome.dark,
      lightModeSwitchTitle: locale.chrome.light,
      notFound: { title: locale.chrome.notFound, quote: locale.chrome.notFoundBody, linkLabel: locale.chrome.home, linkText: locale.chrome.home },
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
    search: {
      provider: 'local',
      options: {
        miniSearch: {
          options: {
            tokenize: (text: string) => text.normalize('NFKD').replace(/\p{M}/gu, '')
              .replace(/([\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}])/gu, ' $1 ')
              .match(/[\p{L}\p{N}]+/gu) ?? [],
          },
          searchOptions: { combineWith: 'AND', prefix: true, fuzzy: 0.2 },
        },
        locales: Object.fromEntries(Object.entries(locales).map(([key, locale]) => [key, {
          translations: {
            button: { buttonText: locale.search.label, buttonAriaLabel: locale.search.label },
            modal: {
              displayDetails: locale.search.details, resetButtonTitle: locale.search.clear,
              backButtonTitle: locale.search.close, noResultsText: locale.search.noResults,
              footer: { selectText: locale.search.select, navigateText: locale.search.navigate, closeText: locale.search.close },
            },
          },
        }])),
      },
    },
  },
})
