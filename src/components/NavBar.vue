<template>
  <div>
    <Menubar>
      <template #start>
        <img class="clickable mr-2" @click="$router.push({ path: '/' })" alt="logo" src="https://primefaces.org/cdn/primevue/images/logo.svg" height="40" />
      </template>
      <template #end>
        <button v-if="signedInUser" @click="toggleShowMenuItems" class="avatar-container w-full p-link flex align-items-center p-2 pl-3 text-color hover:surface-200 border-noround">
          <img v-if="signedInUser.settings?.profileImgUrl" class="avatar" :src="signedInUser.settings?.profileImgUrl" />
          <Avatar class="profile-image" v-else icon="pi pi-user" shape="circle" />
          <i class="pi pi-caret-down" style="color: slateblue"></i>
          <Listbox v-if="showMenuItems" v-model="selectedMenu" optionLabel="name" :options="menuItems" class="listbox w-full" />
        </button>
      </template>
    </Menubar>
  </div>
</template>

<script>
import Avatar from 'primevue/avatar';
import Menubar from 'primevue/menubar';
import Listbox from 'primevue/listbox';

export default {
  name: 'NavBar',
  components: {
    Avatar,
    Menubar,
    Listbox
  },
  props: {
    signedInUser: Object
  },
  data() {
    return {
      showMenuItems: false,
      toggleClicked: false,
      selectedMenu: null,
      menuItems: [
        { name: 'Profile', action: 'profile' },
        { name: 'Settings', action: 'settings' },
        { name: 'Logout', action: 'logout' }
      ]
    }
  },
  watch: {
    selectedMenu(newVal, oldVal) {
      if(newVal && newVal !== oldVal) {
        switch (newVal.action) {
          case "profile":
            this.selectedMenu = null;
            this.$router.push({
              name: 'ProfilePage'
            });
            return;
          case "settings":
            this.selectedMenu = null;
            this.$router.push({
              name: 'SettingsPage'
            });
            return;
          case "logout":
            this.selectedMenu = null;
            this.$emit('logout')
            return;
          default:
            console.log("menu action doesnt exist");
            break;
        }
      }
    },
    // signedInUser(newVal) {
    //   console.log("signed in user in nav: " + newVal)
    // }
  },
  methods: {
    toggleShowMenuItems() {
      this.showMenuItems = !this.showMenuItems;
      this.toggleClicked = true;
    },
    handleCloseMenu() {
      if(!this.toggleClicked) {
        this.showMenuItems = false;
      }
      this.toggleClicked = false;
    }
  },
  mounted() {
    window.addEventListener('click', this.handleCloseMenu);
  }
}
</script>

<style scoped>
.p-menubar-root-list {
  margin-left: auto !important;
}

.avatar-container {
  position: relative;
}

.avatar {
  border-radius: 50%;
  height: 30px;
  width: 30px;
}

.listbox {
  position: absolute;
  top: 45px;
  right: 0px;
  min-width: 150px;
}
</style>