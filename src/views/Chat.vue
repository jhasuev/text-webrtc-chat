<template>
  <div class="chat">
    <div class="d-flex justify-content-between mb-2">
      <span>Диалог с собеседником</span>
      <button type="button" class="btn-close ms-3" aria-label="Close" title="Завершить диалог"></button>
    </div>

    <messages class="chat__messages" />

    <chat-footer />
  </div>
</template>

<script>
import Messages from "@/components/Messages"
import ChatFooter from "@/components/ChatFooter"
export default {
  name: "Chat",
  components: {
    Messages,
    ChatFooter,
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
