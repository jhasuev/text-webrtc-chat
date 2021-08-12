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

import WebRTC  from "@/WebRTC"

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
      WebRTC,
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

    this.sharingCandidates()
  },
  methods: {
    leave() {
      socket.emit(ACTIONS.STOP_DISCUSSION)
      this.$router.push({ name: "home" })
    },

    async sharingCandidates() {
      if (this.getSocket) {
        this.WebRTC = new WebRTC()
        if (this.mustCreateOffer) {
          // создание оффера
          const offer = await this.WebRTC.createOffer()

          console.log("MY OFFER >> ", offer);

          // отправки оффера
          socket.emit(ACTIONS.RELAY_SDP, offer)

          // ожидания ответа
          socket.on(ACTIONS.RELAY_SDP, async answer => {
            if(answer.type != 'answer') return null
            console.log("ANSWER FROM COMPANION >> ", answer);
            // установки ответа
            await this.WebRTC.setRemoteSdp(answer)
            // ожидания установки соединения
          })
        } else {
          // ожидания оффера
          socket.on(ACTIONS.RELAY_SDP, async offer => {
            if(offer.type != 'offer') return null
            console.log("OFFER FROM COMPANION >>> ", offer);

            // установки оффера
            await this.WebRTC.setRemoteSdp(offer)

            // создания ответа
            const answer = await this.WebRTC.createAnswer()
            console.log("MY ANSWER >> ", answer);

            // отправки ответа
            socket.emit(ACTIONS.RELAY_SDP, answer)
            // ожидания установки соединения
          })
        }
      }


      // this.WebRTC.sendMessage(1234567)
      console.log(this.mustCreateOffer, this.getSocket);

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
