import { createStore } from "vuex"

const store = createStore({
  state: {
    selfInfo: {
      socket: "",
      makeOffer: false,
    },
  },
  getters: {
    getSocket: state => state.selfInfo.socket,
    makeOffer: state => state.selfInfo.makeOffer,
  },
  mutations: {
    SET_SELF_INFO(state, payload) {
      state.selfInfo.socket = payload.socket
      state.selfInfo.makeOffer = payload.makeOffer
    },
  },
  actions: {
    setSelfInfo({commit}, payload) {
      commit("SET_SELF_INFO", payload)
    },
  },
})

export default store