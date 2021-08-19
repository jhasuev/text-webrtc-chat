<template>
  <div class="chat">
    <div class="d-flex justify-content-between mb-2">
      <span v-if="isConnected">Диалог с собеседником</span>
      <span v-else class="chat__console">{{ states[currentState] }}</span>
      <button class="btn-close ms-3" aria-label="Close" title="Завершить диалог" @click="leave"></button>
    </div>

    <messages
      class="chat__messages"
      :messages=messages
    />

    <chat-footer
      v-if="isConnected"
      @send-message=onSendMessage
    />
  </div>
</template>

<script>
import Messages from "@/components/Messages"
import ChatFooter from "@/components/ChatFooter"

import socket from "@/socket/"
import ACTIONS from "@/socket/actions"
import freeice from "freeice"
import STATES from "@/assets/json/connecting-states"

import { mapGetters } from "vuex";

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
      messages: [],
      states: STATES,
      currentState: '',
    }
  },
  computed: {
    ...mapGetters([ 'getSocket', 'mustCreateOffer' ]),

    isConnected() {
      return this.currentState === 'onopen'
    },
  },
  mounted() {
    if (!this.getSocket) return this.$router.push({ name: "home" })

    socket.on(ACTIONS.STOP_DISCUSSION, () => {
      this.$router.push({ name: "home", query: { state: 'companion-disconnected' } })
    })

    this.start()
  },
  methods: {
    leave() {
      socket.emit(ACTIONS.STOP_DISCUSSION)
      this.$router.push({ name: "home" })
    },

    async start() {
      this.initConnection()

      if (this.mustCreateOffer) {
        this.createChannel()

        // создание оффера
        this.currentState = 'offerCreating'
        const offer = await this.peerConnection.createOffer()
        this.peerConnection.setLocalDescription(offer)

        // отправки оффера
        this.currentState = 'offerSending'
        socket.emit(ACTIONS.RELAY_SDP, offer)

        // ожидания ответа
        socket.on(ACTIONS.RELAY_SDP, async answer => {
          this.currentState = 'answerGetting'
          // установки ответа
          await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer))

          socket.on(ACTIONS.RELAY_ICE, async ice => {
            this.currentState = 'iceGetting'
            await this.peerConnection.addIceCandidate(new RTCIceCandidate(ice))
          })
        })
      } else {
        this.onDataChannel()
        // ожидания оффера
        this.currentState = 'waitingForOffer'
        socket.on(ACTIONS.RELAY_SDP, async offer => {
          this.currentState = 'offerGetting'

          // установки оффера
          this.currentState = 'offerSetting'
          await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer))

          // создания ответа
          this.currentState = 'answerCreating'
          const answer = await this.peerConnection.createAnswer()
          this.peerConnection.setLocalDescription(answer)

          // отправка ответа
          this.currentState = 'answerSending'
          socket.emit(ACTIONS.RELAY_SDP, answer)

          socket.on(ACTIONS.RELAY_ICE, async ice => {
            this.currentState = 'iceGetting'
            await this.peerConnection.addIceCandidate(new RTCIceCandidate(ice))
          })
        })
      }

      // попытка переустановить связь
      setTimeout(() => !this.isConnected && this.reconnect(), 5000);
    },

    close() {
      if (this.peerConnection) {
        this.peerConnection.close()
        this.peerConnection.onicecandidate = null
      }
    },

    reconnect() {
      this.currentState = "reconnecting"
      this.close()
      this.start()
    },

    initConnection() {
      this.currentState = 'init'
      this.peerConnection = new RTCPeerConnection({ iceServers: freeice() })
      this.peerConnection.onicecandidate = (e) => {
        socket.emit(ACTIONS.RELAY_ICE, e.candidate)
      }
    },

    createChannel() {
      this.currentState = 'channelCreating'
      this.dataChannel = this.peerConnection.createDataChannel("chat")
      this.initChannelEvents()
    },

    onDataChannel() {
      this.peerConnection.ondatachannel = event => {
        this.currentState = 'ondatachannel'
        this.dataChannel = event.channel
        this.initChannelEvents()
      }
    },

    initChannelEvents() {
      this.dataChannel.onopen = () => this.onOpen()
      this.dataChannel.onmessage = e => this.onReceiveData(e)
    },

    onOpen() {
      this.currentState = 'onopen'
      this.send(this.createMessage("Беседа началась!"))
    },

    onReceiveData(e) {
      const data = JSON.parse(e.data)
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

    setCompanionReceived(id) {
      const message = this.messages.find(msg => msg.id == id)
      if (message) {
        message.sent = true
      }
    },

    onSendMessage(text) {
      const message = this.createMessage(text)
      this.send(message)
      this.addMessage({ ...message, myself: true})
    },

    send(data) {
      this.dataChannel.send(JSON.stringify(data))
    },

    addMessage(message){
      this.messages.push({ ...message, time: Date.now() })
    },

    createMessage(text) {
      return {
        text,
        id: this.getMessageId(),
        type: "message",
        time: Date.now(),
        sent: false,
      }
    },

    getMessageId() {
      // return randomize key like: a0f23c914d0e00
      return (Date.now() + +String(Math.random()).split(".").pop()).toString(16)
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
