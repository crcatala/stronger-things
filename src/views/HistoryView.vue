<template>
  <div class='HistoryView' :class='$style.root'>
    <h1>History</h1>
    <div v-if='loading' :class='$style.loading'>
      <Spinner/>
    </div>
    <template v-else>
      <div :class='$style.filters'>
        <div :class='$style.expansionToggle' v-if='expandAll' @click='collapseItems'>Collapse All</div>
        <div :class='$style.expansionToggle' v-else @click='expandItems'>Expand All</div>
      </div>
      <WorkoutSessionItem :class='$style["item-card"]' v-for='(item, index) in filteredItems' :key='index' :item='item' :expanded='item.expanded' @toggleExercises='toggleExercises(item)' />
      <div :class='$style.viewMore' v-if='filteredItems.length < items.length' @click='viewMore'>View More</div>
    </template>
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

const PAGE_INVERVAL = 25;

@Component({
  components: {
    Spinner,
    WorkoutSessionCard,
    WorkoutSessionItem
  }
})
export default class HistoryView extends Vue {
  // items: Array<any> = [];
  workoutSessions: Array<any> = [];
  loading = false;
  filteredItems = [];
  expandAll = false;

  // TODO: watch items and refresh filteredItems and count
  get items() {
    // clone because we mutate with `expanded` state and odd persisted state otherwise
    const list = this.$store.getters["workouts/list"];
    return list.map((x: any) => ({
      ...x,
      expanded: false
    }));
  }

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

  get currentUser() {
    return this.$store.getters["sessions/currentUser"];
  }

  async fetchWorkouts() {
    const query = new Parse.Query("ParseWorkout");
    query
      .include("parseOriginRoutine")
      .include("parseRoutine")
      .include("parseSetGroups.parseExercise");
    query.limit(10);
    // 10 records -> 2seconds 90k
    // 100 records -> 33seconds 900k
    // console.log(this.currentUser);
    // TODO: there's gotta be a way to reference currentUser directly
    const user = new Parse.Object("_User", { id: this.currentUser.objectId });
    query.equalTo("user", user);
    query.equalTo("isHidden", 0);
    query.descending("completionDate");

    const results = await query.find();

    const items = results.map((x: any) => x.toJSON());
    this.items = items;

    console.log("workouts", items);
    // {
    //   "where": {
    //     "user": {
    //       "__type": "Pointer",
    //       "className": "User",
    //       "objectId": "Nu3qpkeC1u"
    //     }
    //   },
    //   "include": "parseOriginRoutine,parseRoutine,parseSetGroups.parseExercise",
    //   "limit": 10,
    //   "_method": "GET",
    //   "_ApplicationId": "QbtVgYzi9iU1GNBFaGs6rPT0XtvRKMajvuYLLmTW",
    //   "_ClientVersion": "js1.11.1",
    //   "_InstallationId": "5ba7cb91-6d8e-f29b-8be2-70279cacd673",
    //   "_SessionToken": "r:3dfefd64275b1a7d60439c1516128687"
    // }
    //     "include": "parseOriginRoutine,parseRoutine,parseSetGroups.parseExercise",
    // "limit": "1000",
    // "where": {
    //   "user": {
    //     "__type": "Pointer",
    //     "className": "_User",
    //     "objectId": "Nu3qpkeC1u"
    //   }
    // }
  }

  async checkIfUpdateRequired() {
    const query = new Parse.Query("ParseWorkout");
    // query.select(["completionDate"]);
    query.select([""]);
    query.limit(1);
    // 1 records -> 150ms 1k
    // 10 records -> 150ms 2.2k
    // 100 records -> 300ms 17k
    // 500 records -> 350ms 67k
    // (somtimes slow but usually no more than 2 seconds)
    // console.log(this.currentUser);
    // TODO: there's gotta be a way to reference currentUser directly
    const user = new Parse.Object("_User", { id: this.currentUser.objectId });
    query.equalTo("user", user);
    query.equalTo("isHidden", 0);
    // Should we do by createdAt or updatedAt instead which are native?
    // because we already have all data and can sort client-side by completionDate
    // query.descending("completionDate");
    query.descending("updatedAt");

    const results = await query.find();

    const items = results.map((x: any) => x.toJSON());
    // this.items = items;

    console.log("checkIfUpdateRequired", items);
  }

  viewMore() {
    this.filteredItems = this.items.slice(
      0,
      this.filteredItems.length + PAGE_INVERVAL
    );
  }

  expandItems() {
    console.log("expandItems");
    this.filteredItems.forEach((item: any) => {
      item.expanded = true;
    });
    this.expandAll = true;
  }

  collapseItems() {
    console.log("collapseItems");
    this.filteredItems.forEach((item: any) => {
      item.expanded = false;
    });
    this.expandAll = false;
  }

  created() {
    // this.fetchWorkouts();
    // this.checkIfUpdateRequired();
    console.log("HistoryView created");
    this.$store.dispatch("workouts/refreshList");
    this.filteredItems = this.items.slice(0, PAGE_INVERVAL);
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
  margin-bottom: 48px;
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

.viewMore {
  padding: 16px;
  background-color: $color-grey-lighter;
  border-radius: 10px;
  cursor: pointer;
  text-align: center;
  text-transform: uppercase;
}

.filters {
  margin: 16px 0;
}

.expansionToggle {
  // TODO: this is exact styling from SingleSelect .selection except the display prop
  display: inline-block;
  border-radius: 5px;
  background-color: $color-grey-lighter;
  color: #000000;
  cursor: pointer;
  padding: 4px 8px;
  transition: $swift-ease-out;
  transition-property: color, background-color;

  &:hover {
    background-color: darken($color-grey-lighter, 10%);
  }
}
</style>
