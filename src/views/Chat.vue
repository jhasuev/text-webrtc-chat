<template>
  <div class="chat">
    <div class="d-flex justify-content-between mb-2">
      
      <span v-if="connected">Диалог с собеседником</span>
      <span v-else class="chat__console">Подключение...</span>

      <button class="btn-close ms-3" aria-label="Close" title="Завершить диалог" @click="leave"></button>
    </div>

    <messages
      class="chat__messages"
      :messages=getCurrentMessages
    />

    <chat-footer
      v-if="connected"
      @send-message=onSendMessage
    />
  </div>
</template>

<script>
import Messages from "@/components/Messages"
import ChatFooter from "@/components/ChatFooter"

import socket from "@/socket/"
import ACTIONS from "@/socket/actions"
import WebRTC from "@/WebRTC"

import { createMessage } from "@/helpers"
import { mapGetters, mapActions } from "vuex"

export default {
  name: "Chat",
  components: {
    Messages,
    ChatFooter,
  },
  data() {
    return {
      socket,
      ACTIONS,
      connected: false,
    }
  },
  computed: {
    ...mapGetters([ 'getSocket', 'makeOffer', 'getCurrentMessages' ]),
  },
  mounted() {
    if (!this.getSocket) return this.$router.push({ name: "home" })

    socket.on(ACTIONS.STOP_DISCUSSION, () => {
      this.$router.push({ name: "home", query: { state: 'companion-disconnected' } })
    })

    this.start()
  },
  methods: {
    ...mapActions([
      'startChatting',
      'pushMessage',
      'setCompanionReceived',
    ]),

    start() {
      this.startChatting()
      this.startWebRTC()
    },

    startWebRTC() {
      this.WebRTC = new WebRTC({
        makeOffer: this.makeOffer,
        onopen: this.onopen,
        onmessage: this.onmessage,
      })
    },

    onopen() {
      console.log("Chat.vue >> onopen");
      this.connected = true
      this.send(createMessage("Беседа началась!"))
    },

    onmessage(data) {
      switch (data.type) {
        case 'message':
          this.addMessage(data)
          this.send({ type: "set-sent", id: data.id })
          break;

        case 'set-sent':
          this.setCompanionReceived(data.id)
          break;
      }
    },

    onSendMessage(text) {
      const message = createMessage(text)
      this.send(message)
      this.addMessage({ ...message, myself: true})
    },

    send(data) {
      this.WebRTC.send(data)
    },
    
    addMessage(message){
      this.pushMessage( message )
    },

    close() {
      if(this.WebRTC) this.WebRTC.close()
    },

    leave() {
      socket.emit(ACTIONS.STOP_DISCUSSION)
      this.close()
      this.$router.push({ name: "home" })
    },
  },

  beforeUnmount() {
    this.close()
  },
}
</script>

<style lang="scss" scoped>

.chat {
  display: flex;
  flex-direction: column;
  height: 100%;

  &__console {
    color: #090;
  }

  &__messages {
    flex-grow: 1;
  }
}

</style>
