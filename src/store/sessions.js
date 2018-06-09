import Session from "@/services/Session";
import Parse from "@/services/Parse";

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
      commit("setCurrentUser", null);
    },
    async register({ commit }, { username = "", password = "" }) {
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
