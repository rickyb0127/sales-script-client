<template>
  <div>
    <DashboardView v-if="signedInUser" :signed-in-user="signedInUser" />
    <div v-if="!signedInUser" class="register-login-container col-12 md:col-6 lg:col-6 xl:col-4">
      <RegisterLogin @check-is-authed="$emit('check-is-authed')" class="register-login" />
    </div>
  </div>
</template>

<script>
import DashboardView from '../components/DashboardView.vue';
import RegisterLogin from '../components/RegisterLogin.vue';

export default {
  name: 'WelcomeView',
  components: {
    DashboardView,
    RegisterLogin
  },
  props: {
    signedInUser: Object
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