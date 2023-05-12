<template>
  <div v-if="isAppReady">
    <h1>Analytics</h1>
  </div>
</template>

<script>

export default {
  name: "AnalyticsTracker",
  data() {
    return {
    }
  },
  props: {
    signedInUser: Object
  },
  components: {
  },
  methods: {
  },
  created() {
    this.isAppReady = true;
  }
}
</script>

<style scoped>
</style>