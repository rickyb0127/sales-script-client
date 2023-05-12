<template>
  <div v-if="isAppReady">
    <NavBar @logout="logout()" :signed-in-user="signedInUser" />
    <div class="app-container">
      <router-view @check-is-authed="checkIsAuthed()" :signed-in-user="signedInUser"></router-view>
    </div>
  </div>
</template>

<script>
import { apolloClient } from './main';
import { gql } from '@apollo/client/core';
import NavBar from './components/NavBar.vue';

export default {
  name: 'App',
  components: {
    NavBar
  },
  data() {
    return {
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
              firstName,
              lastName,
              email,
              phone,
              # address1,
              # address2,
              # city,
              # state,
              # zip,
              companyName,
              paymentStatus,
              settings {
                profileImgUrl
              }
            }
          }
        `;

        const response = await apolloClient.query({
          fetchPolicy: 'no-cache',
          query: fetchUser 
        });
        const user = response.data.user;
        this.signedInUser = user;
      } catch(err) {
        this.signedInUser = null;
        console.log(err);
      }
    },
    logout() {
      sessionStorage.removeItem('salesscript.token');
      this.signedInUser = null;
      this.$router.push({ name: "WelcomeView" });
    }
  },
  async created() {
    await this.checkIsAuthed();
    this.isAppReady = true;
  }
}
</script>

<style>
.app-container {
  margin-left: 50px;
  margin-right: 50px;
}
</style>
