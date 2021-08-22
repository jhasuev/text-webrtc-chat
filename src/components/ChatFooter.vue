<template>
  <div class="chat-footer">
    <div class="chat-footer__message">
      <textarea
        class="form-control  chat-footer__textarea"
        placeholder="Ваше сообщение..."

        @keydown.enter.ctrl=send
        v-model=message
      ></textarea>
    </div>
    <button
      class="btn btn-primary ms-2"
      @click="send"
    >Отправить</button>
  </div>
</template>

<script>
export default {
  name: "ChatFooter",
  data(){
    return {
      message: "",
    }
  },
  methods: {
    send(){
      const message = this.message.trim()
      if(message) {
        this.$emit("send-message", message)
        this.message = ""
      }
    },
  },
}
</script>

<style lang="scss" scoped>

.chat-footer {
  padding-top: 15px;
  display: flex;

  &__textarea {
    resize: none;
  }

  &__message {
    flex-grow: 1;
  }
}

</style>