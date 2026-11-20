import { createApp } from "vue";
import "@lauvivans/kami/dist/kami.css";
import { createRouter, createWebHistory } from "vue-router";
import {
  MainLayout,
  NotFoundPage,
  useStore,
  piniaInstance,
  type PageInfo,
} from "@lauvivans/kami";
import App from "@/App.vue";
import metadata from "@/metadata";

const app = createApp(App);

const mainChildren = Object.values(metadata.pages).map((page: PageInfo) => ({
  path: page.path,
  component: page.component,
  name: page.id,
  beforeEnter: () => {
    useStore.storeActivePage(page);
  },
}));

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/:pathMatch(.*)",
      component: NotFoundPage,
      name: "NotFound",
      beforeEnter: (to, from) => {
        to.meta.previousRoute = from.path;
      },
    },
    {
      path: "/",
      component: MainLayout,
      children: mainChildren,
    },
  ],
});

app.use(router).use(piniaInstance);
app.mount("#app");

// Temporary: proves CI fails on a template type error (#120).
export const broken: number = "not a number";
