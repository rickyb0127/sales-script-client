<template>
  <div>
    <h1>Profile</h1>

    <div class="form-container">
      <form @submit="update($event)" class="form flex flex-column gap-2">
        <div class="flex flex-column gap-2">
          <label for="firstname">Profile Image</label>
          <div class="profile-image-container">
            <img v-if="imagePreview || formData.settings?.profileImgUrl" class="profile-image" :src="imagePreview || formData.settings?.profileImgUrl" />
            <Avatar v-else class="profile-image" icon="pi pi-user" shape="circle" />
            <div class="profile-image-input">
              <label class="custom-file-upload">
                <input type="file" accept="image/*" @change="uploadFile" ref="file" />
                <span class="input-text">Edit</span>
              </label>
            </div>
          </div>
        </div>
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
        <!-- <div class="flex flex-column gap-2">
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
        <small v-if="inputError === 'city'" class="p-error">Please enter a valid city</small> -->
        <!-- TODO create state picker dropdown for state enums -->
        <!-- <div class="flex flex-column gap-2">
          <label for="state">State</label>
          <InputText id="state" type="text" v-model="formData.state" aria-describedby="state-help" />
        </div>
        <small v-if="inputError === 'state'" class="p-error">Please enter a valid state</small>
        <div class="flex flex-column gap-2">
          <label for="zip">Zip Code</label>
          <InputText id="zip" type="text" v-model="formData.zip" aria-describedby="zip-help" />
        </div>
        <small v-if="inputError === 'zip'" class="p-error">Please enter a valid zip</small> -->
        <div class="flex flex-column gap-2">
          <label for="companyname">Company Name</label>
          <InputText id="companyname" type="text" v-model="formData.companyName" aria-describedby="companyname-help" />
        </div>
        <div class="col-4">
          <Button type="submit" label="Update" />
        </div>
        <small v-if="serverError" class="p-error">{{ serverError }}</small>
      </form>
    </div>    
  </div>
</template>

<script>
/* eslint-disable */
import { apolloClient } from '../main';
import { gql } from '@apollo/client/core';
import Avatar from 'primevue/avatar';
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';

export default {
  name: "ProfilePage",
  data() {
    return {
      formData: {},
      inputError: null,
      serverError: null,
      imagePreview: null,
      imageFile: null
    }
  },
  props: {
    signedInUser: Object
  },
  components: {
    Avatar,
    Card,
    InputText,
    Button
  },
  methods: {
    uploadFile() {
      this.imagePreview = URL.createObjectURL(this.$refs.file.files[0]);
      this.imageFile = this.$refs.file.files[0];
    },
    validateUpdateForm() {
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
    async update(e) {
      e.preventDefault();
      if(this.validateUpdateForm()) {
        if(this.imageFile) {
          try {
            const aws = require('aws-sdk')

            aws.config.update({
              secretAccessKey: process.env.VUE_APP_AWS_SECRET_ACCESS_KEY,
              accessKeyId: process.env.VUE_APP_AWS_ACCESS_KEY,
              region: process.env.VUE_APP_AWS_REGION,
              signatureVersion: 'v4'
            });

            const s3 = new aws.S3();
            const savedFileName = `${this.signedInUser.id}-${Date.now()}-${this.imageFile.name}`;

            const params = { 
              Bucket: 'sales-script', 
              Key: savedFileName, 
              Body: this.imageFile 
            };

            const { Location } = await s3.upload(params).promise();
            this.formData.profileImgUrl = Location;

            if(this.signedInUser.settings?.profileImgUrl) {
              const fileName = this.signedInUser.settings?.profileImgUrl.split('/').slice(-1)[0];
              const deleteParams = {
                Bucket: "sales-script", 
                Key: fileName
              };
              
              await s3.deleteObject(deleteParams).promise();
            }
          } catch(err) {
            console.log(err)
          }
        }

        try {
          const updateUser = gql`
            mutation UpdateUser($input: UpdateUserInput!) {
              updateUser(input: $input)
            }
          `;

          const response = await apolloClient.mutate({ 
            mutation: updateUser,
            variables: {
              input: {
                firstName: this.formData.firstName,
                lastName: this.formData.lastName,
                email: this.formData.email,
                phone: this.formData.phone,
                // address1: this.formData.address1,
                // address2: this.formData.address2,
                // city: this.formData.city,
                // state: this.formData.state,
                // zip: this.formData.zip,
                companyName: this.formData.companyName,
                profileImgUrl: this.formData.profileImgUrl 
              }
            } 
          });

          const token = response.data.updateUser;
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
  },
  created() {
    this.formData = JSON.parse(JSON.stringify(this.signedInUser));
    console.log(this.formData)
  }
}
</script>

<style scoped>
.profile-image-container {
  height: 100px;
  width: 100px;
  border-radius: 50%;
  position: relative;
  /* cursor: pointer; */
}

.profile-image {
  height: 100%;
  width: 100%;
  border-radius: 50%;
}

.profile-image-input {
  position: absolute;
  left: 0;
  bottom: 0;
}

input[type="file"] {
  display: none;
}

.custom-file-upload {
  background-color: rgb(53, 121, 246);
  border: 1px solid transparent;
  border-radius: 5px;
  display: inline-block;
  padding: 2px 10px;
  cursor: pointer;
}

.input-text {
  color: white;
}

.form-container input {
  max-width: 500px;
}
</style>