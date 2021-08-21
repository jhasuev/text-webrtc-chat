<template>
  <div
    ref=messages
    class="messages"
  >
    <message
      v-for="message, i in messages"
      :key="i"
      class="messages__item"
      :text=message.text
      :myself=message.myself
      :sent=message.sent
      :time=message.time
    />
  </div>
</template>

<script>
import Message from "@/components/Message"
export default {
  name: "Messages",
  components: {
    Message,
  },
  props: {
    messages: { type: Array, default: () => [] },
  },
  methods: {
    async scrollToBottom() {
      const block = this.$refs.messages
      if(block && block.scrollTop >= block.scrollHeight - block.clientHeight) {
        await this.$nextTick()
        block.scrollTop = block.scrollHeight - block.clientHeight
      }
    },
  },
}
</script>

<style lang="scss" scoped>

.messages {
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  padding: 10px;
  background-color: #f6f6f6;
  border: 1px solid #ccc;

  overflow-y: auto;

  &__item {
    margin-bottom: 10px;
    max-width: 80%;
  }
}

</style>
