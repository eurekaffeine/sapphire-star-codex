<script setup lang="ts">
import { withBase } from 'vitepress'
import manifest from '../../../public/support/manifest.json'

const labels = { alipay: '支付宝', wechat: '微信支付', qr: '收款二维码', save: '保存二维码' }
const payments = manifest.assets.map(asset => ({
  ...asset,
  label: asset.provider === 'alipay' ? labels.alipay : labels.wechat,
  src: withBase(`/support/${asset.file}`),
}))
</script>

<template>
  <div class="ssc-support-payments">
    <figure v-for="payment in payments" :key="payment.provider" class="ssc-support-payment" :data-payment="payment.provider">
      <figcaption><h2>{{ payment.label }}</h2></figcaption>
      <img :src="payment.src" :width="payment.width" :height="payment.height" :alt="`${payment.label} ${labels.qr}`" decoding="async">
      <a :href="payment.src" :download="payment.file" class="ssc-support-save" :aria-label="`${payment.label}: ${labels.save}`">{{ labels.save }}</a>
    </figure>
  </div>
</template>

<style scoped>
.ssc-support-payments { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 32px; margin-block: 32px; }
.ssc-support-payment { display: flex; flex-direction: column; min-width: 0; margin: 0; }
.ssc-support-payment h2 { margin: 0 0 16px; padding: 0; border: 0; }
.ssc-support-payment img { display: block; width: 100%; max-width: 300px; height: auto; }
.ssc-support-save { display: flex; align-items: center; align-self: flex-start; min-height: 44px; margin-top: auto; padding-block: 12px; }
@media (max-width: 600px) {
  .ssc-support-payments { grid-template-columns: minmax(0, 1fr); }
}
</style>
