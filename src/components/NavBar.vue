<template>
  <div>
    <Menubar>
      <template #start>
        <img alt="logo" src="https://primefaces.org/cdn/primevue/images/logo.svg" height="40" class="mr-2" />
      </template>
      <template #end>
        <button v-if="signedInUser" @click="toggleShowMenuItems" class="avatar-container w-full p-link flex align-items-center p-2 pl-3 text-color hover:surface-200 border-noround">
          <img class="avatar" src="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png" />
          <i class="pi pi-caret-down" style="color: slateblue"></i>
          <Listbox v-if="showMenuItems" v-model="selectedMenu" optionLabel="name" :options="menuItems" class="listbox w-full" />
        </button>
      </template>
    </Menubar>
  </div>
</template>

<script>
import Menubar from 'primevue/menubar';
import Listbox from 'primevue/listbox';

export default {
  name: 'NavBar',
  components: {
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
            console.log("go to profile");
            return;
          case "settings":
            console.log("go to settings");
            return;
          case "logout":
            this.$emit('logout')
            return;
          default:
            console.log("menu action doesnt exist");
            break;
        }
      }
    }
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