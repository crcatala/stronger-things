import api from "@/api";
import get from "lodash/get";

function getInitialState() {
  return {
    lastUpdateCheckedAt: new Date(0),
    updatedAt: new Date(0),
    mostRecentRemoteItem: null,
    list: []
  };
}

export default {
  namespaced: true,
  state: getInitialState(),
  getters: {
    isUpToDate(state) {
      const remoteDate = new Date(
        get(state, "mostRecentRemoteItem.createdAt", null)
      );
      const clientDate = new Date(get(state, "list[0].createdAt", null));

      return clientDate >= remoteDate;
    },
    list(state) {
      return state.list;
    }
  },
  mutations: {
    reset(state) {
      const initialState = getInitialState();

      for (let f in state) {
        state[f] = initialState[f];
      }
    },
    setList(state, val) {
      state.list = val;
    },
    setMostRecentRemoteItem(state, item) {
      state.mostRecentRemoteItem = item;
    },
    setLastUpdateCheckedAt(state) {
      state.lastUpdateCheckedAt = new Date();
    }
  },
  actions: {
    reset({ commit }) {
      commit("reset");
    },
    async refreshList({ dispatch }) {
      dispatch("checkForUpdates");
    },
    async getList() {
      // TODO:
    },
    async checkForUpdates({ commit, getters }) {
      const item = await api.getLatestWorkout();
      commit("setMostRecentRemoteItem", item || null);
      commit("setLastUpdateCheckedAt");

      if (getters.isUpToDate) {
        console.log("Up to date, skipping fetching of workouts...");
        return;
      } else {
        console.log("Workouts not up to date. Refreshing workouts...");
      }

      const workoutItems = await api.getWorkouts();
      commit("setList", workoutItems);
    }
  }
};
