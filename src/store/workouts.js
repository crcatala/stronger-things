import Parse from "@/services/Parse";
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
      const query = new Parse.Query("ParseWorkout");
      query.select([""]);
      query.limit(1);
      const user = Parse.User.current();
      query.equalTo("user", user);
      query.equalTo("isHidden", 0);
      query.descending("createdAt");

      const results = await query.find();

      const items = results.map(x => x.toJSON());
      commit("setMostRecentRemoteItem", items[0] || null);
      commit("setLastUpdateCheckedAt");

      if (getters.isUpToDate) {
        console.log("Up to date, skipping fetching of workouts...");
        return;
      } else {
        console.log("Workouts not up to date. Refreshing workouts...");
      }
      const workoutQuery = new Parse.Query("ParseWorkout");
      workoutQuery
        .include("parseOriginRoutine")
        .include("parseRoutine")
        .include("parseSetGroups.parseExercise");
      // workoutQuery.limit(10);
      workoutQuery.limit(1000);
      workoutQuery.equalTo("user", user);
      workoutQuery.equalTo("isHidden", 0);
      workoutQuery.descending("createdAt");

      const workouts = await workoutQuery.find();

      const workoutItems = workouts.map(x => x.toJSON());
      commit("setList", workoutItems);
      // console.log("getters.isUpToDate after", getters.isUpToDate);
    }
  }
};
