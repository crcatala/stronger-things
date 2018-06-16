import Parse from "@/services/Parse";
import localForage from "localforage";
import Vue from "vue";
import Vuex from "vuex";
// import createPersistedState from "vuex-persistedstate";
import VuexPersistence from "vuex-persist";
import sessions from "./store/sessions";
import workouts from "./store/workouts";
Vue.use(Vuex);

window.localForage = localForage;

// Ensure clearing of store if no user
if (!Parse.User.current()) {
  localForage.clear();
}

// Define a plugin that emits when the state has been persisted
// See https://github.com/championswimmer/vuex-persist/issues/15#issuecomment-351342301
const vuexPersistEmitter = () => {
  return (store: any) => {
    store.subscribe((mutation: any) => {
      if (mutation.type === "RESTORE_MUTATION") {
        store._vm.$root.$emit("storageReady");
      }
    });
  };
};

console.log("start vuex bootstrap", Date.now());
const vuexLocal = new VuexPersistence({
  strictMode: true,
  asyncStorage: true,
  storage: localForage,
  modules: ["workouts"]
});

export default new Vuex.Store({
  modules: {
    sessions,
    workouts
  },
  mutations: {
    RESTORE_MUTATION: vuexLocal.RESTORE_MUTATION
  },
  // TODO: handle larger sets
  // https://github.com/championswimmer/vuex-persist + localForage (asycn though)
  // plugins: [createPersistedState({ paths: ["workouts.list"] })]
  plugins: [vuexLocal.plugin, vuexPersistEmitter()]
});
