<template>
  <div v-if="isAppReady">
    <h1>Settings</h1>
  </div>
</template>

<script>

export default {
  name: "SettingsPage",
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