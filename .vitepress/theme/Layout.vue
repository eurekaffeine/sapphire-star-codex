<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { useData, withBase } from 'vitepress'
import { locale } from './content'
import LandingPage from './components/LandingPage.vue'

const { frontmatter, page } = useData()
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
