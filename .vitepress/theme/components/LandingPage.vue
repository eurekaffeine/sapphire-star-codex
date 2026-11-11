<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { withBase } from 'vitepress'
import { locale, copy, type ScreenshotKey } from '../content'
import screenshotManifest from '../../../public/screenshots/manifest.json'
import BenefitIcon from './BenefitIcon.vue'
import ChinaRegistration from './ChinaRegistration.vue'
import { storeBadges } from '../stores'

const screenshotLanguage = 'zh-Hans'
const activeFeature = ref(0)
const tabElements = ref<HTMLButtonElement[]>([])
const tabList = ref<HTMLElement | null>(null)
const stores = storeBadges()
let tabResizeObserver: ResizeObserver | undefined
let swipeStart: { id: number; x: number; y: number } | undefined

function capture(image: ScreenshotKey) {
  const entry = screenshotManifest.locales[screenshotLanguage][image]
  return {
    src: withBase(`/screenshots/${entry.asset}`),
    height: entry.height,
    language: entry.language,
    deviceFrame: entry.deviceFrame,
  }
}

function revealSelectedTab() {
  const list = tabList.value
  const tab = tabElements.value[activeFeature.value]
  if (!list || !tab) return
  const left = tab.offsetLeft
  const right = left + tab.offsetWidth
  if (left < list.scrollLeft + 4) list.scrollLeft = Math.max(0, left - 4)
  else if (right > list.scrollLeft + list.clientWidth - 4) list.scrollLeft = right - list.clientWidth + 4
}

function selectFeature(index: number) {
  activeFeature.value = Math.max(0, Math.min(index, copy.features.length - 1))
  void nextTick(revealSelectedTab)
}

function moveTab(event: KeyboardEvent, index: number) {
  const last = copy.features.length - 1
  const target = event.key === 'ArrowRight' ? (index + 1) % (last + 1)
    : event.key === 'ArrowLeft' ? (index + last) % (last + 1)
    : event.key === 'Home' ? 0
    : event.key === 'End' ? last
    : undefined
  if (target === undefined) return
  event.preventDefault()
  selectFeature(target)
  tabElements.value[target]?.focus({ preventScroll: true })
}

function startSwipe(event: PointerEvent) {
  if (!event.isPrimary || event.pointerType === 'mouse') return
  swipeStart = { id: event.pointerId, x: event.clientX, y: event.clientY }
  const phone = event.currentTarget as HTMLElement
  phone.setPointerCapture(event.pointerId)
}

function finishSwipe(event: PointerEvent) {
  const start = swipeStart
  swipeStart = undefined
  if (!start || start.id !== event.pointerId) return
  const horizontal = event.clientX - start.x
  const vertical = event.clientY - start.y
  if (Math.abs(horizontal) >= 48 && Math.abs(horizontal) > Math.abs(vertical) * 1.4) {
    selectFeature(activeFeature.value + (horizontal < 0 ? 1 : -1))
  }
}

onMounted(() => {
  tabResizeObserver = new ResizeObserver(revealSelectedTab)
  if (tabList.value) tabResizeObserver.observe(tabList.value)
})
onBeforeUnmount(() => { tabResizeObserver?.disconnect() })
</script>

<template>
  <div class="ssc-site">
    <main>
      <section class="ssc-hero ssc-shell">
        <div class="ssc-hero-copy">
          <h1>{{ copy.title }}</h1>
          <p>{{ copy.intro }}</p>
          <p class="ssc-secondary">{{ copy.coverage }}</p>
          <div class="ssc-actions">
            <a class="ssc-button" href="#features">{{ copy.explore }}</a>
            <a class="ssc-button secondary" href="#download">{{ locale.nav[3] }}</a>
          </div>
        </div>
        <div class="ssc-hero-visual">
          <div class="ssc-hero-device device-left">
            <img :src="capture('weapon').src" :alt="copy.features[2].alt" width="660" :height="capture('weapon').height" :data-screenshot-language="screenshotLanguage" data-device-frame="iPhone 18 Pro">
          </div>
          <div class="ssc-hero-device device-right">
            <img :src="capture('builder').src" :alt="copy.features[3].alt" width="660" :height="capture('builder').height" :data-screenshot-language="screenshotLanguage" data-device-frame="iPhone 18 Pro">
          </div>
          <div class="ssc-hero-device device-center">
            <img :src="capture('hitzones').src" :alt="copy.features[1].alt" width="660" :height="capture('hitzones').height" :data-screenshot-language="screenshotLanguage" data-device-frame="iPhone 18 Pro" fetchpriority="high">
          </div>
        </div>
      </section>

      <section id="features" class="ssc-features ssc-shell" :aria-label="copy.sectionTitle">
        <div class="ssc-feature-header">
          <h2>{{ copy.sectionTitle }}</h2>
          <div ref="tabList" class="ssc-feature-tabs" role="tablist" :aria-label="copy.sectionTitle">
            <button v-for="(feature, index) in copy.features" :id="`feature-tab-${feature.image}`"
              :key="feature.image" ref="tabElements" role="tab" type="button"
              :aria-controls="`feature-panel-${feature.image}`" :aria-selected="activeFeature === index"
              :tabindex="activeFeature === index ? 0 : -1"
              @click="selectFeature(index)" @keydown="moveTab($event, index)">
              {{ feature.tab }}
            </button>
          </div>
        </div>
        <div class="ssc-feature-stage">
          <p class="visually-hidden" role="status">{{ copy.features[activeFeature].title }}</p>
          <div v-for="(feature, index) in copy.features" :id="`feature-panel-${feature.image}`"
            :key="feature.image" role="tabpanel" :aria-labelledby="`feature-tab-${feature.image}`"
            :hidden="activeFeature !== index" tabindex="0" class="ssc-feature-panel">
            <figure class="ssc-feature-media">
              <div class="ssc-phone" @pointerdown="startSwipe" @pointerup="finishSwipe" @pointercancel="swipeStart = undefined">
                <!-- Eagerly cache this locale's five images so selection never starts a cold image request. -->
                <img :src="capture(feature.image).src" :alt="feature.alt" width="660" :draggable="false"
                  :height="capture(feature.image).height" :data-screenshot-language="screenshotLanguage"
                  data-device-frame="iPhone 18 Pro" loading="eager" decoding="async" :fetchpriority="activeFeature === index ? 'auto' : 'low'">
              </div>
            </figure>
            <div class="ssc-feature-copy"><h3>{{ feature.title }}</h3><p>{{ feature.body }}</p></div>
          </div>
          <div class="ssc-gallery-controls">
            <button type="button" :aria-label="copy.previousFeature" :disabled="activeFeature === 0"
              :aria-controls="`feature-panel-${copy.features[activeFeature].image}`" @click="selectFeature(activeFeature - 1)">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m14 6-6 6 6 6" /></svg>
            </button>
            <button type="button" :aria-label="copy.nextFeature" :disabled="activeFeature === copy.features.length - 1"
              :aria-controls="`feature-panel-${copy.features[activeFeature].image}`" @click="selectFeature(activeFeature + 1)">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m10 6 6 6-6 6" /></svg>
            </button>
          </div>
        </div>
        <ul id="benefits" class="ssc-facts">
          <li v-for="fact in copy.facts" :key="fact.id" class="ssc-fact-card">
            <BenefitIcon :name="fact.id" class="ssc-fact-icon" />
            <div class="ssc-fact-copy">
              <h3>{{ fact.title }}</h3>
              <p>{{ fact.body }}</p>
            </div>
          </li>
        </ul>
      </section>

      <section id="download" class="ssc-download ssc-shell">
        <h2>{{ copy.downloadTitle }}</h2>
        <ul class="ssc-stores"><li v-for="(store, index) in stores" :key="store.id" :data-store="store.id">
          <div class="ssc-store-info"><h3>{{ store.name }}</h3><p>{{ copy.storeDetails[index] }}</p></div>
          <div class="ssc-store-access">
            <a v-if="store.url" :href="store.url" target="_blank" rel="noopener noreferrer"
              class="ssc-store-badge" :aria-label="`${copy.openStore}: ${store.name}`">
              <img :src="withBase(`/badges/${store.badge}`)" :alt="store.name" :style="{ height: `${store.imageHeight}px` }">
            </a>
            <span v-else-if="store.badge" class="ssc-store-badge pending" role="img" aria-disabled="true" :aria-label="`${store.name}: ${copy.soon}`">
              <img :src="withBase(`/badges/${store.badge}`)" alt="" aria-hidden="true" :style="{ height: `${store.imageHeight}px` }">
            </span>
            <span v-else class="ssc-store-pending">{{ copy.soon }}</span>
          </div>
        </li></ul>
      </section>
    </main>

    <footer class="ssc-footer ssc-shell">
      <div class="ssc-footer-links">
        <a :href="withBase(`${locale.path}others/`)">{{ copy.support }}</a>
        <a :href="withBase(`${locale.path}support/`)">{{ locale.support }}</a>
        <a :href="withBase(`${locale.path}privacy/`)">{{ copy.privacy }}</a>
        <a href="https://www.pocket-gallery.cn/">破壳萌图鉴</a>
        <a href="https://eurekaffeine.github.io/sapphire-star-codex/">国际版网站</a>
      </div>
      <p>{{ copy.footer }}</p>
      <small>© 2026 苍蓝星图鉴</small>
      <ChinaRegistration />
    </footer>
  </div>
</template>
