import links from './store-links.json'
import { locales, type LocaleKey } from './content'

export function storeBadges(locale: LocaleKey) {
  const badgeLocale = locales[locale].badgeLocale
  const googleLocale = badgeLocale === 'jp' ? 'ja' : badgeLocale
  return [
    { id: 'apple', name: 'App Store', badge: `app-store-badge-${badgeLocale}.svg`, url: links.appStore, imageHeight: 48 },
    // Official PNGs include transparent clearspace. Match the visible 48px badge
    // height without cropping, recoloring or stretching the original artwork.
    { id: 'google', name: 'Google Play', badge: `google-play-badge-${googleLocale}.png`, url: links.googlePlay, imageHeight: badgeLocale === 'en' ? 71.43 : 62.5 },
    { id: 'harmony', name: 'HarmonyOS NEXT', badge: 'harmonyos-next-badge.webp', url: links.appGallery, imageHeight: 26 },
  ]
}
