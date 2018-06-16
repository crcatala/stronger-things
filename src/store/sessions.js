import Session from "@/services/Session";
import Parse from "@/services/Parse";
import localForage from "localforage";

export default {
  namespaced: true,
  state: {
    currentUser: Session.currentUser() || null
  },
  mutations: {
    setCurrentUser(state, user) {
      state.currentUser = user;
    }
  },
  actions: {
    async login({ commit }, { username = "", password = "" } = {}) {
      const user = await Parse.User.logIn(username, password);
      commit("setCurrentUser", user.toJSON());
      return user;
    },
    async logout({ commit }) {
      await Session.logout();
      // await localForage.clear();
      localForage
        .clear()
        .then(function() {
          // Run this code once the database has been entirely deleted.
          console.log("Database is now empty.");
        })
        .catch(function(err) {
          // This code runs if there were any errors
          console.log(err);
        });
      commit("setCurrentUser", null);
    },
    async register({ commit }, { username = "", password = "" }) {
      await localForage.clear();
      const user = new Parse.User();
      user.set("username", username);
      user.set("password", password);

      const res = await user.signUp();
      commit("setCurrentUser", res.toJSON());

      return res;
    }
  },
  getters: {
    currentUser(state) {
      return state.currentUser;
    }
    //
  }
};
