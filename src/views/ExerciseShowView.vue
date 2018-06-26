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
        <ExercisePersonalRecordsContainer :sessions='sessions' />
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
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import flatten from "lodash/flatten";
import get from "lodash/get";
import Card from "@/components/Card.vue";
import ExerciseInstructionsCard from "@/components/ExerciseInstructionsCard.vue";
import ExercisePersonalRecordsContainer from "@/components/ExercisePersonalRecordsContainer.vue";
import ExerciseSessionItem from "@/components/ExerciseSessionItem.vue";
import ExerciseHistoryChart from "@/components/ExerciseHistoryChart.vue";
import EmptyResults from "@/components/EmptyResults.vue";
import Spinner from "@/components/Spinner.vue";
import { getExerciseTypeName } from "@/services/ExerciseType";
import { getExerciseBodyPartName } from "@/services/ExerciseBodyPart";
import api from "@/api";
import { calculateAverage1RM } from "@/services/LiftingCalculator";

@Component({
  components: {
    Spinner,
    Card,
    ExerciseInstructionsCard,
    ExercisePersonalRecordsContainer,
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

  get xAxisData() {
    return this.sessions.map((x: any) => x.createdAt);
  }

  // TODO make the chart calculate this OR make one form of session object used everywhere
  // that calculates everything
  get chartData() {
    return this.sessions.map((session: any) => {
      return {
        x: session.createdAt,
        y: calculateAverage1RM(session.parseSetsDictionary)
      };
    });
  }

  get bodyPartName() {
    return getExerciseBodyPartName(get(this, "item.bodyParts"));
  }

  get categoryName() {
    return getExerciseTypeName(get(this, "item.exerciseType"));
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
      this.item = await api.getExerciseItem({ id: this.id });
    } catch (e) {
      this.$notify({
        group: "main",
        type: "error",
        title: "Error loading exercise"
      });
    } finally {
      this.loading = false;
    }
  }

  created() {
    this.fetchExercise();
  }
}
</script>

<style lang='scss' module>
@import "@/styles/variables.scss";

.ExerciseShowView {
  padding: 0 $app-content-gutter-spacing;
}

.loading {
  padding: 24px 0;
  text-align: center;
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
</style>
