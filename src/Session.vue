<template>
    <div class="loading" v-if="loading">
      Loading...
    </div>
    <div v-else>Session {{content}}</div>
</template>
<script>
export default {
  data () {
    return {
      loading: false,
      content: null,
    }
  },
  created () {
    this.fetchData()
  },
  watch: {
    '$route': 'fetchData'
  },
  methods: {
    fetchData () {
      this.loading = true
      setTimeout(() => {this.loading = false; this.content = this.$route.params.session_id}, 1000);
    }
  }
}
</script>
