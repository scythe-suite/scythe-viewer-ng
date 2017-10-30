<template>
<div id='app'><b-container fluid>
  <the-navbar></the-navbar>
  <b-row><b-col><component :is='store.current_view'></component></b-col></b-row>
</b-container></div>
</template>

<script>
import TheNavbar from './TheNavbar.vue'
import TheHome from './TheHome.vue'
import TheSummary from './TheSummary.vue'
import TheDetails from './TheDetails.vue'
import STORE from './store.js'

export default {
  name: 'app',
  data: () => ({store: STORE}),
  components: {TheNavbar, TheHome, TheSummary, TheDetails}
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
