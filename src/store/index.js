import { createStore } from "vuex"

const store = createStore({
  state: {
    selfInfo: {
      socket: "",
      makeOffer: false,
    },
    messages: [],
  },
  getters: {
    getSocket: state => state.selfInfo.socket,
    makeOffer: state => state.selfInfo.makeOffer,
    getCurrentMessages: state => state.messages?.length && state.messages[state.messages.length - 1] || [],
  },
  mutations: {
    SET_SELF_INFO(state, payload) {
      state.selfInfo.socket = payload.socket
      state.selfInfo.makeOffer = payload.makeOffer
    },

    START_CHATTING(state) {
      console.log(state);
      console.log(state.messages);
      state.messages.push([])
    },

    PUSH_MESSAGE(state, payload) {
      state.messages[state.messages.length - 1].push(payload)
    },

    SET_COMPANION_RECEIVED(state, id) {
      const message = state.messages[state.messages.length - 1].find(msg => msg.id == id)
      if (message) {
        message.sent = true
      }
    },
  },
  actions: {
    setSelfInfo({ commit }, payload) {
      commit("SET_SELF_INFO", payload)
    },

    startChatting({ commit }) {
      commit("START_CHATTING")
    },

    pushMessage({ commit }, message) {
      commit("PUSH_MESSAGE", message)
    },

    setCompanionReceived({ commit }, id) {
      commit("SET_COMPANION_RECEIVED", id)
    }
  },
})

export default store