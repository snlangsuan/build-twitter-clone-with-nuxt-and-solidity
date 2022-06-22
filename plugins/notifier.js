export default ({ app, store }, inject) => {
  inject('notifier', {
    snackbar(message, type = 'error', timeout = 6000) {
      store.commit('notifier/setStackBar', { message, type, timeout })
    },
    loading(active, options) {
      store.commit('notifier/setLoading', { active, ...options })
    }
  })
}
