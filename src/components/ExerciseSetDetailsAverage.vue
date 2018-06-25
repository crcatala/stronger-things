<template>
  <div class='ExerciseSetDetailsAverage' :class='$style.ExerciseSetDetailsAverage'>
    <div v-if='valueOnly && isWeightType'> {{ average1RM }} lb</div>
    <div v-else>
      <div v-if='emptySets'>
        No Sets Performed
      </div>
      <div v-else-if='isWeightType'>
        <div>Avg 1RM = {{ average1RM }} lb</div>
      </div>
      <div v-else>
        Unsupported
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { isWeightType } from "@/services/ExerciseType";
import { calculateAverage1RM } from "@/services/LiftingCalculator";
import { weightInPounds } from "@/services/UnitConversion";

@Component
export default class ExerciseSetDetailsAverage extends Vue {
  @Prop() private sets!: Array<any>;
  @Prop({
    default: false
  })
  private valueOnly!: boolean;

  get emptySets() {
    return this.sets.length === 0;
  }

  get exerciseType() {
    return this.sets[0].exerciseTypeValue;
  }

  get isWeightType() {
    return isWeightType(this.exerciseType);
  }

  get average1RM() {
    return calculateAverage1RM(this.sets);
  }
}
</script>

<style lang='scss' module>
@import "@/styles/variables.scss";

.ExerciseSetDetailsAverage {
  font-weight: 700;
}
</style>
