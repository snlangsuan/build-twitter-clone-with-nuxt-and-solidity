export const state = () => ({
  web3: {
    connected: false,
    chainId: -1,
    address: null,
  }
})

export const mutations = {
  REGISTER_WEB3(state, payload = {}) {
    state.web3.connected = !!payload.chainId && !!payload.address
    state.web3.chainId = payload.chainId
    state.web3.address = payload.address
  }
}
