<script setup lang="ts">
import { locale, copy } from '../content'
import { storeBadges } from '../stores'
import LandingScaffold from './LandingScaffold.vue'
import ChinaRegistration from './ChinaRegistration.vue'

const relatedLinks = [
  { label: '破壳萌图鉴', url: 'https://www.pocket-gallery.cn/' },
  { label: '国际版网站', url: 'https://eurekaffeine.github.io/sapphire-star-codex/' },
]
</script>

<template>
  <LandingScaffold :copy="copy" :locale="locale" language="zh-Hans" :stores="storeBadges()" :related-links="relatedLinks">
    <template #registration><ChinaRegistration /></template>
  </LandingScaffold>
</template>
