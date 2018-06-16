<template>
  <div class='HistoryView' :class='$style.root'>
    <h1>History</h1>
    <div v-if='loading' :class='$style.loading'>
      <Spinner/>
    </div>
    <WorkoutSessionItem v-else :class='$style["item-card"]' v-for='(item, index) in workoutSessions' :key='index' :item='item' :expanded='item.expanded' @toggleExercises='toggleExercises(item)' />
  </div>
</template>

<script lang="ts">
import Parse from "@/services/Parse";
import { Component, Prop, Vue } from "vue-property-decorator";
import WorkoutSessionCard from "@/components/WorkoutSessionCard.vue";
import WorkoutSessionItem from "@/components/WorkoutSessionItem.vue";
import Spinner from "@/components/Spinner.vue";
import Http from "@/services/Http";
import { format } from "date-fns";

@Component({
  components: {
    Spinner,
    WorkoutSessionCard,
    WorkoutSessionItem
  }
})
export default class HistoryView extends Vue {
  items: Array<any> = [];
  workoutSessions: Array<any> = [];
  loading = false;

  // fetchExerciseSessionsForWorkout(workoutSession) {

  // }

  async fetchWorkoutSessions() {
    console.log("fetchWorkoutSessions...");
    const query = new Parse.Query("WorkoutSession");
    // query.include('category').include('bodyPart');
    query
      .include("exerciseSessions")
      .include("workoutRoutine")
      .include("user");
    // query.include("workoutRoutine").include("user");
    // query.matches("name", searchFilter, "i")
    query.limit(10);
    try {
      this.loading = true;
      const results = await query.find();
      const workoutSessions = results.map((x: any) => ({
        ...x.toJSON(),
        expanded: false
      }));

      const promises = results.map((result: any) => {
        const relation = result.relation("exerciseSessions");
        const query = relation.query().include("exercise");
        return query.find();
      });

      const exerciseSessionsResults: Array<any> = await Promise.all(promises);

      workoutSessions.forEach((workoutSession: any, index: number) => {
        // Yes we are mutating
        workoutSession.exerciseSessions = exerciseSessionsResults[index].map(
          (x: any) => x.toJSON()
        );
      });

      this.workoutSessions = workoutSessions;
    } catch (e) {
      console.log("TODO show error notification");
    } finally {
      this.loading = false;
    }
  }

  async created() {
    // const { data } = await Http.get("workoutSessions");
    // const items = data.map((x: any) => {
    //   return { ...x, expanded: false }
    // });
    // this.items = items;
    // this.fetchWorkoutSessions();
  }

  toggleExercises(item: any) {
    console.log("HistoryView toggleExercises", item);
    item.expanded = !item.expanded;
  }
}
</script>

<style lang='scss' module>
@import "@/styles/variables.scss";

.root {
  padding: 0 $app-content-gutter-spacing;
}

.loading {
  padding: 24px 0;
  text-align: center;
}

.item-card {
  padding: 16px;
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0px;
  }
}

.item-title {
  font-size: 1.4em;
  color: $color-grey-dark;
}

.item-subtitle {
  font-size: 1em;
  color: $color-grey;
}

.exercises {
  margin-top: 16px;
  margin-bottom: 4px;
}

.exercise-item {
  max-width: 360px;
  font-size: 1em;
  color: $color-grey;
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;

  &:last-child {
    margin-bottom: 4px;
  }
}

.exercise-link {
  text-decoration: none;
  color: $color-grey;
}
</style>
