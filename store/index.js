export const state = () => ({
  avatar: '/images/avatars/a-01.png',
})

export const mutations = {
  SET_AVATAR(state, url) {
    state.avatar = url
  }
}
export const actions = {
  async nuxtServerInit({ dispatch }, { error }) {
    try {
      await Promise.all([
        dispatch('initAvatar'),
      ])
    } catch (err) {
      const statusCode = (err.response || {}).status || err.status || 503
      const message =
          (((err.response || {}).data || {}).error || {}).message ||
          err.message ||
          'เรากำลังปรับปรุงเพื่อสิ่งที่ดีกว่า และเราจะกลับมาในไม่ช้า'
      error({ message, statusCode })
    }
  },
  initAvatar({ commit }) {
    try {
      const avatar = window.localStorage.getItem('user:avatar')
      if (!avatar) {
        const num = Math.floor(Math.random() * 9) + 1
        const url = '/images/avatars/a-0' + num + '.png'
        commit('SET_AVATAR', url)
      } else {
        commit('SET_AVATAR', avatar)
      }
    } catch (error) {}
  }
}
