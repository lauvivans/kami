import "@core/assets/scss/main.scss";
import { createApp } from "vue";
import App from "./App.vue";
import { piniaInstance } from "@core/index.ts";
import { createRouter, createWebHistory } from "vue-router";
import metadata from "./metadata";
import { createRoutes } from "./routes";

const app = createApp(App);

app.use(piniaInstance);

const router = createRouter({
  history: createWebHistory(),
  routes: createRoutes(Object.values(metadata.pages)),
});

app.use(router);
app.mount("#app");
