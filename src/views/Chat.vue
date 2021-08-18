<template>
  <div class="chat">
    <div class="d-flex justify-content-between mb-2">
      <span>Диалог с собеседником</span>
      <button class="btn-close ms-3" aria-label="Close" title="Завершить диалог" @click="leave"></button>
    </div>

    <messages class="chat__messages" />

    <chat-footer />
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
    }
  },
  computed: {
    ...mapGetters([ 'getSocket', 'mustCreateOffer' ]),
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
        let myIce = null
        this.peerConnection = new RTCPeerConnection({ iceServers: freeice() })
        this.peerConnection.onicecandidate = (e) => {
          if (e.candidate && !myIce) {
            myIce = e.candidate
            console.log("e.candidate", e.candidate);
            socket.emit(ACTIONS.RELAY_ICE, e.candidate)
          }
        }
        
        this.dataChannel = this.peerConnection.createDataChannel("chat")
        this.dataChannel.onopen = () => alert("Channel opened!")
        this.dataChannel.onmessage = e => console.log(`Message: ${e.data}`)

        if (this.mustCreateOffer) {
          // создание оффера
          const offer = await this.peerConnection.createOffer()
          this.peerConnection.setLocalDescription(offer)

          console.log(offer && "created offer");

          // отправки оффера
          socket.emit(ACTIONS.RELAY_SDP, offer)

          // ожидания ответа
          socket.on(ACTIONS.RELAY_SDP, async answer => {
            console.log("получили ответ: ", answer);
            // установки ответа
            await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer))

            socket.on(ACTIONS.RELAY_ICE, async ice => {
              await this.peerConnection.addIceCandidate(new RTCIceCandidate(ice))
              console.log("companion's ice candidate", ice);
            })
          })
        } else {
          // ожидания оффера
          console.log("ожидания оффера");
          socket.on(ACTIONS.RELAY_SDP, async offer => {
            console.log("получили оффер: ", offer);

            // установки оффера
            await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer))

            // создания ответа
            const answer = await this.peerConnection.createAnswer()
            this.peerConnection.setLocalDescription(answer)
            console.log(answer && "created answer");

            // отправки ответа
            socket.emit(ACTIONS.RELAY_SDP, answer)

            socket.on(ACTIONS.RELAY_ICE, async ice => {
              await this.peerConnection.addIceCandidate(new RTCIceCandidate(ice))
            })
          })
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped>

.chat {
  display: flex;
  flex-direction: column;
  height: 100%;

  &__messages {
    flex-grow: 1;
  }
}

</style>
