<template>
  <div class='ExerciseSetDetails' :class='$style.ExerciseSetDetails'>
    <div v-if='isWeightType'>
      {{ weight }} lbs x {{ set.reps || set.expectedReps }}
    </div>
    <div v-else-if='isCardioType'>
      {{ distance }} mi / {{ duration }} s
    </div>
    <div v-else>
      Unsupported
    </div>
    <!-- TODO: handle duration type -->
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { isWeightType, isCardioType } from "@/services/ExerciseType";
import { weightInPounds, distanceInMiles } from "@/services/UnitConversion";

@Component
export default class ExerciseSetDetails extends Vue {
  @Prop() private set!: any;
  get isWeightType() {
    return isWeightType(this.set.exerciseTypeValue);
  }

  get isCardioType() {
    return isCardioType(this.set.exerciseTypeValue);
  }

  get weight() {
    if (this.set.kilograms) {
      return weightInPounds(this.set.kilograms);
    } else {
      return "---";
    }
  }

  get distance() {
    if (this.set.meters) {
      return distanceInMiles(this.set.meters).toFixed(2);
    } else {
      return "";
    }
  }

  get duration() {
    if (this.set.seconds) {
      return Math.round(this.set.seconds / 60);
    } else {
      return "";
    }
  }
}
</script>

<style lang='scss' module>
@import "@/styles/variables.scss";

.ExerciseSetDetails {
  //
}
</style>
