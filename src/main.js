import { createApp, h, provide } from "vue";
import { createWebHistory, createRouter } from "vue-router";
import App from './App.vue';
import './assets/global.css';
import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from "@apollo/client/core";
import PrimeVue from 'primevue/config';
//theme
import "primevue/resources/themes/bootstrap4-light-blue/theme.css";     
//core
import "primevue/resources/primevue.min.css";
//icons
import "primeicons/primeicons.css";

const httpLink = new HttpLink({
  uri: process.env.VUE_APP_API_URL,
});

const middlewareLink = new ApolloLink((operation, forward) => {
  const token = sessionStorage.getItem('salesscript.token');
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      authorization: `Bearer ${token}`
    }
  }));

  return forward(operation);
})

const links = ApolloLink.from([middlewareLink, httpLink]);

export const apolloClient = new ApolloClient({
  link: links,
  cache: new InMemoryCache()
});

const routes = [
  {
    path: '/',
    name: 'App',
    component: App
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

const app = createApp({
  setup() {
    provide({ default: apolloClient });
  },
  render: () => h(App),
});

app.use(PrimeVue).use(router);
app.mount("#app");