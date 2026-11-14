import metadata from './locales.json'
import copy from './copy.json'

export type LocaleKey = keyof typeof metadata
export type ScreenshotKey = 'home' | 'hitzones' | 'weapon' | 'builder' | 'saved'
export type ScreenshotLanguage = 'en' | 'ja' | 'zh-Hans' | 'zh-Hant' | 'fr' | 'de' | 'it' | 'ko' | 'es' | 'es-419' | 'pt-BR' | 'pl' | 'ru' | 'ar'
export type LocaleDefinition = {
  brand: string; label: string; lang: string; path: string; dir: 'ltr' | 'rtl'
  screenshotLanguage: ScreenshotLanguage; badgeLocale: string
  privacy: string; support: string; description: string; nav: readonly string[]
  contents: string; top: string; appearance: string; menu: string; languageMenuLabel: string
  search: { label: string; clear: string; close: string; noResults: string; details: string; select: string; navigate: string }
  chrome: { skip: string; dark: string; light: string; notFound: string; notFoundBody: string; home: string }
  payment: { alipay: string; wechat: string; qr: string; save: string }
}
type Feature = { tab: string; title: string; body: string; image: ScreenshotKey; alt: string }
export type Copy = {
  title: string; intro: string; coverage: string; explore: string;
  featureHeading: string; featureIntro: string;
  sectionTitle: string; previousFeature: string; nextFeature: string; features: Feature[];
  downloadTitle: string; soon: string; openStore: string; storeDetails: [string, string, string];
  footer: string; support: string; privacy: string;
}
export const locales = metadata as Record<LocaleKey, LocaleDefinition>
export const translations = copy as Record<LocaleKey, Copy>
