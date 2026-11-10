import links from './store-links.json'

export function storeBadges() {
  return [
    { id: 'apple', name: 'App Store', badge: 'app-store-badge-zh-hans.svg', url: links.appStore, imageHeight: 48 },
    // No verified mainland Android listing yet. Do not send visitors to the
    // global Play store or reuse another app's domestic listing.
    { id: 'android', name: 'Android 国内版', badge: null, url: links.androidChina, imageHeight: 48 },
    // Pocket Gallery has no Chinese AppGallery artwork; retain its official badge.
    { id: 'harmony', name: '华为应用市场', badge: 'app-gallery-badge-en.png', url: links.appGallery, imageHeight: 48 },
  ]
}
