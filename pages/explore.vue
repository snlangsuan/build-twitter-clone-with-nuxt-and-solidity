<template>
  <div class="twitter-item__wrap">
    <div class="twitter-item__main twitter-item__main--border">
      <div class="twitter-item__bar">
          <v-text-field prepend-inner-icon="mdi-magnify" placeholder="ค้นหาทวิตเตอร์" single-line full-width dense rounded filled hide-details />
      </div>
      <div class="twitter-item__content" style="height: 100%">
        <div class="mt-6 text-center text-h3 grey--text text--lighten-3">Coming Soon</div>
      </div>
    </div>
    <div class="twitter-item__sidebar">
      <div class="twitter-item__bar">
      </div>
      <div class="twitter-item__content"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ExplorePage',
}
</script>
