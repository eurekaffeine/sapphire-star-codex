<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'
import { locales } from './content'
import LandingPage from './components/LandingPage.vue'

const { frontmatter, lang, page } = useData()
const locale = computed(() => Object.values(locales).find(item => item.lang === lang.value) ?? locales.root)
</script>

<template>
  <DefaultTheme.Layout>
    <template v-if="frontmatter.pageClass === 'ssc-landing-page'" #page-top>
      <LandingPage />
    </template>
    <template #doc-after>
      <footer class="ssc-document-policy">
        <a v-if="!page.relativePath.endsWith('support/index.md')" :href="withBase(`${locale.path}support/`)">{{ locale.support }}</a>
        <a v-if="!page.relativePath.endsWith('privacy/index.md')" :href="withBase(`${locale.path}privacy/`)">{{ locale.privacy }}</a>
      </footer>
    </template>
  </DefaultTheme.Layout>
</template>
