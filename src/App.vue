<template>
  <div class="container">
    <div class="row">
      <div class="col-12 py-2">

        <div class="card">
          <div class="card-body">
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
}
</script>

<style scoped lang="scss">
.card {
  max-width: 444px;
  margin: auto;
}
</style>
