import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { defineConfig } from 'vitepress'
import { locale } from './theme/content'

// A China domain has not been selected. Local builds must not claim the global
// Pages URL (or Pocket Gallery's domain) as their canonical deployment.
const origin = process.env.SSC_SITE_ORIGIN?.replace(/\/$/, '')
if (origin) {
  const url = new URL(origin)
  if (url.protocol !== 'https:' || url.origin !== origin) {
    throw new Error('SSC_SITE_ORIGIN must be an HTTPS origin without a path.')
  }
}

export default defineConfig({
  base: '/',
  lang: locale.lang,
  title: '苍蓝星图鉴',
  description: locale.description,
  srcExclude: ['README.md', 'ASSETS.md', 'AGENTS.md', 'openspec/**'],
  cleanUrls: false,
  sitemap: origin ? { hostname: origin } : undefined,
  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/icon.png' }],
    ['meta', { name: 'theme-color', content: '#F0E1C2' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:locale', content: 'zh_CN' }],
    ['meta', { property: 'og:site_name', content: '苍蓝星图鉴' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ...(origin
      ? [['meta', { property: 'og:image', content: `${origin}/social.jpg` }] as [string, Record<string, string>]]
      : [['meta', { name: 'robots', content: 'noindex, nofollow' }] as [string, Record<string, string>]]),
  ],
  transformPageData(pageData) {
    const path = pageData.relativePath.replace(/index\.md$/, '').replace(/\.md$/, '.html')
    pageData.frontmatter.head ??= []
    pageData.frontmatter.head.push(
      ['meta', { property: 'og:title', content: `${pageData.title} | 苍蓝星图鉴` }],
      ['meta', { property: 'og:description', content: pageData.description || locale.description }],
    )
    if (origin && pageData.relativePath !== '404.md') {
      pageData.frontmatter.head.push(
        ['link', { rel: 'canonical', href: `${origin}/${path}` }],
        ['meta', { property: 'og:url', content: `${origin}/${path}` }],
      )
    }
  },
  async buildEnd(siteConfig) {
    await writeFile(resolve(siteConfig.outDir, 'robots.txt'), origin
      ? `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`
      : 'User-agent: *\nDisallow: /\n')
  },
  themeConfig: {
    logo: '/icon.png',
    siteTitle: '苍蓝星图鉴',
    nav: [
      { text: '功能', link: '/#features' },
      { text: '常见问题', link: '/faq/' },
      { text: '关于', link: '/others/' },
      { text: '支持我们', link: '/support/' },
      { text: '隐私政策', link: '/privacy/' },
      { text: '下载', link: '/#download' },
      { text: '国际版', link: 'https://eurekaffeine.github.io/sapphire-star-codex/' },
    ],
    outline: { label: locale.contents, level: [2, 3] },
    docFooter: { prev: false, next: false },
    returnToTopLabel: locale.top,
    darkModeSwitchLabel: locale.appearance,
    darkModeSwitchTitle: '切换到深色模式',
    lightModeSwitchTitle: '切换到浅色模式',
    sidebarMenuLabel: locale.menu,
    skipToContentLabel: '跳转到内容',
    notFound: {
      title: '页面未找到',
      quote: '该页面不存在或已移动，请返回首页继续浏览。',
      linkLabel: '返回首页',
      linkText: '返回首页',
    },
    search: {
      provider: 'local',
      options: {
        miniSearch: {
          options: {
            // Chinese prose has no spaces. Use identical deterministic tokens
            // when indexing in Node and searching in the browser.
            tokenize: (text: string) => text.match(/\p{Script=Han}|[a-zA-Z0-9]+/gu) ?? [],
          },
          searchOptions: { combineWith: 'AND', fuzzy: false, prefix: true },
        },
        translations: {
          button: { buttonText: '搜索帮助', buttonAriaLabel: '搜索帮助' },
          modal: {
            displayDetails: '显示详细内容',
            resetButtonTitle: '清空搜索',
            backButtonTitle: '关闭搜索',
            noResultsText: '未找到相关结果',
            footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' },
          },
        },
      },
    },
  },
})
