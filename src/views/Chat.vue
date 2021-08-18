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

      states: {
        "init": "Инициализируем соединение",
        "offerCreating": "Создание оффера",
        "offerSending": "Отправка оффера",
        "answerGetting": "Получение ответа",
        "iceGetting": "Получение ice кандидата",
        "waitingForOffer": "Ожидания оффера",
        "offerGetting": "Получение оффера",
        "offerSetting": "Установка оффера",
        "answerCreating": "Создание ответа",
        "answerSending": "Отправка ответа",
        "channelCreating": "Создание канала связи",
        "ondatachannel": "Установка канала связи",
        "reconnecting": "Еще одна попытка...",
        "onopen": "Связь установлена",
      },
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
      this.$router.push({ name: "home" })
    })

    this.start()
  },
  methods: {
    leave() {
      socket.emit(ACTIONS.STOP_DISCUSSION)
      this.$router.push({ name: "home" })
    },

    async start() {
      if (this.getSocket) {
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
          console.log("ожидания оффера");
          
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

        setTimeout(() => {
          if (!this.isConnected) {
            this.currentState = "reconnecting"
            this.close()
            this.start()
          }
        }, 5000);
      }
    },

    close() {
      if (this.peerConnection) {
        this.peerConnection.close()
        this.peerConnection.onicecandidate = null
        this.peerConnection.setLocalDescription(null)
        this.peerConnection.setRemoteDescription(null)
      }
    },

    initConnection() {
      this.currentState = 'init'
      this.peerConnection = new RTCPeerConnection({ iceServers: freeice() })
      this.onIceCandidate()
    },

    onIceCandidate() {
      let candidate = null
      this.peerConnection.onicecandidate = (e) => {
        if (e.candidate && !candidate) {
          candidate = e.candidate
          socket.emit(ACTIONS.RELAY_ICE, candidate)
        }
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
      this.dataChannel.onmessage = e => this.onReceiveMessage(e)
    },

    onOpen() {
      this.currentState = 'onopen'
      this.dataChannel.send("Беседа началась!")
    },

    onReceiveMessage(e) {
      console.log(">>>>>>>> MESSAGE !!!!!!!!!!!!!!!!!!!!!", e)
      this.messages.push({ text: e.data, time: Date.now(), myself: false})
    },

    onSendMessage(message) {
      this.dataChannel.send(message)
      this.messages.push({ text: message, time: Date.now(), myself: true})
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
