import { createStore } from "vuex"

const store = createStore({
  state: {
    selfInfo: {
      socket: "",
      mustCreateOffer: false,
    },
  },
  getters: {
    getSocket: state => state.selfInfo.socket,
    mustCreateOffer: state => state.selfInfo.mustCreateOffer,
  },
  mutations: {
    SET_SELF_INFO(state, payload) {
      state.selfInfo.socket = payload.socket
      state.selfInfo.mustCreateOffer = payload.mustCreateOffer
    },
  },
  actions: {
    setSelfInfo({commit}, payload) {
      commit("SET_SELF_INFO", payload)
    },
  },
})

export default store