<template>
  <Card class='WorkoutSessionItem' :class='$style["item-card"]'>
    <!-- <div :class='$style["item-title"]'>{{ item.name }}</div> -->
    <div :class='$style["item-title"]'>{{ item.workoutRoutine.name }}</div>
    <div :class='$style["item-subtitle"]'>{{ item.workoutRoutineName }}</div>
    <div :class='$style["item-subtitle"]'>{{ formattedDate(item.startedAt.iso) }}</div>
    <div :class='{ [$style["item-title"]]: true, [$style.exercises]: true}' @click='toggleExercises'>
      Exercises
      <!-- <span v-if='expanded'>(Expanded)</span>
      <span v-else>(Collapsed)</span> -->
      <ChevronUpIcon v-if='expanded' :class='$style.expandIcon' />
      <ChevronDownIcon v-else :class='$style.expandIcon' />
    </div>
    <template v-if='expanded'>
      <div v-for='(exerciseSession, exerciseSessionsIndex) in item.exerciseSessions' :key='exerciseSessionsIndex'>
        <div :class='$style["exercise-item"]'>
          <router-link :class='$style["exercise-link"]' :to='getExerciseLinkPath(exerciseSession)'>
            {{ exerciseSession.exerciseSets.length }} x {{ exerciseSession.exercise.name }}
          </router-link>
          <div :class='$style["exercise-item--highlight"]'>Avg 1RM = {{ calculateAverage1RM(exerciseSession.exerciseSets) }} lb</div>
        </div>
        <!-- <div :class='[$style["exercise-item"], $style["exercise-item--highlight"]]'>
          <div>Avg 1RM</div>
          <div>{{ calculateAverage1RM(exercise.sets) }} lb</div>
        </div> -->

        <div :class='$style["exercise-item"]' v-for='(set, setIndex) in exerciseSession.exerciseSets' :key='setIndex'>
          <div>Set {{ setIndex + 1 }}</div>
          <!-- <div>{{ set.weight }} lb x {{ set.reps }} (RPE{{ set.rpe }})</div> -->
          <div>{{ set.weight }} lb x {{ set.reps }}</div>
        </div>

        <!-- <div>{{ exerciseSession.exercise.name }}</div>
        <div>{{ exerciseSession.exerciseSets.length }}</div>
        <div v-for='exerciseSet in exerciseSession.exerciseSets'>
          <div>{{ exerciseSet.weight }}</div>
          <div>{{ exerciseSet.reps }}</div>
          <div>{{ exerciseSet.rpe }}</div>
          <div>{{ exerciseSet.tempo }}</div>
          <div>{{ exerciseSet.amrap }}</div>
          <div>{{ exerciseSet.restDuration }}</div>
        </div> -->
      </div>
    </template>
    <template v-else>
      <div :class='$style["exercise-item"]' v-for='(exerciseSession, exerciseSessionsIndex) in item.exerciseSessions' :key='exerciseSessionsIndex'>
        <router-link :class='$style["exercise-link"]' :to='getExerciseLinkPath(exerciseSession)'>{{ exerciseSession.exerciseSets.length }} x {{ exerciseSession.exercise.name }}</router-link>
        <div>{{ exerciseSession.exerciseSets[0].weight }} lb x {{ exerciseSession.exerciseSets[0].reps }}</div>
      </div>
    </template>
  </Card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { format } from "date-fns";
import get from "lodash/get";
import Card from "@/components/Card.vue";
import { calculate1RM } from "@/services/LiftingCalculator.js";
import { VTooltip } from "v-tooltip";
import ChevronDownIcon from "@/assets/icons/font-awesome/chevron-down.svg";
import ChevronUpIcon from "@/assets/icons/font-awesome/chevron-up.svg";

@Component({
  components: {
    Card,
    ChevronDownIcon,
    ChevronUpIcon
  },
  directives: {
    tooltip: VTooltip
  }
})
export default class WorkoutSessionItem extends Vue {
  @Prop() private item!: object;
  @Prop({ default: false })
  private expanded!: boolean;

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

  // TODO getter
  formattedDate(date: any) {
    return format(date, "hh:mma, EEEE, MMMM dd y");
  }

  getExerciseLinkPath(exerciseSession: object) {
    return `/exercises/${get(exerciseSession, "exercise.objectId")}`;
  }

  calculateAverage1RM(sets: Array<any>) {
    // console.log(sets)
    const setsWith1RM = sets.map(set => {
      return calculate1RM({ weight: set.weight, rpe: set.rpe, reps: set.reps });
    });
    console.log(setsWith1RM);
    const average = Math.round(
      setsWith1RM.reduce((p, c) => p + c, 0) / setsWith1RM.length
    );
    // console.log(test)
    return average;
  }

  toggleExercises() {
    console.log("toggleExercises", this.item);
    this.$emit("toggleExercises", this.item);
  }
}
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
  max-width: 360px;
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
</style>
