<template>
  <b-container fluid>
  <router-view name='navbar'></router-view>
  <router-view name='detail'></router-view>
  </b-container>
</template>

<script>
export default {
  name: 'routed_app',
  data: () => ({}),
}
</script>

<style>
body {
    margin-top: 1rem;
    margin-bottom: 1rem;
}

.card {
    margin-top: .5rem;
    margin-bottom: .5rem;
}
</style>
