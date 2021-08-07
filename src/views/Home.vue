<template>
  <div class="text-center">
    <button class="btn btn-primary" @click="start">Найти собеседника</button>
  </div>
</template>

<script>
export default {
  name: "Home",
  methods: {
    start() {
      this.$router.push({ name: "search" })
    },
  },
}
</script>
