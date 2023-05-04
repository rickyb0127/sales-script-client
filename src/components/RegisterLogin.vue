<template>
  <div>
    <Card>
      <template #content>
        <div v-if="showLogin" class="form-container">
          <form @submit="login($event)" class="form flex flex-column gap-2">
            <h3>Login</h3>
            <div class="flex flex-column gap-2">
              <label for="email">Email Address</label>
              <InputText id="email" v-model="formData.email" aria-describedby="email-help" />
            </div>
            <small v-if="inputError === 'email'" class="p-error">Please enter a valid email</small>
            <div class="flex flex-column gap-2">
              <label for="password">Password</label>
              <InputText id="password" type="password" v-model="formData.password" aria-describedby="password-help" />
            </div>
            <small v-if="inputError === 'password'" class="p-error">Incorrect email or password</small>
            <Button type="submit" label="Submit" />
            <small v-if="serverError" class="p-error">{{ serverError }}</small>
            <div>
              Don't have an account? <span class="link" @click="showLogin = false, resetForm()">Sign up</span>
            </div>
          </form>
        </div>
        <div v-else class="form-container">
          <form @submit="register($event)" class="form flex flex-column gap-2">
            <h3>Register</h3>
            <div class="flex flex-column gap-2">
              <label for="firstname">First Name</label>
              <InputText id="firstname" v-model="formData.firstName" aria-describedby="firstname-help" />
            </div>
            <small v-if="inputError === 'firstname'" class="p-error">First Name is required</small>
            <div class="flex flex-column gap-2">
              <label for="lastname">Last Name</label>
              <InputText id="lastname" v-model="formData.lastName" aria-describedby="lastname-help" />
            </div>
            <small v-if="inputError === 'lastname'" class="p-error">Last Name is required</small>
            <div class="flex flex-column gap-2">
              <label for="email">Email Address</label>
              <InputText id="email" v-model="formData.email" aria-describedby="email-help" />
            </div>
            <small v-if="inputError === 'email'" class="p-error">Please enter a valid email</small>
            <div class="flex flex-column gap-2">
              <label for="phone">Phone Number</label>
              <InputText id="phone" v-model="formData.phone" aria-describedby="phone-help" />
            </div>
            <small v-if="inputError === 'phone'" class="p-error">Please enter a valid phone</small>
            <div class="flex flex-column gap-2">
              <label for="password">Password</label>
              <InputText id="password" type="password" v-model="formData.password" aria-describedby="password-help" />
            </div>
            <small v-if="inputError === 'password'" class="p-error">Password must contain at least 1 uppercase character, 1 lowercase character, 1 number and be at least 6 characters in length</small>
            <div class="flex flex-column gap-2">
              <label for="retypePassword">Retype Password</label>
              <InputText id="retypePassword" type="password" v-model="formData.retypePassword" aria-describedby="retypePassword-help" />
            </div>
            <small v-if="inputError === 'passwordMatch'" class="p-error">Passwords don't match</small>
            <div class="flex flex-column gap-2">
              <label for="address1">Address Line 1</label>
              <InputText id="address1" type="text" v-model="formData.address1" aria-describedby="address1-help" />
            </div>
            <div class="flex flex-column gap-2">
              <label for="address2">Address Line 2</label>
              <InputText id="address2" type="text" v-model="formData.address2" aria-describedby="address2-help" />
            </div>
            <small v-if="inputError === 'address'" class="p-error">Please enter a valid address</small>
            <div class="flex flex-column gap-2">
              <label for="city">City</label>
              <InputText id="city" type="text" v-model="formData.city" aria-describedby="city-help" />
            </div>
            <small v-if="inputError === 'city'" class="p-error">Please enter a valid city</small>
            <!-- TODO create state picker dropdown for state enums -->
            <div class="flex flex-column gap-2">
              <label for="state">State</label>
              <InputText id="state" type="text" v-model="formData.state" aria-describedby="state-help" />
            </div>
            <small v-if="inputError === 'state'" class="p-error">Please enter a valid state</small>
            <div class="flex flex-column gap-2">
              <label for="zip">Zip Code</label>
              <InputText id="zip" type="text" v-model="formData.zip" aria-describedby="zip-help" />
            </div>
            <small v-if="inputError === 'zip'" class="p-error">Please enter a valid zip</small>
            <div class="flex flex-column gap-2">
              <label for="companyname">Company Name</label>
              <InputText id="companyname" type="text" v-model="formData.companyName" aria-describedby="companyname-help" />
            </div>
            <Button type="submit" label="Submit" />
            <small v-if="serverError" class="p-error">{{ serverError }}</small>
            <div>
              Already have an account? <span class="link" @click="showLogin = true, resetForm()">Login</span>
            </div>
          </form>
        </div>
      </template>
    </Card>
  </div>
</template>

<script>
import { apolloClient } from '../main';
import { gql } from '@apollo/client/core';
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';

export default {
  name: 'RegisterLogin',
  components: {
    Card,
    InputText,
    Button
  },
  data() {
    return {
      formData: {},
      showLogin: true,
      inputError: null,
      serverError: null
    }
  },
  methods: {
    resetForm() {
      this.formData = {};
      this.inputError = null;
      this.serverError = null;
    },
    validateLoginForm() {
      if(this.validateEmail(this.formData.email)) {
        if(!this.formData.password) {
          this.inputError = "password";
          return false;
        } else {
          this.inputError = null;
          return true;
        }
      } else {
        return false;
      }
    },
    validateRegisterForm() {
      if(!this.formData.firstName) {
        this.inputError = "firstname";
        return false;
      } else if(!this.formData.lastName) {
        this.inputError = "lastname";
        return false;
      } else if(!this.validateEmail(this.formData.email)) {
        return false;
      } else if(!this.formData.phone) {
        // TODO add phone validation and sanitization
        this.inputError = "phone";
        return false;
      } else if(!this.validatePassword()) {
        return false;
      } else if(this.formData.password !== this.formData.retypePassword) {
        this.inputError = "passwordMatch";
        return false;
      } else {
        this.inputError = null;
        return true;
      }
    },
    validateEmail(email) {
      let re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if(email && re.test(String(email).toLowerCase())) {
        return true;
      } else {
        this.inputError = "email";
        return false;
      }
    },
    validatePassword() {
      const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z0-9!@#$&%*\-<>=?|:;~(){}[\\-`.+,/"]{6,}$/;
      if(this.formData.password && re.test(this.formData.password)) {
        return true;
      } else {
        this.inputError = "password";
        return false;
      }
    },
    async login(e) {
      e.preventDefault();
      if(this.validateLoginForm()) {
        try {
          const login = gql`
            query Login($email: String!, $password: String!) {
              login(email: $email, password: $password)
            }
          `;

          const response = await apolloClient.query({ 
            query: login,
            variables: {
              email: this.formData.email,
              password: this.formData.password
            } 
          });

          const token = response.data.login;
          sessionStorage.setItem('salesscript.token', token.toString());
          this.$emit('check-is-authed');

          return;
        } catch(err) {
          if(err.message) {
            this.serverError = err.message;
          } else {
            this.serverError = "Something went wrong. Please try again";
          }
        }
      }
    },
    async register(e) {
      e.preventDefault();
      if(this.validateRegisterForm()) {
        try {
          const register = gql`
            mutation Register($input: RegisterInput!) {
              register(input: $input)
            }
          `;

          const response = await apolloClient.mutate({ 
            mutation: register,
            variables: {
              input: {
                firstName: this.formData.firstName,
                lastName: this.formData.lastName,
                email: this.formData.email,
                password: this.formData.password,
                phone: this.formData.phone,
                address1: this.formData.address1,
                address2: this.formData.address2,
                city: this.formData.city,
                state: this.formData.state,
                zip: this.formData.zip,
                companyName: this.formData.companyName
              }
            } 
          });

          const token = response.data.register;
          sessionStorage.setItem('salesscript.token', token.toString());
          this.$emit('check-is-authed');

          return;
        } catch(err) {
          if(err.message) {
            this.serverError = err.message;
          } else {
            this.serverError = "Something went wrong. Please try again";
          }
        }
      }
    }
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
</style>