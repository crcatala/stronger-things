<template>
  <ExercisePersonalRecords :oneRepMax='record1RM' :weight='recordWeight' :rep='recordReps' :volume='recordVolume' />
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import ExercisePersonalRecords from "@/components/ExercisePersonalRecords.vue";
import { weightInPounds } from "@/services/UnitConversion";
import maxBy from "lodash/maxBy";
import max from "lodash/max";
import flatten from "lodash/flatten";
import { calculateAverage1RM } from "@/services/LiftingCalculator";

@Component({
  components: {
    ExercisePersonalRecords
  }
})
export default class ExercisePersonalRecordsContainer extends Vue {
  // sessions is list of ParseSetGroup's
  @Prop() private sessions!: Array<any>;

  get volumeData() {
    return this.sessions.map((session: any) => {
      return session.parseSetsDictionary.reduce(
        (acc: any, val: any) => acc + weightInPounds(val.kilograms) * val.reps,
        0
      );
    });
  }

  get recordVolume() {
    return max(this.volumeData);
  }

  get recordWeightAndReps() {
    const weightAndReps = this.sessions.map((session: any) => {
      return session.parseSetsDictionary.map((set: any) => {
        return {
          weight: weightInPounds(set.kilograms),
          reps: set.reps
        };
      });
    });

    const flattened = flatten(weightAndReps);

    return maxBy(flattened, "weight");
  }

  get recordWeight() {
    return this.recordWeightAndReps ? this.recordWeightAndReps.weight : null;
  }

  get recordReps() {
    return this.recordWeightAndReps ? this.recordWeightAndReps.reps : null;
  }

  get record1RM() {
    return max(this.oneRepMaxList);
  }

  get oneRepMaxList() {
    return this.sessions.map((session: any) => {
      return calculateAverage1RM(session.parseSetsDictionary);
    });
  }
}
</script>
