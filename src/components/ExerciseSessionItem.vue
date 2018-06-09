<template>
  <Card class='ExerciseSessionItem' :class='$style["item-card"]'>
    <!-- <div :class='$style["item-title"]'>{{ item.name }}</div> -->
    <!-- <div :class='$style["item-title"]'>{{ item.workoutRoutine.name }}</div> -->
    <!-- <div :class='$style["item-subtitle"]'>{{ item.workoutRoutineName }}</div> -->
    <div :class='{ [$style["item-title"]]: true, [$style.exercises]: true}' @click='toggleExercises'>
      <!-- Exercises <span v-if='expanded'>(Expanded)</span><span v-else>(Collapsed)</span> -->
      {{ formattedDate(item.startedAt.iso) }}
    </div>
    <!-- <div :class='$style["item-subtitle"]'>{{ formattedDate(item.startedAt.iso) }}</div> -->
    <div :class='$style["exercise-item"]'>
      <router-link :class='$style["exercise-link"]' :to='getExerciseLinkPath(item)'>
        {{ item.exerciseSets.length }} Sets
      </router-link>
      <div :class='$style["exercise-item--highlight"]'>Avg 1RM = {{ calculateAverage1RM(item.exerciseSets) }} lb</div>
    </div>
    <!-- <div :class='[$style["exercise-item"], $style["exercise-item--highlight"]]'>
      <div>Avg 1RM</div>
      <div>{{ calculateAverage1RM(exercise.sets) }} lb</div>
    </div> -->

    <div :class='$style["exercise-item"]' v-for='(set, setIndex) in item.exerciseSets' :key='setIndex'>
      <div>Set {{ setIndex + 1 }}</div>
      <!-- <div>{{ set.weight }} lb x {{ set.reps }} (RPE{{ set.rpe }})</div> -->
      <div>{{ set.weight }} lb x {{ set.reps }}</div>
    </div>
  </Card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { format } from "date-fns";
import get from "lodash/get";
import Card from "@/components/Card.vue";
import { calculate1RM } from "@/services/LiftingCalculator.js";
import { VTooltip } from "v-tooltip";

@Component({
  components: {
    Card
  },
  directives: {
    tooltip: VTooltip
  }
})
export default class ExerciseSessionItem extends Vue {
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

  getExerciseLinkPath(item: object) {
    return `/exercises/${get(item, "exercise.objectId")}`;
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
