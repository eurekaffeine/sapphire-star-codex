<script setup lang="ts">
// Responsive story adapted from Pocket Gallery's MIT-licensed landing scaffold.
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

type StoryFeature = {
  id: string
  tab: string
  title: string
  body: string
  alt: string
  src: string
  width: number
  height: number
  language: string
}
const props = defineProps<{
  features: StoryFeature[]
  label: string
  previousLabel: string
  nextLabel: string
}>()
const activeFeature = ref(0)
const mobile = ref(false)
const chaptersElement = ref<HTMLElement | null>(null)
const chapterElements = ref<HTMLElement[]>([])
const dotElements = ref<HTMLButtonElement[]>([])
let mediaQuery: MediaQueryList | undefined
let observer: IntersectionObserver | undefined
let scrollFrame = 0
let swipeStart: { id: number; x: number; y: number } | undefined

function updateDesktopSelection() {
  scrollFrame = 0
  if (mobile.value) return
  const focusLine = window.innerHeight * 0.55
  let closest = 0
  let distance = Infinity
  chapterElements.value.forEach((chapter, index) => {
    const bounds = chapter.getBoundingClientRect()
    const candidate = Math.abs(bounds.top + bounds.height / 2 - focusLine)
    if (candidate < distance) {
      closest = index
      distance = candidate
    }
  })
  activeFeature.value = closest
}

function handlePageScroll() {
  if (!mobile.value && !scrollFrame) scrollFrame = requestAnimationFrame(updateDesktopSelection)
}

function observeChapters() {
  observer?.disconnect()
  if (!mobile.value || !chaptersElement.value) return
  observer = new IntersectionObserver(entries => {
    const visible = entries.filter(entry => entry.isIntersecting && entry.intersectionRatio >= 0.6)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
    if (visible) activeFeature.value = Number((visible.target as HTMLElement).dataset.featureIndex)
  }, { root: chaptersElement.value, threshold: [0.6] })
  chapterElements.value.forEach(chapter => observer?.observe(chapter))
}

function scrollToChapter(index: number, behavior: ScrollBehavior) {
  const chapter = chapterElements.value[index]
  if (chapter) chaptersElement.value?.scrollTo({ left: chapter.offsetLeft, behavior })
}

function selectFeature(index: number) {
  const next = Math.max(0, Math.min(index, props.features.length - 1))
  activeFeature.value = next
  if (mobile.value) {
    scrollToChapter(next, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth')
  } else {
    chapterElements.value[next]?.scrollIntoView({ block: 'center', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
  }
}

function handleKeys(event: KeyboardEvent) {
  const last = props.features.length - 1
  const next = event.key === 'ArrowRight' || (!mobile.value && event.key === 'ArrowDown')
  const previous = event.key === 'ArrowLeft' || (!mobile.value && event.key === 'ArrowUp')
  const target = next ? Math.min(last, activeFeature.value + 1)
    : previous ? Math.max(0, activeFeature.value - 1)
    : event.key === 'Home' ? 0
    : event.key === 'End' ? last
    : undefined
  if (target === undefined) return
  event.preventDefault()
  selectFeature(target)
  void nextTick(() => {
    const targetElement = mobile.value ? dotElements.value[target] : chapterElements.value[target]
    targetElement?.focus({ preventScroll: true })
  })
}

async function handleLayoutChange() {
  mobile.value = mediaQuery?.matches ?? false
  await nextTick()
  observeChapters()
  if (mobile.value) scrollToChapter(activeFeature.value, 'instant')
  else updateDesktopSelection()
}

function startSwipe(event: PointerEvent) {
  if (!mobile.value || !event.isPrimary || event.pointerType === 'mouse') return
  swipeStart = { id: event.pointerId, x: event.clientX, y: event.clientY }
  const phone = event.currentTarget as HTMLElement
  phone.setPointerCapture(event.pointerId)
}

function finishSwipe(event: PointerEvent) {
  const start = swipeStart
  swipeStart = undefined
  if (!start || start.id !== event.pointerId) return
  const x = event.clientX - start.x
  const y = event.clientY - start.y
  if (Math.abs(x) >= 48 && Math.abs(x) > Math.abs(y) * 1.4) selectFeature(activeFeature.value + (x < 0 ? 1 : -1))
}

onMounted(() => {
  mediaQuery = window.matchMedia('(max-width: 1024px)')
  mediaQuery.addEventListener('change', handleLayoutChange)
  window.addEventListener('scroll', handlePageScroll, { passive: true })
  window.addEventListener('resize', handlePageScroll)
  void handleLayoutChange()
})
onBeforeUnmount(() => {
  observer?.disconnect()
  mediaQuery?.removeEventListener('change', handleLayoutChange)
  window.removeEventListener('scroll', handlePageScroll)
  window.removeEventListener('resize', handlePageScroll)
  if (scrollFrame) cancelAnimationFrame(scrollFrame)
})
</script>

<template>
  <section class="ssc-story ssc-shell" :aria-label="label" :data-active-feature="features[activeFeature].id">
    <div class="ssc-phone-column">
      <figure class="ssc-phone" @pointerdown="startSwipe" @pointerup="finishSwipe" @pointercancel="swipeStart = undefined">
        <img v-for="(feature, index) in features" v-show="activeFeature === index" :key="feature.id"
          :src="feature.src" :alt="feature.alt" :width="feature.width" :height="feature.height"
          :data-feature-image="feature.id" :data-screenshot-language="feature.language"
          data-device-frame="iPhone 18 Pro" :draggable="false" decoding="async" loading="eager">
      </figure>
    </div>
    <div id="feature-chapters" ref="chaptersElement" class="ssc-chapters" :aria-label="label" @keydown="handleKeys">
      <article v-for="(feature, index) in features" :id="`feature-chapter-${feature.id}`" :key="feature.id"
        ref="chapterElements" :data-feature-index="index" :class="{ active: activeFeature === index }"
        :tabindex="!mobile || activeFeature === index ? 0 : -1" :aria-hidden="mobile && activeFeature !== index ? true : undefined"
        :aria-labelledby="`feature-title-${feature.id}`" @focusin="activeFeature = index">
        <span class="ssc-chapter-number" aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span>
        <h3 :id="`feature-title-${feature.id}`">{{ feature.title }}</h3>
        <p>{{ feature.body }}</p>
      </article>
    </div>
    <div class="ssc-carousel-controls" role="group" :aria-label="label" @keydown="handleKeys">
      <button type="button" class="ssc-carousel-arrow" :disabled="activeFeature === 0" :aria-label="previousLabel"
        aria-controls="feature-chapters" @click="selectFeature(activeFeature - 1)">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m14 6-6 6 6 6" /></svg>
      </button>
      <div class="ssc-carousel-dots">
        <button v-for="(feature, index) in features" :key="feature.id" ref="dotElements" type="button"
          :aria-label="feature.tab" :aria-current="activeFeature === index ? 'true' : undefined"
          :aria-controls="`feature-chapter-${feature.id}`" @click="selectFeature(index)"><span /></button>
      </div>
      <button type="button" class="ssc-carousel-arrow" :disabled="activeFeature === features.length - 1" :aria-label="nextLabel"
        aria-controls="feature-chapters" @click="selectFeature(activeFeature + 1)">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m10 6 6 6-6 6" /></svg>
      </button>
    </div>
  </section>
</template>
