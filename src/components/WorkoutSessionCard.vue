<template>
  <Card class='WorkoutSessionCard' :class='$style["item-card"]'>
    <div :class='$style["item-title"]'>{{ item.name }}</div>
    <div :class='$style["item-subtitle"]'>{{ item.workoutRoutineName }}</div>
    <div :class='$style["item-subtitle"]'>{{ formattedDate(item.startedAt) }}</div>
    <div :class='{ [$style["item-title"]]: true, [$style.exercises]: true}' @click='toggleExercises'>
      Exercises
      <span v-if='expanded'>(Expanded)</span>
      <span v-else>(Collapsed)</span>
    </div>
    <template v-if='expanded'>
      <div v-for='(exercise, exerciseIndex) in item.exercises' :key='exerciseIndex'>
        <div :class='$style["exercise-item"]'>
          <router-link :class='$style["exercise-link"]' :to='`/exercises/${exercise.exerciseId}`'>
            {{ exercise.sets.length }} x {{ exercise.name }}
          </router-link>
          <div :class='$style["exercise-item--highlight"]'>Avg 1RM = {{ calculateAverage1RM(exercise.sets) }} lb</div>
        </div>
        <!-- <div :class='[$style["exercise-item"], $style["exercise-item--highlight"]]'>
          <div>Avg 1RM</div>
          <div>{{ calculateAverage1RM(exercise.sets) }} lb</div>
        </div> -->
        <div :class='$style["exercise-item"]' v-for='(set, setIndex) in exercise.sets' :key='setIndex'>
          <div>Set {{ setIndex + 1 }}</div>
          <div>{{ set.weight }} lb x {{ set.reps }} (RPE{{ set.rpe }})</div>
        </div>
      </div>
    </template>
    <template v-else>
      <div :class='$style["exercise-item"]' v-for='(exercise, exerciseIndex) in item.exercises' :key='exerciseIndex'>
        <router-link :class='$style["exercise-link"]' :to='`/exercises/${exercise.exerciseId}`'>{{ exercise.sets.length }} x {{ exercise.name }}</router-link>
        <div>{{ exercise.sets[0].weight }} lb x {{ exercise.sets[0].reps }}</div>
      </div>
    </template>
  </Card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Card from "@/components/Card.vue";
import Http from "@/services/Http";
import { format } from "date-fns";
import { calculate1RM } from "@/services/LiftingCalculator";

@Component({
  components: {
    Card
  }
})
export default class WorkoutSessionCard extends Vue {
  @Prop() private item!: object;
  @Prop({ default: false })
  private expanded!: boolean;

  formattedDate(date: any) {
    console.log(date);
    return format(date, "hh:mma, EEEE, MMMM dd y");
  }

  calculateAverage1RM(sets: Array<any>) {
    const setsWith1RM = sets.map(set => {
      return calculate1RM({ weight: set.weight, reps: set.reps });
    });
    const average = Math.round(
      setsWith1RM.reduce((p, c) => p + c, 0) / setsWith1RM.length
    );
    return average;
  }

  toggleExercises() {
    console.log("toggleExercises");
    this.$emit("toggleExercises", this.item);
  }
}
</script>

<style lang='scss' module>
@import "@/styles/variables.scss";

.root {
  padding: 0 $app-content-gutter-spacing;
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
