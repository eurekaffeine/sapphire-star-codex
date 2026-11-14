<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import { locales, translations, type LocaleKey } from '../content'
import { storeBadges } from '../stores'
import LandingScaffold from './LandingScaffold.vue'

const { lang } = useData()
const localeKey = computed<LocaleKey>(() =>
  (Object.entries(locales).find(([, locale]) => locale.lang === lang.value)?.[0] as LocaleKey | undefined) ?? 'root'
)
const language = computed(() => locales[localeKey.value].screenshotLanguage)
const relatedLinks = [{ label: 'Pocket Gallery', url: 'https://eurekaffeine.github.io/pocket-gallery/' }]
</script>

<template>
  <LandingScaffold :copy="translations[localeKey]" :locale="locales[localeKey]" :language="language"
    :stores="storeBadges(localeKey)" :related-links="relatedLinks" />
</template>
