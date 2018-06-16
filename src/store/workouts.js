import Parse from "@/services/Parse";
import get from "lodash/get";

export default {
  namespaced: true,
  state: {
    lastUpdateCheckedAt: new Date(0),
    updatedAt: new Date(0),
    mostRecentRemoteItem: null,
    list: []
    //
  },
  getters: {
    // mostRecentRemoteItem(state) {
    //   return state.mostRecentRemoteItem;
    // }
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
    // async login({ commit }, { username = "", password = "" } = {}) {
    //   const user = await Parse.User.logIn(username, password);
    //   commit("setCurrentUser", user.toJSON());
    //   return user;
    // },

    async refreshList({ dispatch }) {
      console.log("refreshList action");
      dispatch("checkForUpdates");
      // await checkForUpdates
      // await getList
    },
    async getList() {
      // TODO:
    },

    async checkForUpdates({ commit, dispatch, getters }) {
      console.log("checkForUpdates action");
      const query = new Parse.Query("ParseWorkout");
      query.select([""]);
      query.limit(1);
      const user = Parse.User.current();
      query.equalTo("user", user);
      query.equalTo("isHidden", 0);
      // Should we do by createdAt or updatedAt instead which are native?
      // because we already have all data and can sort client-side by completionDate
      // query.descending("completionDate");
      // Is it faster to get all 1000 items withous sort? Sorting seems slow for certain queries...
      // TODO/QUESTION: Not sure what background jobs are happening that updates workouts
      // Because saw that several were updated at today, but never edited.
      // For now we will check createdAt -- knowing that it's not long-term accurate solution
      query.descending("createdAt");

      const results = await query.find();

      const items = results.map(x => x.toJSON());
      console.log("checkForUpdates", items);
      commit("setMostRecentRemoteItem", items[0] || null);
      commit("setLastUpdateCheckedAt");

      console.log("getters.isUpToDate", getters.isUpToDate);

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
      console.log("getters.isUpToDate after", getters.isUpToDate);
    }
  }
};
