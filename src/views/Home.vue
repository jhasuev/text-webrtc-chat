<template>
  <div class="text-center">
    <div class="total mb-2">
      Всего общаются: <b>{{ total }}</b>
    </div>
    <button class="btn btn-primary" @click="start">Найти собеседника</button>
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
  methods: {
    start() {
      this.$router.push({ name: "search" })
    },
  },
  mounted(){
    socket.on(ACTIONS.RELAY_TOTAL, total => {
      this.total = total
    })

    socket.emit(ACTIONS.RELAY_TOTAL)
  },
}
</script>
