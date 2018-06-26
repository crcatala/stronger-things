<template>
  <div :class='$style.ExercisesView'>
    <div :class='$style.header'>
      <h1>Exercises</h1>
      <div>
        <InputField placeholder='Search...'
                    v-model='searchInput'
                    :class='$style.input'
                    @submit='search'
                    autoSubmit
                    clearable/>
      </div>
      <ExerciseCreateAction/>
    </div>
    <div :class='$style.filters'>
      <div>
        <div :class='$style.filterItem'>
          <ExerciseBodyPartSelect @select='bodyPartSelected' />
        </div>
        <div :class='$style.filterItem'>
          <ExerciseTypeSelect @select='exerciseTypeSelected' />
        </div>
      </div>
    </div>
    <div v-if='loading'
         :class='$style.loading'>
      <Spinner/>
    </div>
    <ExerciseList :items='filteredItems'
                  v-else-if='filteredItems.length' />
    <div v-else
         :class='$style.loading'>
      <EmptyResults v-if='searchFilter'>No Results Matching Filter</EmptyResults>
      <EmptyResults v-else>No Exercises</EmptyResults>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import get from "lodash/get";
import Multiselect from "@/components/Multiselect";
import ExerciseBodyPartSelect from "@/components/ExerciseBodyPartSelect.vue";
import ExerciseTypeSelect from "@/components/ExerciseTypeSelect.vue";
import ExerciseList from "@/components/ExerciseList.vue";
import ExerciseCreateAction from "@/components/ExerciseCreateAction.vue";
import InputField from "@/components/InputField.vue";
import Spinner from "@/components/Spinner.vue";
import EmptyResults from "@/components/EmptyResults.vue";
import api from "@/api";

@Component({
  components: {
    Multiselect,
    ExerciseBodyPartSelect,
    ExerciseTypeSelect,
    ExerciseList,
    ExerciseCreateAction,
    InputField,
    Spinner,
    EmptyResults
  }
})
export default class ExercisesView extends Vue {
  loading: boolean = false;
  items: Array<object> = [];
  exerciseTypeFilter: any = null;
  bodyPartFilter: any = null;
  searchInput: string = "";
  searchFilter: string = ""; // Actual filter, lags behind input

  get filteredItems() {
    // TODO: Use more elegant reduce method or bring in library
    const itemsMatchingFilters = this.items.filter((item: any) => {
      const matchesBodyPart =
        this.bodyPartFilter && this.bodyPartFilter.id === item.bodyParts;
      const matchesExerciseType =
        this.exerciseTypeFilter &&
        this.exerciseTypeFilter.id === item.exerciseType;

      if (this.bodyPartFilter && this.exerciseTypeFilter) {
        return matchesBodyPart && matchesExerciseType;
      }

      if (this.bodyPartFilter) {
        return matchesBodyPart;
      }

      if (this.exerciseTypeFilter) {
        return matchesExerciseType;
      }

      return true;
    });

    if (this.searchFilter) {
      return itemsMatchingFilters.filter((item: any) => {
        return item.name
          .toLowerCase()
          .includes(this.searchFilter.toLowerCase());
      });
    }

    return itemsMatchingFilters;
  }

  search() {
    this.searchFilter = this.searchInput;
  }

  bodyPartSelected(item: any) {
    this.bodyPartFilter = item;
  }

  exerciseTypeSelected(item: any) {
    this.exerciseTypeFilter = item;
  }

  async fetchExercises() {
    try {
      this.loading = true;
      this.items = await api.getExerciseList();
    } catch (e) {
      this.$notify({
        group: "main",
        type: "error",
        title: "Error fetching exercises."
      });
    } finally {
      this.loading = false;
    }
  }

  created() {
    this.fetchExercises();
  }
}
</script>

<style lang='scss' module>
@import "@/styles/variables.scss";

.ExercisesView {
  padding: 0 $app-content-gutter-spacing;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.input {
  width: 400px;
}

.loading {
  padding: 24px 0;
  text-align: center;
}

.filters {
  justify-content: center;
  text-align: center;
  margin: 0 0 16px;
}

.filterItem {
  display: inline-block;
  margin: 0 6px;
}
</style>
