<template>
  <div :class='$style.ExerciseShowView'>
    <div v-if='loading' :class='$style.loading'>
      <Spinner/>
    </div>
    <div v-else-if='item'>
      <h1 :class='$style.name'>
        {{ item.name }}
        <span :class='$style.meta'>
          {{ bodyPartName }} ({{ categoryName }})
        </span>
      </h1>
      <ExerciseInstructionsCard :instructions='item.instructions' />
      <template v-if='sessions.length'>
        <ExercisePersonalRecords :oneRepMax='record1RM' :weight='recordWeight' :rep='recordReps' :volume='recordVolume' />
        <Card :class='$style.summary'>
          <div :class='$style.chartContainer'>
            <ExerciseHistoryChart v-if='xAxisData.length' :class='$style.chart' :xAxisData='xAxisData' :chartData='chartData' />
          </div>
        </Card>
        <h2>History</h2>
        <ExerciseSessionItem v-if='sessions.length' v-for='(session, index) in sessions' :item='session' :key='index' />
      </template>
      <EmptyResults :class='$style.emptyResults' v-else>No Recorded Sessions for this Exercise</EmptyResults>
    </div>
    <div v-else>
      Failed to load Exercise
      <span v-if='error'>: {{ error }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import get from "lodash/get";
import maxBy from "lodash/maxBy";
import max from "lodash/max";
import flatten from "lodash/flatten";
import Card from "@/components/Card.vue";
import ExerciseInstructionsCard from "@/components/ExerciseInstructionsCard.vue";
import ExercisePersonalRecords from "@/components/ExercisePersonalRecords.vue";
import ExerciseSessionItem from "@/components/ExerciseSessionItem.vue";
import ExerciseHistoryChart from "@/components/ExerciseHistoryChart.vue";
import EmptyResults from "@/components/EmptyResults.vue";
import Spinner from "@/components/Spinner.vue";
import { getExerciseTypeName } from "@/services/ExerciseType";
import { getExerciseBodyPartName } from "@/services/ExerciseBodyPart";
import Parse from "@/services/Parse";
import { calculateAverage1RM } from "@/services/LiftingCalculator";
import { weightInPounds } from "@/services/UnitConversion";

@Component({
  components: {
    Spinner,
    Card,
    ExerciseInstructionsCard,
    ExercisePersonalRecords,
    ExerciseSessionItem,
    ExerciseHistoryChart,
    EmptyResults
  }
})
export default class ExerciseShowView extends Vue {
  @Prop() private id!: string;

  item = null;
  loading: boolean = true;
  error: string = "";
  // sessions = [];

  get xAxisData() {
    // return this.sessions.map((x: any) => x.startedAt.iso);
    return this.sessions.map((x: any) => x.createdAt);
    // return this.sessions.map((x: any) => new Date(x.startedAt.iso));
  }

  // TODO make the chart calculate this OR make one form of session object used everywhere
  // that calculates everything
  get chartData() {
    return this.sessions.map((session: any) => {
      return {
        // x: session.startedAt.iso,
        x: session.createdAt,
        y: calculateAverage1RM(session.parseSetsDictionary)
      };
    });
  }

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
    if (this.sessions.length) {
      console.log("record1RM this.chartData", this.chartData);
      const obj = maxBy(this.chartData, "y");
      return obj ? obj.y : null;
    } else {
      return null;
    }
  }

  get currentUser() {
    return this.$store.getters["sessions/currentUser"];
  }

  async fetchExerciseHistory() {
    try {
      this.loading = true;
      const query = new Parse.Query("ParseSetGroup");
      query.limit(1);

      const results = await query.find();
      const items = results.map((x: any) => x.toJSON());
      console.log("exercise history", items);
    } catch (e) {
      console.log("error", e);
    } finally {
      this.loading = false;
    }
  }

  get bodyPartName() {
    return getExerciseBodyPartName(this.item.bodyParts);
  }

  get categoryName() {
    return getExerciseTypeName(this.item.exerciseType);
  }
  get workouts() {
    return this.$store.getters["workouts/list"];
  }

  get exerciseGroupsFromWorkoutHistory() {
    const parseSetGroups = this.workouts.map((workout: any) => {
      return workout.parseSetGroups;
    });

    const parseSetGroupsFlattened = flatten(parseSetGroups);

    return parseSetGroupsFlattened.filter((group: any) => {
      return group.parseExercise.objectId === this.id;
    });
  }

  get sessions() {
    return this.exerciseGroupsFromWorkoutHistory;
  }

  async fetchExercise() {
    try {
      this.loading = true;
      const query = new Parse.Query("ParseExercise");
      const result = await query.get(this.id);
      this.item = result.toJSON();
    } catch (e) {
      console.log("TODO show error notification");
    } finally {
      this.loading = false;
    }
  }

  created() {
    this.fetchExercise();
    // this.fetchExerciseHistory();
    // this.checkIfUpdateRequired();
    // this.getExerciseGroupsFromWorkoutHistory();
  }
}
</script>

<style lang='scss' module>
@import "@/styles/variables.scss";

.loading {
  padding: 24px 0;
  text-align: center;
}

.ExerciseShowView {
  padding: 0 $app-content-gutter-spacing;
}

.instructions {
  padding: 16px;
}

.summary {
  padding: 16px;
}

.name {
  margin-bottom: 24px;
}

.meta {
  font-size: 0.8em;
  font-style: italic;
  color: $color-grey;
  margin-bottom: 6px;
  font-weight: 300;
}

.chart {
  width: 100%;
  height: 400px;
}

.recordList {
  display: flex;
  justify-content: space-evenly;
  margin: 24px 0;
}

.record {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  box-shadow: $shadow-medium;
  width: 280px;
  height: 160px;
}

.recordSubtitle {
  font-size: 16px;
}
.record1 {
  background: rgb(242, 74, 114);
  background: linear-gradient(
    180deg,
    rgba(242, 74, 114, 1) 0%,
    rgba(72, 97, 247, 1) 100%
  );
}

.record2 {
  background: rgb(34, 193, 195);
  background: linear-gradient(
    0deg,
    rgba(34, 193, 195, 1) 0%,
    rgba(253, 187, 45, 1) 100%
  );
}

.record3 {
  background: rgb(0, 180, 219);
  background: linear-gradient(
    180deg,
    rgba(0, 180, 219, 1) 0%,
    rgba(0, 131, 176, 1) 100%
  );
}

.record4 {
  background: rgb(218, 68, 83);
  background: linear-gradient(
    180deg,
    rgba(218, 68, 83, 1) 0%,
    rgba(137, 33, 107, 1) 100%
  );
}

.record5 {
  background: rgb(128, 0, 128);
  background: linear-gradient(
    180deg,
    rgba(128, 0, 128, 1) 0%,
    rgba(255, 192, 203, 1) 100%
  );
}

.record6 {
  background: rgb(0, 176, 155);
  background: linear-gradient(
    180deg,
    rgba(0, 176, 155, 1) 0%,
    rgba(150, 201, 61, 1) 100%
  );
}

.record7 {
  background: rgb(253, 200, 48);
  background: linear-gradient(
    180deg,
    rgba(253, 200, 48, 1) 0%,
    rgba(243, 115, 53, 1) 100%
  );
}

.record8 {
  background: rgb(41, 128, 185);
  background: linear-gradient(
    180deg,
    rgba(41, 128, 185, 1) 0%,
    rgba(109, 213, 250, 1) 100%
  );
}

.recordIcon {
  width: 64px;
  height: 64px;
  fill: $color-white;
  margin-right: 10px;
}

.recordValue {
  color: $color-white;
  font-size: 40px;
  font-weight: 700;
}

.recordLabel {
  color: $color-white;
  font-size: 20px;
  font-weight: 300;
}
</style>
