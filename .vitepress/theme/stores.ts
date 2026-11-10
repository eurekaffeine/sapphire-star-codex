import links from './store-links.json'
import type { LocaleKey } from './content'

export function storeBadges(locale: LocaleKey) {
  const badgeLocale = { root: 'en', 'zh-hans': 'zh-hans', 'zh-hant': 'zh-hant', 'ja-jp': 'jp' }[locale]
  const googleLocale = locale === 'ja-jp' ? 'ja' : badgeLocale
  // Pocket Gallery has no Chinese AppGallery artwork; retain its English fallback.
  const galleryBadge = locale === 'ja-jp' ? 'app-gallery-badge-jp.svg' : 'app-gallery-badge-en.png'
  return [
    { id: 'apple', name: 'App Store', badge: `app-store-badge-${badgeLocale}.svg`, url: links.appStore, imageHeight: 48 },
    // Official PNGs include transparent clearspace. Match the visible 48px badge
    // height without cropping, recoloring or stretching the original artwork.
    { id: 'google', name: 'Google Play', badge: `google-play-badge-${googleLocale}.png`, url: links.googlePlay, imageHeight: locale === 'root' ? 71.43 : 62.5 },
    { id: 'harmony', name: 'AppGallery', badge: galleryBadge, url: links.appGallery, imageHeight: 48 },
  ]
}
