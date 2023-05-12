<template>
  <div>
    <h1>Script Practice</h1>
    <div class="grid">
      <div class="col-4">
        <Card class="clickable" @click="goToScriptCategory('fsbo')">
          <template #title>FSBO</template>
          <template #content>
            <img class="card-body-img" src="https://images.pexels.com/photos/6457490/pexels-photo-6457490.jpeg" />
          </template>
        </Card>
      </div>
      <div class="col-4">
        <Card class="clickable" @click="goToScriptCategory('expired')">
          <template #title>Expired</template>
          <template #content>
            <img class="card-body-img" src="https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" />
          </template>
        </Card>
      </div>
      <div class="col-4">
        <Card class="clickable" @click="goToScriptCategory('circle')">
          <template #title>Circle</template>
          <template #content>
            <img class="card-body-img" src="https://images.pexels.com/photos/8111879/pexels-photo-8111879.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" />
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import Card from 'primevue/card';

export default {
  name: "ScriptPractice",
  data() {
    return {
    }
  },
  props: {
    signedInUser: Object
  },
  components: {
    Card
  },
  methods: {
    goToScriptCategory(category) {
      this.$router.push({
        name: 'ScriptCategory',
        params: ({ category })
      });
    }
  },
  created() {
  }
}
</script>

<style scoped>
</style>