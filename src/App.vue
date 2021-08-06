<template>
  <div class="container  h-100">
    <div class="row h-100">
      <div class="col-12 py-2 h-100">
        <div class="card" :style="fitHeight">
          <div class="card-body" :style="fitHeight">
            <router-view />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  computed: {
    fitHeight(){
      return this.$route.name === 'chat' ? { height: "100%" } : ''
    },
  },
}
</script>

<style scoped lang="scss">
.card {
  max-width: 444px;
  margin: auto;
}
</style>
