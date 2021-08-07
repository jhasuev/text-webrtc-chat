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
  mounted() {
    socket.on(ACTIONS.STOP_DISCUSSION, () => {
      this.$router.push({ name: "home" })
    })
  },
  methods: {
    leave() {
      socket.emit(ACTIONS.STOP_DISCUSSION)
      this.$router.push({ name: "home" })
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
