import Parse from "@/services/Parse";

const WORKOUT_CLASS = "ParseWorkout";
const EXERCISE_CLASS = "ParseExercise";
const ROUTINE_CLASS = "ParseRoutine";

export default {
  async getLatestWorkout() {
    const user = Parse.User.current();
    const query = new Parse.Query(WORKOUT_CLASS);
    query.select([""]);
    query.limit(1);
    query.equalTo("user", user);
    query.equalTo("isHidden", 0);
    query.descending("createdAt");

    const result = await query.first();
    const item = result.toJSON();

    return item;
  },
  async getWorkouts({ limit = 1000 }: { limit?: number } = {}) {
    const user = Parse.User.current();
    const query = new Parse.Query(WORKOUT_CLASS);
    query
      .include("parseOriginRoutine")
      .include("parseRoutine")
      .include("parseSetGroups.parseExercise");
    query.limit(limit);
    query.equalTo("user", user);
    query.equalTo("isHidden", 0);
    query.descending("createdAt");

    const results = await query.find();

    const items = results.map((x: any) => x.toJSON());

    return items;
  },
  async getExerciseList({
    limit = 1000,
    sortKey = "name"
  }: { limit?: number; sortKey?: string } = {}) {
    const query = new Parse.Query(EXERCISE_CLASS);
    query.equalTo("isGlobal", true);
    query.doesNotExist("user");
    query.ascending(sortKey);
    query.limit(limit);

    const results = await query.find();
    const items = results.map((x: any) => x.toJSON());

    return items;
  },
  async getExerciseItem({ id = -1 }: { id?: number | string } = {}) {
    const query = new Parse.Query(EXERCISE_CLASS);
    const result = await query.get(id);

    return result.toJSON();
  },
  async getRoutineList({ limit = 100 }: { limit?: number } = {}) {
    const user = Parse.User.current();
    const query = new Parse.Query(ROUTINE_CLASS);
    query.limit(limit);
    query.equalTo("user", user);

    const results = await query.find();

    return results.map((x: any) => x.toJSON());
  }
};
