<template>
  <div class="chat">
    <div class="d-flex justify-content-between mb-2">
      <span>Диалог с собеседником</span>
      <button type="button" class="btn-close ms-3" aria-label="Close" title="Завершить диалог"></button>
    </div>

    <div class="chat__messages">
      <div class="chat__messages-item  chat__messages-item--me" v-for="n in 100" :key="n">
        <div class="chat__messages-text">
          Привет!!! Как дела?
        </div>
        <time class="chat__messages-time">02:27</time>
      </div>

      <div class="chat__messages-item  chat__messages-item--companion">
        <div class="chat__messages-text">
          Нормально! Сам как ?
        </div>
        <time class="chat__messages-time">02:27</time>
      </div>

      <div class="chat__messages-item  chat__messages-item--companion">
        <div class="chat__messages-text">
          eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee
        </div>
        <time class="chat__messages-time">02:27</time>
      </div>
    </div>
    

    <div class="chat__actions">
      <div class="chat__actions-message">
        <textarea class="form-control" placeholder="Ваше сообщение..."></textarea>
      </div>
      <button class="btn btn-primary ms-2">Отправить</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Chat",
}
</script>

<style lang="scss" scoped>

.chat {
  display: flex;
  flex-direction: column;
  height: 100%;


  &__messages {
    flex-grow: 1;

    display: flex;
    flex-direction: column;
    border-radius: 5px;
    padding: 10px;
    background-color: #f6f6f6;
    border: 1px solid #ccc;

    overflow-y: auto;

    &-item {
      margin-bottom: 10px;
      max-width: 80%;

      border-radius: 4px;
      padding: 10px 0 5px 10px;
      box-shadow: 0 1px 3px rgba(0,0,0,.3);

      word-break: break-word;

      &--companion {
        align-self: flex-start;
        background-color: #fff;
      }
      &--me {
        align-self: flex-end;
        background-color: #DCF8C6;
      }
    }
    &-text {
      display: inline-block;
      line-height: 1;
      padding-right: 10px;
    }
    &-time {
      font-size: 10px;
      padding-right: 10px;
    }
  }
  &__actions {
    margin-top: 15px;
    display: flex;
    &-message {
      flex-grow: 1;
    }
  }
}

</style>