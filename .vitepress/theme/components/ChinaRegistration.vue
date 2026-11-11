<script setup lang="ts">
import { withBase } from 'vitepress'
</script>

<template>
  <div class="ssc-registration">
    <a href="https://beian.mps.gov.cn/#/query/webSearch?code=32059002005040"
      target="_blank" rel="noopener noreferrer">
      <img :src="withBase('/beian.png')" width="18" height="20" alt="" aria-hidden="true">
      <span>苏公网安备32059002005040号</span>
    </a>
  </div>
</template>

<style scoped>
.ssc-registration { flex-basis: 100%; min-width: 0; }
.ssc-registration a { display: inline-flex; align-items: center; gap: 6px; min-height: 44px; max-width: 100%; color: var(--ssc-muted); font-size: var(--ssc-small); line-height: 1.7; text-decoration: none; }
.ssc-registration img { flex-shrink: 0; width: 18px; height: 20px; }
.ssc-registration span { min-width: 0; overflow-wrap: anywhere; }
.ssc-registration a:hover { color: var(--ssc-accent); text-decoration: underline; text-underline-offset: 4px; }
.ssc-registration a:focus-visible { outline: 2px solid var(--ssc-accent); outline-offset: 4px; }
</style>
