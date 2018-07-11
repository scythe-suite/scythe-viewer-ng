<template>
  <b-progress :value='tot'/>
</template>

<script>
export default {
    name: 'completion-bar',
    props: ['tot'],
};
</script>
