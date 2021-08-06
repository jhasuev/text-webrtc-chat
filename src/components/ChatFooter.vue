<template>
  <div class="chat-footer">
    <div class="chat-footer__message">
      <textarea class="form-control" placeholder="Ваше сообщение..."></textarea>
    </div>
    <button class="btn btn-primary ms-2">Отправить</button>
  </div>
</template>

<script>
export default {
  name: "ChatFooter",
}
</script>

<style lang="scss" scoped>

.chat-footer {
  padding-top: 15px;
  display: flex;

  &__message {
    flex-grow: 1;
  }
}

</style>