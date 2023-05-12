<template>
  <div v-if="isAppReady">
    <h1>Script Questions</h1>
    <div v-if="availableObjectionIds && availableObjectionIds.length">
      <div class="script-question">
        "{{ filteredObjections[selectedIndex].objection }}"
      </div>
      <Card class="self-assessment-card flex justify-content-center">
        <!-- <template #title></template> -->
        <template #content>
          <div class="card-content-container">
            <div class="card-content-text">RATE YOURSELF</div>
            <Rating class="card-content-rating" v-model="filteredObjections[selectedIndex].rating" :cancel="false"  />
          </div>
        </template>
        <template #footer>
          <Button label="See Script" />
          <Button label="Next" @click="getNextIndex" severity="secondary" style="margin-left: 0.5em" />
        </template>
      </Card>
    </div>
    <div v-if="selectedIndex === -1">
      <Card class="self-assessment-card flex justify-content-center">
        <!-- <template #title>
        </template> -->
        <template #content>
          <div class="card-content-container">
            <p>You are finished with questions for this session</p>
            <p>Your average score was: {{ getAverageScore() }}</p>
          </div>
        </template>
        <!-- <template #footer>
          <Button label="See Script" />
          <Button label="Next" @click="getNextIndex" severity="secondary" style="margin-left: 0.5em" />
        </template> -->
      </Card>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import Card from 'primevue/card';
import Rating from 'primevue/rating';
import Button from 'primevue/button';

export default {
  name: "ScriptQuiz",
  data() {
    return {
      isAppReady: false,
      randomObjections: null,
      scripts: null,
      filteredObjections: null,
      availableObjectionIds: [],
      // usedIndicies: [],
      selectedIndex: null,
      type: null
    }
  },
  props: {
    signedInUser: Object
  },
  components: {
    Card,
    Rating,
    Button
  },
  methods: {
    getNextIndex() {
      if(this.type === 'random') {
        const indexToRemove = this.availableObjectionIds.indexOf(this.filteredObjections[this.selectedIndex].id);
        this.availableObjectionIds.splice(indexToRemove, 1);
        this.setSelectedIndex();
      }
    },
    setFilteredObjections() {
      if(this.type === 'random') {
        this.filteredObjections = JSON.parse(JSON.stringify(this.randomObjections)).filter((objection) => {
          if(objection.category === this.$route.params.category.toUpperCase()) {
            return true;
          }

          return false;
        }).map((objection) => {
          return {
            ...objection,
            rating: 0
          }
        });

        this.availableObjectionIds = this.filteredObjections.map(objection => objection.id);
      } else {
        // TODO logic for sequential scripts
        this.availableObjectionIds = null;
      }
    },
    getRandomIndex() {
      if(this.availableObjectionIds && this.availableObjectionIds.length) {
        const randomAvailableObjectionIndex = Math.floor(Math.random() * this.availableObjectionIds.length);
        const randomObjectionId = this.availableObjectionIds[randomAvailableObjectionIndex];
        const randomIndex = this.filteredObjections.map(objection => objection.id).indexOf(randomObjectionId);

        return randomIndex;
      }
      return -1;
    },
    setSelectedIndex() {
      this.selectedIndex = this.type === 'sequential' ? 0 : this.getRandomIndex();
    },
    getAverageScore() {
      const totalScore = this.filteredObjections.reduce((total, objection) => {
        return total + objection.rating;
      }, 0);

      const average = (totalScore/this.filteredObjections.length).toFixed(1);

      return `${average} / 5.0`;
    }
  },
  created() {
    this.type = this.$route.params.type;

    // list of random questions will be fetched from a seperate db than the script questions
    // should we filter by category on the client or server?
    // how do we connect the scripts to the user in case we want to show which are completed
    // do we mark completed only for the session and allow repeat scripts the next day?
    this.randomObjections = [
      {
        id: 1,
        category: "FSBO",
        objection: "We'll save the commission by selling it ourselves."
      },
      {
        id: 2,
        category: "FSBO",
        objection: "Well, we just started looking... we're not in any rush"
      },
      {
        id: 3,
        category: "FSBO",
        objection: "I only have questions about THIS home."
      },
      {
        id: 4,
        category: "FSBO",
        objection: "I'm really just interested in learning the price of the home."
      },
      {
        id: 5,
        category: "FSBO",
        objection: "We already have an agent."
      },
      {
        id: 6,
        category: "FSBO",
        objection: "We only want to work with the listing agent."
      },
      {
        id: 7,
        category: "EXPIRED",
        objection: "We'll save the commission by selling it ourselves."
      },
      {
        id: 8,
        category: "EXPIRED",
        objection: "Well, we just started looking... we're not in any rush"
      },
      {
        id: 9,
        category: "EXPIRED",
        objection: "I only have questions about THIS home."
      },
      {
        id: 10,
        category: "EXPIRED",
        objection: "I'm really just interested in learning the price of the home."
      },
      {
        id: 11,
        category: "EXPIRED",
        objection: "We already have an agent."
      },
      {
        id: 12,
        category: "EXPIRED",
        objection: "We only want to work with the listing agent."
      },
      {
        id: 13,
        category: "CIRCLE",
        objection: "We'll save the commission by selling it ourselves."
      },
      {
        id: 14,
        category: "CIRCLE",
        objection: "Well, we just started looking... we're not in any rush"
      },
      {
        id: 15,
        category: "CIRCLE",
        objection: "I only have questions about THIS home."
      },
      {
        id: 16,
        category: "CIRCLE",
        objection: "I'm really just interested in learning the price of the home."
      },
      {
        id: 17,
        category: "CIRCLE",
        objection: "We already have an agent."
      },
      {
        id: 18,
        category: "CIRCLE",
        objection: "We only want to work with the listing agent."
      }
    ];

    this.setFilteredObjections();

    this.setSelectedIndex();

    this.isAppReady = true;
  }
}
</script>

<style scoped>
.script-question {
  font-size: 28px;
  padding-top: 40px;
  padding-bottom: 40px;
  text-align: center;
}

.self-assessment-card {
  width: 100%;
  height: 300px;
  background-color: rgb(80, 112, 125);
}

.card-content-container {
  color: white;
}

.card-content-text {
  text-align: center;
  padding-top: 40px;
  padding-bottom: 20px;
}

.card-content-rating {
  justify-content: center;
}
</style>