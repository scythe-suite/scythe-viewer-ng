<template>
  <b-progress v-if='status.compile' >
    <b-progress-bar :value='100 * status.errors / tot' variant='danger'/>
    <b-progress-bar :value='100 * status.diffs / tot' variant='warning'/>
    <b-progress-bar :value='100 * status.oks / tot' variant='success'/>
  </b-progress>
  <b-progress v-else :value='100'/>
</template>

<script>
export default {
    name: 'status-bar',
    props: ['status', 'tot'],
};
</script>
