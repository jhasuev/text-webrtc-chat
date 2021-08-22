<template>
  <div class="text-center">
    <div v-if="canShowCompanionDisconnected" class="mb-4">
      <h5 class="mb-1">Собеседник отсоединился</h5>
      Попробуйте пообщаться с кем-то другим.
    </div>
    
    <button class="btn btn-primary" @click="start">Найти собеседника</button>
    <div class="total mt-2">
      Всего общаются: <b>{{ total }}</b>
    </div>
  </div>
</template>

<script>
import socket from "@/socket/"
import ACTIONS from "@/socket/actions"
export default {
  name: "Home",
  data(){
    return {
      total: 0,
    }
  },
  computed: {
    canShowCompanionDisconnected() {
      return this.$route.query?.state === 'companion-disconnected'
    },
  },
  mounted(){
    this.setTitle("Главная")

    socket.on(ACTIONS.RELAY_TOTAL, total => {
      this.total = total
    })

    socket.emit(ACTIONS.RELAY_TOTAL)
  },
  methods: {
    start() {
      this.$router.push({ name: "search" })
    },
  },
}
</script>
