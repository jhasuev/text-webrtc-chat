<template>
  <div :class="['message', { myself, notSent }]">
    <div class="message__text" v-text="text" />
    <time class="message__time">{{ moment(time).format("H:m:ss") }}</time>
  </div>
</template>

<script>
import moment from 'moment';
export default {
  name: "Message",
  props: {
    text: { type: String, default: "" },
    time: { type: Number, default: 0 },
    sent: { type: Boolean, default: false },
    myself: { type: Boolean, default: false },
  },
  data(){
    return {
      moment,
    }
  },
  computed: {
    notSent() {
      return this.myself && !this.sent
    },
  },
}
</script>

<style lang="scss" scoped>

.message {
  border-radius: 4px;
  padding: 10px 0 5px 10px;
  box-shadow: 0 1px 3px rgba(0,0,0,.3);

  word-break: break-word;

  align-self: flex-start;
  background-color: #fff;

  &.myself {
    align-self: flex-end;
    background-color: #DCF8C6;
  }
  &.notSent {
    opacity: .5;
  }

  &__text {
    display: inline-block;
    line-height: 1;
    padding-right: 10px;
    white-space: pre-line;
  }
  &__time {
    font-size: 10px;
    padding-right: 10px;
  }
}

</style>
