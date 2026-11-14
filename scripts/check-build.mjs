import { readdir, readFile, stat } from 'node:fs/promises'
import { resolve, relative, dirname } from 'node:path'
import { createHash } from 'node:crypto'

const root = resolve('.vitepress/dist')
const base = '/sapphire-star-codex/'
const localeMetadata = JSON.parse(await readFile(resolve('.vitepress/theme/locales.json'), 'utf8'))
const expectedLanguages = ['en', 'ja', 'zh-Hans', 'zh-Hant', 'ko', 'fr', 'de', 'es', 'es-419', 'it', 'ru', 'pt-BR', 'pl', 'ar']
if (Object.keys(localeMetadata).length !== 14 || new Set(Object.values(localeMetadata).map(locale => locale.screenshotLanguage)).size !== 14) throw new Error('Expected fourteen distinct website/capture locales')
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
const expectedGooglePlay = 'https://play.google.com/store/apps/details?id=com.eurekaffeine.mhd'
if (stores.appGallery!==expectedGallery || stores.appStore!==null || stores.googlePlay!==expectedGooglePlay) errors.push('Unverified store availability or wrong product URL')
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
for (const metadata of Object.values(localeMetadata)) {
  const locale = metadata.path.slice(1)
  for (const page of ['', 'faq/', 'others/', 'privacy/', 'support/']) {
    const content = html.get(resolve(root, locale, page, 'index.html'))
    if (!content) errors.push(`Missing localized page: ${locale}${page}`)
    else if (!content.includes(`lang="${metadata.lang}"`) || !content.includes(`dir="${metadata.dir}"`)) errors.push(`Wrong page language/direction: ${locale}${page}`)
  }
  for (const page of ['faq/', 'others/']) {
    const content = html.get(resolve(root, locale, page, 'index.html')) || ''
    if (!content.includes(`href="${expectedGooglePlay}"`)) errors.push(`Missing published Android link: ${locale}${page}`)
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
    if ((section.match(/<img\b/g)||[]).length!==3 || (section.match(/<a\b/g)||[]).length!==2
      || (section.match(/aria-disabled="true"/g)||[]).length!==1
      || !section.includes(expectedGooglePlay)
      || !section.includes(expectedGallery.replaceAll('&','&amp;')) || !section.includes('rel="noopener noreferrer"')) errors.push(`Incorrect badge/link/state contract: ${locale||'en/'}`)
    if (landing.includes('class="ssc-updates"') || section.includes('ssc-store-status')) errors.push(`Removed development section or store status labels remain: ${locale||'en/'}`)
    const badgeLocale = metadata.badgeLocale
    const googleLocale = badgeLocale==='jp'?'ja':badgeLocale
    const galleryFile = 'harmonyos-next-badge.webp'
    for (const badge of [`app-store-badge-${badgeLocale}.svg`,`google-play-badge-${googleLocale}.png`,galleryFile]) {
      if (!section.includes(`${base}badges/${badge}`)) errors.push(`Wrong localized badge: ${locale}/${badge}`)
    }
    const captions = [...landing.matchAll(/<figcaption\b[^>]*>([\s\S]*?)<\/figcaption>/g)]
    if (captions.length !== 0) {
      errors.push(`Unexpected source caption for the all-iOS screenshot set: ${locale || 'en/'}`)
    }
  }
}
const badgeManifest = JSON.parse(await readFile(resolve(root,'badges/manifest.json'),'utf8'))
if (badgeManifest.assets.length!==19) errors.push('Incomplete badge asset set')
for (const asset of badgeManifest.assets) {
  const buffer = await readFile(resolve(root,'badges',asset.file))
  if (createHash('sha256').update(buffer).digest('hex')!==asset.sha256) errors.push(`Modified badge artwork: ${asset.file}`)
  if (buffer.subarray(0,100).toString().includes('git-lfs') || buffer.length>300_000) errors.push(`Invalid badge payload: ${asset.file}`)
}
const screenshots = JSON.parse(await readFile(resolve(root, 'screenshots/manifest.json'), 'utf8'))
const imageAssets = ['icon.png', 'social.jpg', 'frames/iphone-18-pro.png', 'frames/iphone-18-pro-screen-mask.png']
const payments = JSON.parse(await readFile(resolve(root, 'support/manifest.json'), 'utf8'))
const paymentSources = { alipay: 'e2ba3809c69e5bb8fa175765137c6f1553bf4fc3', wechat: 'c93d8e3ade1511a37dc9ad33d98cbd1656a795df' }
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
const expectedTopics = ['home', 'hitzones', 'weapon', 'builder', 'saved']
if (screenshots.schemaVersion !== 2 || screenshots.deviceFrame !== 'iPhone 18 Pro'
  || screenshots.captureSettings?.silhouetteMonsters !== false || screenshots.captureSettings?.showGameLogos !== true) errors.push('Unexpected screenshot contract')
for (const language of expectedLanguages) {
  for (const topic of expectedTopics) {
    const entry = screenshots.locales?.[language]?.[topic]
    if (!entry || entry.language !== language || entry.asset !== `${language}/${topic}.webp`
      || entry.deviceFrame !== 'iPhone 18 Pro' || entry.width !== 660 || entry.height !== 1317
      || entry.platform !== 'iOS' || !(Date.parse(entry.capturedAt) >= Date.parse('2026-11-14'))
      || !/^[a-f0-9]{64}$/.test(entry.captureSha256 || '')) {
      errors.push(`Screenshot frame/language mismatch: ${language}/${topic}`)
      continue
    }
    imageAssets.push(`screenshots/${entry.asset}`)
    const image = await readFile(resolve(root, 'screenshots', entry.asset))
    if (createHash('sha256').update(image).digest('hex') !== entry.sha256 || image.length !== entry.bytes) errors.push(`Screenshot hash/size mismatch: ${entry.asset}`)
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

if (htmlFiles.length !== 71) errors.push(`Expected 71 built pages, got ${htmlFiles.length}`)
if (Object.keys(screenshots.locales).length !== 14) errors.push('Expected 14 screenshot locales')
if (errors.length) throw new Error(errors.join('\n'))
console.log(`Verified ${htmlFiles.length} built pages: localized routes, links, anchors, Pages base, image payloads and all 70 matching-language iPhone frames.`)
