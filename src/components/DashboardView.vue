<template>
  <div v-if="signedInUser">
    <h1>Dashboard</h1>
    <Dialog class="stripe-dialog" :visible="!isPaymentSuccessful" modal header="Header" :style="{ width: '50vw' }">
      <StripePaymentForm @update-payment-success="updatePaymentSuccess" />
    </Dialog>
    <div v-if="isPaymentSuccessful" class="grid">
      <div class="col-4">
        <Card class="clickable" @click="goToMenuItem('ScriptPractice')">
          <template #title>Script Practice</template>
          <template #content>
            <img class="card-body-img" src="https://images.pexels.com/photos/5673488/pexels-photo-5673488.jpeg" />
          </template>
        </Card>
      </div>
      <div class="col-4">
        <Card class="clickable" @click="goToMenuItem('AnalyticsTracker')">
          <template #title>Analytics/Goal Tracker</template>
          <template #content>
            <img class="card-body-img" src="https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" />
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<script>
import StripePaymentForm from './StripePaymentForm.vue';
import Dialog from 'primevue/dialog';
import Card from 'primevue/card';

export default {
  name: "DashboardView",
  data() {
    return {
      isPaymentSuccessful: false
    }
  },
  props: {
    signedInUser: Object
  },
  components: {
    Dialog,
    StripePaymentForm,
    Card
  },
  methods: {
    updatePaymentSuccess(val) {
      this.isPaymentSuccessful = val;
    },
    goToMenuItem(menuItem) {
      this.$router.push({
        name: menuItem
      });
    }
  },
  created() {
    const currentPaymentStatus = this.signedInUser.paymentStatus === 'SUCCEEDED' ? true : false;
    this.updatePaymentSuccess(currentPaymentStatus);
  }
}
</script>

<style scoped>
.stripe-dialog .p-dialog-header .p-dialog-header-icons {
  display: none !important;
}
</style>