import links from './store-links.json'

export function storeBadges() {
  return [
    { id: 'apple', name: 'App Store', badge: 'app-store-badge-zh-hans.svg', url: links.appStore, imageHeight: 48 },
    // No verified mainland Android listing yet. Do not send visitors to the
    // global Play store or reuse another app's domestic listing.
    { id: 'android', name: 'Android 国内版', badge: null, url: links.androidChina, imageHeight: 48 },
    { id: 'harmony', name: 'HarmonyOS NEXT', badge: 'harmonyos-next-badge.webp', url: links.appGallery, imageHeight: 26 },
  ]
}
