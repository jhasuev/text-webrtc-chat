<template>
  <div class="text-center">
    <h4 class="mb-3">Поиск собеседника</h4>
    <div class="mb-4">
      <div class="spinner-border text-secondary" role="status"></div>
    </div>
    <button class="btn btn-primary" @click="stop">Остановить поиск</button>
  </div>
</template>

<script>
import socket from "@/socket/"
import ACTIONS from "@/socket/actions"
import { mapActions } from "vuex"

export default {
  name: "Search",
  data() {
    return {
      socket,
      ACTIONS,
    }
  },
  mounted() {
    socket.emit(ACTIONS.START_SEARCHING)

    socket.on(ACTIONS.START_DISCUSSION, data => {
      // тут будет хранится данные о текущем пользователя (не собеседник) { socket, mustCreateOffer }
      this.setSelfInfo(data)

      this.$router.push({ name: "chat" })
    })

    socket.on(ACTIONS.STOP_SEARCHING, () => {
      this.$router.push({ name: "home" })
    })
  },
  methods: {
    ...mapActions([ 'setSelfInfo' ]),

    stop() {
      socket.emit(ACTIONS.STOP_SEARCHING)
    },
  },
}
</script>
