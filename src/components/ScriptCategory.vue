<template>
  <div>
    <h1>Script Category</h1>
    <div class="grid">
      <div class="col-4">
        <Card class="clickable" @click="goToScriptQuiz('random')">
          <template #title>Random</template>
          <template #content>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque
              quas!
            </p>
          </template>
        </Card>
      </div>
      <div class="col-4">
        <Card class="clickable" @click="goToScriptQuiz('sequential')">
          <template #title>Sequential</template>
          <template #content>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque
              quas!
            </p>
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
  name: "ScriptCategory",
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
    goToScriptQuiz(type) {
      this.$router.push({
        name: 'ScriptQuiz',
        params: ({
          category: this.$route.params.category,
          type
        })
      });
    }
  },
  created() {
  }
}
</script>

<style scoped>
</style>