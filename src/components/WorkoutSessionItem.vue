<template>
  <Card class='WorkoutSessionItem' :class='$style["item-card"]'>
    <div :class='$style["item-title"]'>{{ item.name }}</div>
    <!-- <div :class='$style["item-title"]'>{{ item.workoutRoutine.name }}</div> -->
    <!-- <div :class='$style["item-subtitle"]'>{{ item.workoutRoutineName }}</div> -->
    <div :class='$style["item-subtitle"]'>{{ formattedDate }}</div>
    <!-- TODO: duration can be computed from completionDate and startDate -->
    <!-- <div :class='$style["item-subtitle"]'>{{ formattedDate(item.startDate.iso) }}</div> -->
    <div :class='{ [$style["item-title"]]: true, [$style.exercises]: true}' @click='toggleExercises'>
      Exercises
      <!-- <span v-if='expanded'>(Expanded)</span>
      <span v-else>(Collapsed)</span> -->
      <ChevronUpIcon v-if='expanded' :class='$style.expandIcon' />
      <ChevronDownIcon v-else :class='$style.expandIcon' />
    </div>
    <div v-show='expanded'>
      <div v-for='(parseSetGroup, parseSetGroupsIndex) in item.parseSetGroups' :key='`expanded--${parseSetGroupsIndex}`' :class='$style.expandedSetGroupWrapper'>
        <div :class='$style.expandedSetGroupWrapperLeft'>
          <div :class='$style["exercise-item--expanded"]'>
            <router-link :class='$style["exercise-link--expanded"]' :to='getExerciseLinkPath(parseSetGroup)'>
              {{ parseSetGroup.parseSetsDictionary.length }} x {{ parseSetGroup.parseExercise.name }}
            </router-link>
            <ExerciseSetDetailsAverage :sets='parseSetGroup.parseSetsDictionary' />
          </div>

          <div :class='[$style["exercise-item"]]' v-for='(set, setIndex) in parseSetGroup.parseSetsDictionary' :key='setIndex'>
            <div>Set {{ setIndex + 1 }}</div>
            <ExerciseSetDetails :set='set' />
          </div>
        </div>
        <div :class='$style.historyWrapper'>
          <div :class='$style.historyItem' v-for='parseSetGroup in historyForExercise(parseSetGroup.parseExercise.objectId)'>
            <ExerciseSetDetailsAverage :sets='parseSetGroup.parseSetsDictionary' valueOnly />
            <span :class='$style.timeAgo'>({{ timeAgo(parseSetGroup.createdAt) }})</span>
          </div>
          <!-- {{ historyForExercise(parseSetGroup.parseExercise.objectId).length }} More Stuff ============= -->
        </div>
      </div>
    </div>
    <div v-show='!expanded'>
      <div :class='$style["exercise-item"]' v-for='(parseSetGroup, parseSetGroupsIndex) in item.parseSetGroups' :key='`collapsed--${parseSetGroupsIndex}`'>
        <router-link :class='$style["exercise-link"]' :to='getExerciseLinkPath(parseSetGroup)'>{{ parseSetGroup.parseSetsDictionary.length }} x {{ parseSetGroup.parseExercise.name }}</router-link>
        <ExerciseSetDetails v-if='parseSetGroup.parseSetsDictionary[0]' :set='parseSetGroup.parseSetsDictionary[0]' />
        <div v-else>No Sets Peformed</div>
      </div>
    </div>
  </Card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import format from "date-fns/format";
import formatDistanceStrict from "date-fns/formatDistanceStrict";
import get from "lodash/get";
import Card from "@/components/Card.vue";
import { calculateAverage1RM } from "@/services/LiftingCalculator";
import { VTooltip } from "v-tooltip";
import ChevronDownIcon from "@/assets/icons/font-awesome/chevron-down.svg";
import ChevronUpIcon from "@/assets/icons/font-awesome/chevron-up.svg";
import ExerciseSetDetailsAverage from "@/components/ExerciseSetDetailsAverage.vue";
import ExerciseSetDetails from "@/components/ExerciseSetDetails.vue";
import flatten from "lodash/flatten";

@Component({
  components: {
    Card,
    ChevronDownIcon,
    ChevronUpIcon,
    ExerciseSetDetailsAverage,
    ExerciseSetDetails
  },
  directives: {
    tooltip: VTooltip
  }
})
export default class WorkoutSessionItem extends Vue {
  @Prop() private item!: object;
  @Prop({ default: false })
  private expanded!: boolean;

  get parseSetGroups() {
    const groups = this.workouts.map((workout: any) => {
      // TODO: filter out potentail nulls?
      return workout.parseSetGroups;
    });

    return flatten(groups);
  }

  get workouts() {
    return this.$store.getters["workouts/list"];
  }

  get linkPath() {
    // return { name: "ExerciseShowView", params: { id: this.item.objectId }}
    return "/";
  }

  get bodyPartName() {
    return get(this.item, "bodyPart.name");
  }

  get categoryName() {
    return get(this.item, "category.name");
  }

  get formattedDate() {
    // TODO: not sure if to use completionDate or something else
    // because not all workouts have completionDate (some data integrity or old builds perhaps?)
    if (this.item.createdAt) {
      return format(this.item.createdAt, "hh:mma, EEEE, MMMM dd y");
    } else {
      return null;
    }
  }

  getExerciseLinkPath(parseSetGroup: object) {
    return `/exercises/${get(parseSetGroup, "parseExercise.objectId")}`;
  }

  toggleExercises() {
    console.log("toggleExercises", this.item);
    this.$emit("toggleExercises", this.item);
  }

  historyForExercise(exerciseId: string | number) {
    // TODO: guard nested value not existing with lodash get
    const recentSessions = this.parseSetGroups
      .filter((x: any) => x.parseExercise.objectId === exerciseId)
      .slice(1, 6);
    // TOOD: ooof so scrolling in history, we need to find appropriate start date...
    // maybe do a filter on date > or < the date
    // "days ago" should mean days prior/relative to the current viewed workout
    // Note that slice ignores first one because that's the current workout

    // recentSession.parseSetsDictionary;
    return recentSessions;
  }

  timeAgo(date) {
    return formatDistanceStrict(date, new Date(), {
      addSuffix: true,
      unit: "day"
    });
  }
  // created() {
  //   console.log("WorkoutSessionItem", this.item.objectId);
  // }
}

WorkoutSessionItem.prototype.calculateAverage1RM = calculateAverage1RM;
</script>

<style lang="scss" module>
@import "@/styles/variables.scss";
@import "@/styles/mixins.scss";

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
  user-select: none;
  margin-bottom: 6px;
}

.item-subtitle {
  font-size: 1em;
  color: $color-grey;
}

.expandIcon {
  width: 20px;
  height: 20px;
  fill: $color-grey-dark;
}

.exercises {
  margin-top: 16px;
  margin-bottom: 4px;
  cursor: pointer;
}

.exercise-item {
  max-width: 400px;
  font-size: 1em;
  color: $color-grey;
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;

  &:last-child {
    margin-bottom: 4px;
  }

  &--highlight {
    font-weight: 700;
  }
}

.exercise-link {
  text-decoration: none;
  color: $color-grey;
}

.expandedSetGroupWrapperLeft {
  width: 400px;
}

.expandedSetGroupWrapper {
  display: flex;
  color: $color-grey-dark;
}

.historyWrapper {
  display: flex;
}

.historyItem {
  margin-left: 45px;
}

.exercise-item--expanded {
  max-width: 400px;
  font-size: 1em;
  color: $color-grey-dark;
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;

  &:last-child {
    margin-bottom: 4px;
  }

  &--highlight {
    font-weight: 700;
  }
}

.exercise-link--expanded {
  text-decoration: none;
  color: $color-grey-dark;
}

.timeAgo {
  color: $color-grey;
}
</style>
