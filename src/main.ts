import Vue from "vue";
import Notifications from "vue-notification";
import VModal from "vue-js-modal";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "normalize.css";
import "@/styles/main.scss";

Vue.use(Notifications);
Vue.use(VModal, { dynamic: true });

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
