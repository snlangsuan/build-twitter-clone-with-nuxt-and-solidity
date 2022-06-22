export const state = () => ({
  snackbar: { active: false, type: '', message: '', timeout: 6000 },
  loading: { active: false, message: '', opacity: 0.46 },
})

export const mutations = {
  setStackBar(state, payload) {
    state.snackbar = payload
    state.snackbar.active = true
  },
  setLoading(state, payload) {
    if (typeof payload.opacity === 'undefined') payload.opacity = 0.46
    state.loading = payload
  }
}
