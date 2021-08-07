<template>
  <div class="text-center">
    <h4 class="mb-3">Поиск собеседника</h4>
    <div class="mb-4">
      <div class="spinner-border text-secondary" role="status"></div>
    </div>
    <button class="btn btn-primary">Остановить поиск</button>
  </div>
</template>

<script>
import socket from "@/socket/"
import ACTIONS from "@/socket/actions"

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

    socket.on(ACTIONS.START_DISCUSSION, () => {
      this.$router.push({ name: "chat" })
    })
  },
}
</script>
