<template>
  <div v-if="isAppReady">
    <NavBar @logout="logout()" :signed-in-user="signedInUser" />
    <DashboardView v-if="isAuthenticated" :signed-in-user="signedInUser" />
    <div v-if="!isAuthenticated" class="register-login-container col-12 md:col-6 lg:col-6 xl:col-4">
      <RegisterLogin @check-is-authed="checkIsAuthed()" class="register-login" />
    </div>
  </div>
</template>

<script>
import { apolloClient } from './main';
import { gql } from '@apollo/client/core';
import NavBar from './components/NavBar.vue';
import DashboardView from './components/DashboardView.vue';
import RegisterLogin from './components/RegisterLogin.vue';

export default {
  name: 'App',
  components: {
    NavBar,
    DashboardView,
    RegisterLogin
  },
  data() {
    return {
      isAuthenticated: false,
      isAppReady: false,
      signedInUser: null
    }
  },
  methods: {
    async checkIsAuthed() {
      try {
        const fetchUser = gql`
          query User {
            user {
              id,
              email,
              paymentStatus
            }
          }
        `;

        const response = await apolloClient.query({ query: fetchUser });
        const user = response.data.user;
        this.isAuthenticated = true;
        this.signedInUser = user;
      } catch(err) {
        console.log(err);
        this.isAuthenticated = false;
      }
    },
    logout() {
      sessionStorage.removeItem('salesscript.token');
      this.isAuthenticated = false;
      this.signedInUser = null;
    }
  },
  async created() {
    await this.checkIsAuthed();
    this.isAppReady = true;
  }
}
</script>

<style>
.register-login-container {
  max-width: 500px;
  padding-top: 20px;
  margin-left: auto;
  margin-right: auto;
}
</style>
