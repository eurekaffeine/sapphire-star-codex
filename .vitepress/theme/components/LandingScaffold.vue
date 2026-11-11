<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'
import type { Copy, ScreenshotKey } from '../content'
import manifest from '../../../public/screenshots/manifest.json'
import FeatureStory from './FeatureStory.vue'

type Store = { id: string; name: string; badge: string | null; url: string | null; imageHeight: number }
const props = defineProps<{
  copy: Copy
  locale: { brand: string; path: string; nav: readonly string[]; support: string }
  language: keyof typeof manifest.locales
  stores: Store[]
  relatedLinks: { label: string; url: string }[]
}>()
const capture = (key: ScreenshotKey) => manifest.locales[props.language][key]
const screenshot = (key: ScreenshotKey) => withBase(`/screenshots/${capture(key).asset}`)
const features = computed(() => props.copy.features.map(feature => ({
  ...feature,
  id: feature.image,
  src: screenshot(feature.image),
  width: capture(feature.image).width,
  height: capture(feature.image).height,
  language: props.language,
})))
const hero = [
  { key: 'weapon', position: 'device-left' },
  { key: 'builder', position: 'device-right' },
  { key: 'hitzones', position: 'device-center' },
] as const
</script>

<template>
  <div class="ssc-site">
    <main>
      <section class="ssc-hero">
        <div class="ssc-hero-copy">
          <p class="ssc-eyebrow">{{ copy.coverage }}</p>
          <h1>{{ copy.title }}</h1>
          <p class="ssc-hero-lede">{{ copy.intro }}</p>
          <div class="ssc-actions">
            <a class="ssc-button primary" href="#download">{{ locale.nav[3] }}</a>
            <a class="ssc-button secondary" href="#features">{{ copy.explore }}</a>
          </div>
        </div>
        <div class="ssc-hero-visual">
          <div v-for="device in hero" :key="device.key" class="ssc-hero-device" :class="device.position">
            <img :src="screenshot(device.key)" :alt="copy.features.find(feature => feature.image === device.key)?.alt"
              :width="capture(device.key).width" :height="capture(device.key).height"
              :data-screenshot-language="language" data-device-frame="iPhone 18 Pro"
              :fetchpriority="device.position === 'device-center' ? 'high' : 'auto'">
          </div>
        </div>
      </section>

      <section id="features" class="ssc-feature-intro ssc-shell">
        <p class="ssc-eyebrow">{{ copy.sectionTitle }}</p>
        <h2>{{ copy.featureHeading }}</h2>
        <p>{{ copy.featureIntro }}</p>
      </section>
      <FeatureStory :key="language" :features="features" :label="copy.sectionTitle"
        :previous-label="copy.previousFeature" :next-label="copy.nextFeature" />

      <section id="download" class="ssc-download">
        <div class="ssc-shell">
          <p class="ssc-eyebrow">{{ locale.brand }}</p>
          <h2>{{ copy.downloadTitle }}</h2>
          <ul class="ssc-stores">
            <li v-for="(store, index) in stores" :key="store.id" :data-store="store.id">
              <div class="ssc-store-info visually-hidden"><h3>{{ store.name }}</h3><p>{{ copy.storeDetails[index] }}</p></div>
              <a v-if="store.url" :href="store.url" target="_blank" rel="noopener noreferrer"
                class="ssc-store-badge" :aria-label="`${copy.openStore}: ${store.name}`">
                <span v-if="store.badge === 'harmonyos-next-badge.webp'" class="ssc-harmony-badge">
                  <img :src="withBase(`/badges/${store.badge}`)" :alt="store.name" :style="{ height: `${store.imageHeight}px` }">
                </span>
                <img v-else-if="store.badge" :src="withBase(`/badges/${store.badge}`)" :alt="store.name" :style="{ height: `${store.imageHeight}px` }">
                <span v-else>{{ store.name }}</span>
              </a>
              <span v-else-if="store.badge" class="ssc-store-badge pending" role="img" aria-disabled="true" :aria-label="`${store.name}: ${copy.soon}`">
                <img :src="withBase(`/badges/${store.badge}`)" alt="" aria-hidden="true" :style="{ height: `${store.imageHeight}px` }">
              </span>
              <span v-else class="ssc-store-pending"><strong>{{ store.name }}</strong><span>{{ copy.soon }}</span></span>
            </li>
          </ul>
        </div>
      </section>
    </main>

    <footer class="ssc-footer">
      <div class="ssc-shell">
        <div class="ssc-footer-brand"><img :src="withBase('/icon.png')" alt="" width="34" height="34"><strong>{{ locale.brand }}</strong></div>
        <p>{{ copy.footer }}</p>
        <div class="ssc-footer-links">
          <a :href="withBase(`${locale.path}others/`)">{{ copy.support }}</a>
          <a :href="withBase(`${locale.path}support/`)">{{ locale.support }}</a>
          <a :href="withBase(`${locale.path}privacy/`)">{{ copy.privacy }}</a>
          <a v-for="link in relatedLinks" :key="link.url" :href="link.url">{{ link.label }}</a>
        </div>
        <div class="ssc-footer-meta"><small>© 2026 {{ locale.brand }}</small><slot name="registration" /></div>
      </div>
    </footer>
  </div>
</template>
