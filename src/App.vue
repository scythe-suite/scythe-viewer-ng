<template>
  <b-container fluid>
    <router-view name='navbar'/>
    <b-row><b-col><router-view name='detail'/></b-col></b-row>
  </b-container>
</template>

<script>
export default {
    name: 'app',
    data: () => ({}),
};
</script>

<style>
body {
    margin-top: 1rem;
    margin-bottom: 1rem;
}
</style>
