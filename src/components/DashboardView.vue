<template>
  <div v-if="signedInUser">
    <h1>Dashboard</h1>
    <Dialog class="stripe-dialog" :visible="!isPaymentSuccessful" modal header="Header" :style="{ width: '50vw' }">
      <StripePaymentForm @update-payment-success="updatePaymentSuccess" />
    </Dialog>
    {{ signedInUser }}
  </div>
</template>

<script>
import StripePaymentForm from './StripePaymentForm.vue';
import Dialog from 'primevue/dialog';

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
    StripePaymentForm
  },
  methods: {
    updatePaymentSuccess(val) {
      this.isPaymentSuccessful = val;
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