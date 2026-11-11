import { readdir, readFile, stat } from 'node:fs/promises'
import { resolve, relative } from 'node:path'
import { createHash } from 'node:crypto'

const root = resolve('.vitepress/dist')
const base = '/'
const files = []
async function walk(dir) {
  for (const item of await readdir(dir, { withFileTypes: true })) {
    const path = resolve(dir, item.name)
    if (item.isDirectory()) await walk(path)
    else files.push(path)
  }
}
await walk(root)
const errors = []
if (files.some(file => relative(root, file).split('/').includes('release-notes'))) errors.push('Removed development pages remain in the build')
const stores = JSON.parse(await readFile(resolve('.vitepress/theme/store-links.json'),'utf8'))
const expectedGallery = 'https://appgallery.huawei.com/app/detail?id=com.eurekaffeine.monsterhunterdex&channelId=SHARE&source=appshare'
if (stores.appGallery!==expectedGallery || stores.appStore!==null || stores.androidChina!==null || 'googlePlay' in stores) errors.push('Unverified store availability or wrong product URL')
const htmlFiles = files.filter(file => file.endsWith('.html'))
const html = new Map(await Promise.all(htmlFiles.map(async file => [file, await readFile(file, 'utf8')])))
for (const [file, content] of html) {
  if (content.includes('/release-notes/')) errors.push(`${relative(root, file)} links to a removed development page`)
  const branding = content.replaceAll(expectedGallery,'').replaceAll(expectedGallery.replaceAll('&','&amp;'),'')
  if (/MonsterHunterDex|monster-hunter-dex/i.test(branding)) errors.push(`${relative(root, file)} contains retired site branding`)
  if (/id6464266038|com\.eurekaffeine\.pokedex\.renaissance|nlFEFYg8Cc/.test(content)) errors.push(`${relative(root,file)} links to Pocket Gallery's product`)

  for (const match of content.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const value = match[1].replaceAll('&amp;', '&')
    if (/^(https?:|mailto:|data:|tel:)/.test(value)) continue
    const url = new URL(value, `https://example.org${base}${relative(root, file)}`)
    if (!url.pathname.startsWith(base)) {
      errors.push(`${relative(root, file)} escapes Pages base: ${value}`)
      continue
    }
    let target = resolve(root, decodeURIComponent(url.pathname.slice(base.length)))
    if (url.pathname.endsWith('/')) target = resolve(target, 'index.html')
    if (!files.includes(target)) {
      errors.push(`${relative(root, file)} has missing target: ${value}`)
      continue
    }
    if (url.hash && html.has(target)) {
      const id = decodeURIComponent(url.hash.slice(1))
      if (id && !html.get(target).includes(`id="${id}"`)) errors.push(`${relative(root, file)} has missing anchor: ${value}`)
    }
  }
}
for (const locale of ['']) {
  for (const page of ['', 'faq/', 'others/', 'privacy/', 'support/']) {
    if (!html.has(resolve(root, locale, page, 'index.html'))) errors.push(`Missing localized page: ${locale}${page}`)
  }
  const landing = html.get(resolve(root, locale, 'index.html'))
  const support = html.get(resolve(root, locale, 'support/index.html')) || ''
  for (const file of ['qr_alipay.jpg', 'qr_wechat.jpg']) {
    if (!support.includes(`src="${base}support/${file}"`)
      || !support.includes(`href="${base}support/${file}"`)
      || !support.includes(`download="${file}"`)) errors.push(`Missing support QR/download: ${locale}/${file}`)
  }
  if (!landing?.includes(`href="${base}${locale}support/"`)) errors.push(`Missing localized support navigation: ${locale || 'en/'}`)
  if (landing) {
    const section = landing.match(/<section id="download"[\s\S]*?<\/section>/)?.[0] || ''
    if ((section.match(/<img\b/g) || []).length !== 2 || (section.match(/<a\b/g) || []).length !== 1
      || (section.match(/aria-disabled="true"/g) || []).length !== 1
      || !section.includes(expectedGallery.replaceAll('&', '&amp;'))
      || !section.includes('Android 国内版') || !section.includes('尚未上架')
      || !section.includes('rel="noopener noreferrer"')) errors.push('Incorrect China download links or availability')
    if (/Google Play|google-play|play\.google/.test(section)) errors.push('Global Android store remains in China downloads')
    for (const badge of ['app-store-badge-zh-hans.svg', 'app-gallery-badge-en.png']) {
      if (!section.includes(`${base}badges/${badge}`)) errors.push(`Wrong China badge: ${badge}`)
    }
    const captions = [...landing.matchAll(/<figcaption\b[^>]*>([\s\S]*?)<\/figcaption>/g)]
    if (captions.length !== 0) {
      errors.push(`Unexpected source caption for the all-iOS screenshot set: ${locale || 'en/'}`)
    }
  }
}
const badgeManifest = JSON.parse(await readFile(resolve(root,'badges/manifest.json'),'utf8'))
if (badgeManifest.assets.length!==2) errors.push('Incomplete badge asset set')
for (const asset of badgeManifest.assets) {
  const buffer = await readFile(resolve(root,'badges',asset.file))
  if (createHash('sha256').update(buffer).digest('hex')!==asset.sha256) errors.push(`Modified badge artwork: ${asset.file}`)
  if (buffer.subarray(0,100).toString().includes('git-lfs') || buffer.length>300_000) errors.push(`Invalid badge payload: ${asset.file}`)
}
const screenshots = JSON.parse(await readFile(resolve(root, 'screenshots/manifest.json'), 'utf8'))
const imageAssets = ['beian.png', 'icon.png', 'social.jpg', 'frames/iphone-18-pro.png', 'frames/iphone-18-pro-screen-mask.png']
const payments = JSON.parse(await readFile(resolve(root, 'support/manifest.json'), 'utf8'))
const paymentSources = { alipay: 'bc73b73480bd077ccd3b64c47942bbc86308ed1c', wechat: '2b9ffb1ecc00b6f75c1ddfd6d799464b53365a6e' }
if (payments.assets?.length !== 2) errors.push('Incomplete support QR set')
for (const [provider, originalBlob] of Object.entries(paymentSources)) {
  const asset = payments.assets?.find(asset => asset.provider === provider)
  if (!asset || asset.file !== `qr_${provider}.jpg`) { errors.push(`Missing payment QR: ${provider}`); continue }
  const buffer = await readFile(resolve(root, 'support', asset.file))
  const blob = createHash('sha1').update(`blob ${buffer.length}\0`).update(buffer).digest('hex')
  if (blob !== originalBlob || asset.sourceGitBlob !== originalBlob
    || buffer.length !== asset.bytes || createHash('sha256').update(buffer).digest('hex') !== asset.sha256) errors.push(`Modified original payment QR: ${provider}`)
  imageAssets.push(`support/${asset.file}`)
}
const expectedLanguages = ['zh-Hans']
if (Object.keys(screenshots.locales).join(',') !== 'zh-Hans') errors.push('Non-Chinese screenshots remain')
const expectedTopics = ['home', 'hitzones', 'weapon', 'builder', 'saved']
if (screenshots.schemaVersion !== 2 || screenshots.deviceFrame !== 'iPhone 18 Pro'
  || screenshots.captureSettings?.silhouetteMonsters !== false || screenshots.captureSettings?.showGameLogos !== true) errors.push('Unexpected screenshot contract')
for (const language of expectedLanguages) {
  for (const topic of expectedTopics) {
    const entry = screenshots.locales?.[language]?.[topic]
    if (!entry || entry.language !== language || entry.asset !== `${language}/${topic}.webp`
      || entry.deviceFrame !== 'iPhone 18 Pro' || entry.width !== 660 || entry.height !== 1317
      || entry.platform !== 'iOS') {
      errors.push(`Screenshot frame/language mismatch: ${language}/${topic}`)
      continue
    }
    imageAssets.push(`screenshots/${entry.asset}`)
    const image = await readFile(resolve(root, 'screenshots', entry.asset))
    if (image.toString('ascii', 12, 16) !== 'VP8X'
      || image.readUIntLE(24, 3) + 1 !== entry.width || image.readUIntLE(27, 3) + 1 !== entry.height) {
      errors.push(`Unexpected framed image dimensions: ${entry.asset}`)
    }
  }
}
for (const name of imageAssets) {
  const file = resolve(root, name)
  const buffer = await readFile(file)
  if (buffer.subarray(0, 50).toString().includes('git-lfs')) errors.push(`LFS pointer shipped: ${name}`)
  if ((await stat(file)).size > 300_000) errors.push(`Unoptimized website asset: ${name}`)
}

const registrationUrl = 'https://beian.mps.gov.cn/#/query/webSearch?code=32059002005040'
for (const page of ['', 'faq/', 'others/', 'privacy/', 'support/']) {
  const content = html.get(resolve(root, page, 'index.html')) || ''
  if (!content.includes(`href="${registrationUrl}"`) || !content.includes('苏公网安备32059002005040号')
    || !content.includes(`src="${base}beian.png"`)) errors.push(`Missing China registration footer: ${page || '/'}`)
}
const registrationIcon = await readFile(resolve(root, 'beian.png'))
if (createHash('sha256').update(registrationIcon).digest('hex') !== '8dfecad0dfcb3dc584f2c2447943eefb1fd65a058856eb0611e2c56ddc4c1fe1') errors.push('Modified registration icon')

const expectedPages = ['404.html', 'index.html', 'faq/index.html', 'others/index.html', 'privacy/index.html', 'support/index.html']
if (JSON.stringify(htmlFiles.map(file => relative(root, file)).sort()) !== JSON.stringify(expectedPages.sort())) errors.push('Unexpected China page set')
const origin = process.env.SSC_SITE_ORIGIN?.replace(/\/$/, '')
for (const [file, content] of html) {
  if (!content.includes('<html lang="zh-Hans"')) errors.push(`Wrong page language: ${relative(root, file)}`)
  if (/class="VPNavBarTranslations|class="VPNavScreenTranslations/.test(content)) errors.push('Language selector remains')
  if (/href="\/(?:zh-hans|zh-hant|ja-jp)\//.test(content)) errors.push('Localized subdirectory link remains')
  if (origin && !file.endsWith('/404.html')) {
    const path = relative(root, file).replace(/index\.html$/, '')
    if (!content.includes(`rel="canonical" href="${origin}/${path}"`)) errors.push(`Incorrect canonical URL: ${path}`)
  } else if (!origin && !content.includes('content="noindex, nofollow"')) errors.push('Preview missing noindex')
}
const robots = await readFile(resolve(root, 'robots.txt'), 'utf8')
if (origin) {
  if (!robots.includes(`Sitemap: ${origin}/sitemap.xml`)) errors.push('Wrong China robots sitemap')
  const sitemap = await readFile(resolve(root, 'sitemap.xml'), 'utf8')
  if (/zh-hans|zh-hant|ja-jp|github\.io/.test(sitemap)) errors.push('Non-China sitemap routes')
} else if (files.includes(resolve(root, 'sitemap.xml')) || !robots.includes('Disallow: /')) errors.push('Preview incorrectly indexable')
if (files.some(file => /(?:screenshots\/(?:en|ja|zh-Hant)\/|google-play-badge)/.test(relative(root, file)))) errors.push('Non-China public assets remain')
if (errors.length) throw new Error(errors.join('\n'))
console.log(`Verified ${htmlFiles.length} built pages: China routes, links, anchors, metadata, mainland stores, exact China QR assets and five Simplified Chinese iPhone frames.`)
