<script setup lang="ts">
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'
import manifest from '../../../public/support/manifest.json'

const { lang } = useData()
const labels = computed(() => {
  if (lang.value === 'zh-Hans') return { alipay: '支付宝', wechat: '微信支付', qr: '收款二维码', save: '保存二维码' }
  if (lang.value === 'zh-Hant') return { alipay: '支付寶', wechat: '微信支付', qr: '收款 QR Code', save: '儲存 QR Code' }
  if (lang.value.startsWith('ja')) return { alipay: 'Alipay', wechat: 'WeChat Pay', qr: '支援用QRコード', save: 'QRコードを保存' }
  return { alipay: 'Alipay', wechat: 'WeChat Pay', qr: 'payment QR code', save: 'Save QR code' }
})
const payments = computed(() => manifest.assets.map(asset => ({
  ...asset,
  label: asset.provider === 'alipay' ? labels.value.alipay : labels.value.wechat,
  src: withBase(`/support/${asset.file}`),
})))
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
