<template>
  <div class="home-page main-layout__container">
    <div class="main-layout__main">
      <div class="main-layout__bar pa-4">
        <v-text-field prepend-inner-icon="mdi-magnify" placeholder="ค้นหาทวิตเตอร์" single-line full-width dense rounded filled hide-details />
      </div>
      <div class="pt-12">
        <div class="text-h5 text-center grey--text text--lighten-2">Coming Soon</div>
      </div>
    </div>
    <div class="main-layout__sidebar">
    </div>
  </div>
</template>

<script>
export default {
  name: 'ExplorePage',
}
</script>
