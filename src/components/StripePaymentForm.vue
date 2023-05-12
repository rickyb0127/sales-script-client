<template>
  <div>
    <Card>
      <template #content>
        <form id="payment-form" @submit="submitPayment($event)">
          <div id="address-element">
            <!-- Elements will create form elements here -->
          </div>
          <div id="payment-element">
            <!--Stripe.js injects the Payment Element-->
          </div>
          <Button class="submit-btn" type="submit" label="Pay Now" />
          <div id="payment-message" class="hidden"></div>
        </form>
      </template>
    </Card>
  </div>
</template>

<script>
/* eslint-disable */
import { apolloClient } from '../main';
import { gql } from '@apollo/client/core';
import Card from 'primevue/card';
import Button from 'primevue/button';

export default {
  name: 'StripePaymentForm',
  components: {
    Card,
    Button
  },
  data() {
    return {
      publishableKey: process.env.VUE_APP_STRIPE_PUBLISHABLE_KEY,
      promoCode: "",
      stripe: null,
      elements: null,
      enableAutomaticPayments: false
    }
  },
  methods: {
    async submitPayment(e) {
      e.preventDefault();
      
      try {
        const user = gql`
          query User {
            user {
              email
            }
          }
        `;

        const response = await apolloClient.query({ query: user });

        const userData = response.data.user;
        
        await this.stripe.confirmPayment({
          //`Elements` instance that was used to create the Payment Element
          elements: this.elements,
          confirmParams: {
            return_url: 'http://localhost:8080',
            payment_method_data: {
              billing_details: {
                email: userData.email
              }
            }
          }
        });
      } catch(err) {
        console.log(err);
      }
    },
    async checkStatus() {
      // TODO this needs to make trigger a call to checkAuth in case the webhook updated the user payment status
      const stripe = Stripe(process.env.VUE_APP_STRIPE_PUBLISHABLE_KEY);
      const clientSecret = new URLSearchParams(window.location.search).get(
        "payment_intent_client_secret"
      );

      if (!clientSecret) {
        console.log("no client secret")
        await this.initialize();
        return;
      }

      const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);

      switch (paymentIntent.status) {
        case "succeeded":
          console.log("Payment succeeded!");
          this.$emit("update-payment-success", true);
          return;
        case "processing":
          console.log("Your payment is processing.");
          break;
        case "requires_payment_method":
          console.log("Your payment was not successful, please try again.");
          break;
        default:
          console.log("Something went wrong.");
          break;
      }

      await this.initialize();
    },
    async initialize() {
      this.stripe = Stripe(process.env.VUE_APP_STRIPE_PUBLISHABLE_KEY);

      // TODO add a watcher for promo code in order to set the new payment amount on the server
      // dont send the price through, aways check price on the server
      try {
        const createPaymentIntent = gql`
          mutation CreatePaymentIntent($promoCode: String, $enableAutomaticPayments: Boolean) {
            createPaymentIntent(promoCode: $promoCode, enableAutomaticPayments: $enableAutomaticPayments)
          }
        `;

        const response = await apolloClient.mutate({ 
          mutation: createPaymentIntent,
          variables: {
            promoCode: this.promoCode,
            enableAutomaticPayments: this.enableAutomaticPayments
          } 
        });

        const clientSecret = response.data.createPaymentIntent;

        const appearance = {
          theme: 'stripe',
        };
        this.elements = this.stripe.elements({ appearance, clientSecret });

        // Create and mount the Address Element in shipping mode
        const addressElement = this.elements.create("address", {
          mode: "billing",
        });
        addressElement.mount("#address-element");

        const paymentElementOptions = {
          layout: "tabs",
        };

        const paymentElement = this.elements.create("payment", paymentElementOptions);
        paymentElement.mount("#payment-element");
      } catch(err) {
        console.log(err);
        // if(err.message) {
        //   this.serverError = err.message;
        // } else {
        //   this.serverError = "Something went wrong. Please try again";
        // }
      }
    }
  },
  async created() {
    await this.checkStatus();
  }
}
</script>

<style scoped>
.form-container {
  display: flex;
  justify-content: center;
}

.form {
  width: 100%;
}

.submit-btn {
  margin-top: 15px;
}
</style>