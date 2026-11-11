<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import { locales, translations, type LocaleKey } from '../content'
import { storeBadges } from '../stores'
import LandingScaffold from './LandingScaffold.vue'

const { lang } = useData()
const localeKey = computed<LocaleKey>(() => {
  if (lang.value === 'zh-Hans') return 'zh-hans'
  if (lang.value === 'zh-Hant') return 'zh-hant'
  if (lang.value.startsWith('ja')) return 'ja-jp'
  return 'root'
})
const language = computed(() => ({ root: 'en', 'zh-hans': 'zh-Hans', 'zh-hant': 'zh-Hant', 'ja-jp': 'ja' } as const)[localeKey.value])
const relatedLinks = [{ label: 'Pocket Gallery', url: 'https://eurekaffeine.github.io/pocket-gallery/' }]
</script>

<template>
  <LandingScaffold :copy="translations[localeKey]" :locale="locales[localeKey]" :language="language"
    :stores="storeBadges(localeKey)" :related-links="relatedLinks" />
</template>
