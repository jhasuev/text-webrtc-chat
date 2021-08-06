<template>
  <div class="messages">
    <message class="messages__item" text="eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee" :time="Date.now()" />
    <message class="messages__item" text="Привет!!! Как дела?" :myself="true" :time="Date.now()" v-for="n in 20" :key="n" />
    <message class="messages__item" text="Нормально! Сам как ?" :time="Date.now()" />
  </div>
</template>

<script>
import Message from "@/components/Message"
export default {
  name: "Messages",
  components: {
    Message,
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
