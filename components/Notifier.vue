<template>
  <div>
    <v-snackbar
      v-model="snackbar.active"
      :color="snackbar.type"
      :timeout="snackbar.timeout"
      left
      bottom
    >
      {{ snackbar.message }}
      <template #action="{ attrs }">
        <v-btn dark text v-bind="attrs" @click="snackbar.active = false">
          ปิด
        </v-btn>
      </template>
    </v-snackbar>
    <v-overlay
      :value="loading.active"
      :z-index="9999"
      :opacity="loading.opacity"
    >
      <div class="text-center">
        <v-progress-circular
          indeterminate
          color="primary"
        ></v-progress-circular>
        <small v-if="loading.message">{{ loading.message }}</small>
      </div>
    </v-overlay>
  </div>
</template>

<script>
export default {
  name: 'NotifierComponent',
  data() {
    return {
      loading: { active: false, message: '' },
      snackbar: { active: false, message: '', type: 'error', timeout: 6000 },
      dialog: { active: false, title: '', message: '', color: 'primary' },
    }
  },
  created() {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'notifier/setStackBar') {
        this.snackbar = { ...state.notifier.snackbar }
      } else if (mutation.type === 'notifier/setLoading') {
        this.loading = { ...state.notifier.loading }
      }
    })
  },
}
</script>
