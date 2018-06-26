<template>
  <Card class='ExerciseSessionItem'
        :class='$style["item-card"]'>
    <div :class='{ [$style["item-title"]]: true, [$style.exercises]: true}'
         @click='toggleExercises'>
      {{ formattedDate(item.createdAt) }}
    </div>
    <div :class='$style["exercise-item"]'>
      <span :class='$style["exercise-link"]'>
        {{ item.parseSetsDictionary.length }} Sets
      </span>
      <ExerciseSetDetailsAverage :sets='item.parseSetsDictionary' />
    </div>

    <div :class='$style["exercise-item"]'
         v-for='(set, setIndex) in item.parseSetsDictionary'
         :key='setIndex'>
      <div>Set {{ setIndex + 1 }}</div>
      <ExerciseSetDetails :set='set' />
    </div>
  </Card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { format } from "date-fns";
import get from "lodash/get";
import Card from "@/components/Card.vue";
import ExerciseSetDetails from "@/components/ExerciseSetDetails.vue";
import ExerciseSetDetailsAverage from "@/components/ExerciseSetDetailsAverage.vue";
import { calculate1RM } from "@/services/LiftingCalculator";
import { VTooltip } from "v-tooltip";

@Component({
  components: {
    Card,
    ExerciseSetDetails,
    ExerciseSetDetailsAverage
  },
  directives: {
    tooltip: VTooltip
  }
})
export default class ExerciseSessionItem extends Vue {
  @Prop() private item!: object;
  @Prop({ default: false })
  private expanded!: boolean;

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
