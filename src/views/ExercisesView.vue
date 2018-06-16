<template>
  <div :class='$style.ExercisesView'>
    <div :class='$style.header'>
      <h1>Exercises</h1>
      <div>
        <InputField placeholder='Search...' v-model='searchInput' :class='$style.input' @submit='search' autoSubmit clearable/>
      </div>
      <AppButton @click.native='newClicked'>New</AppButton>
    </div>
    <div :class='$style.filters'>
      <div>
        <div :class='$style.filterItem'>
          <SingleSelect :options='bodyPartOptions' trackBy='id' label='name' noSelectionText="Any Body Part" @select='bodyPartSelected' />
        </div>
        <div :class='$style.filterItem'>
          <SingleSelect :options='exerciseTypeOptions' trackBy='id' label='name' noSelectionText="Any Category" @select='exerciseTypeSelected' />
        </div>
      </div>
    </div>
    <div v-if='loading' :class='$style.loading'>
      <Spinner/>
    </div>
    <ExerciseList :items='filteredItems' v-else-if='filteredItems.length' />
    <div v-else :class='$style.loading'>
      <EmptyResults/>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import get from "lodash/get";
import Multiselect from "@/components/Multiselect";
import SingleSelect from "@/components/SingleSelect.vue";
import ExerciseList from "@/components/ExerciseList.vue";
import AppButton from "@/components/AppButton.vue";
import InputField from "@/components/InputField.vue";
import Spinner from "@/components/Spinner.vue";
import EmptyResults from "@/components/EmptyResults.vue";
import ExerciseNew from "@/components/ExerciseNew.vue";
import { EXERCISE_BODY_PART_OPTIONS } from "@/services/ExerciseBodyPart";
import { EXERCISE_TYPE_OPTIONS } from "@/services/ExerciseType";
import Http from "@/services/Http";
import Parse from "@/services/Parse";

@Component({
  components: {
    Multiselect,
    SingleSelect,
    ExerciseList,
    AppButton,
    InputField,
    Spinner,
    EmptyResults,
    ExerciseNew
  }
})
export default class ExercisesView extends Vue {
  @Prop() private msg!: string;

  loading: boolean = false;
  items: Array<object> = [];
  exerciseTypeFilter: any = null;
  bodyPartFilter: any = null;
  searchInput: string = "";
  searchFilter: string = ""; // Actual filter, lags behind input

  get bodyPartOptions() {
    return EXERCISE_BODY_PART_OPTIONS;
  }

  get exerciseTypeOptions() {
    return EXERCISE_TYPE_OPTIONS;
  }

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

  closeModal() {
    console.log("closeModal");
    this.$modal.hide("ExerciseNew");
  }

  newClicked() {
    // this.$modal.show(MyComponent, {
    //   text: 'This text is passed as a property'
    // }, {
    //   draggable: true
    // })
    const onSuccess = () => {
      console.log("success callback");
      console.log(this);
      this.closeModal();
      this.fetchExercises();
    };
    this.$modal.show(
      ExerciseNew,
      {
        text: "This text is passed as a property",
        onSuccess
      },
      {
        name: "ExerciseNew",
        height: "auto"
      }
    );
  }

  async fetchExercisesRedux() {
    const query = new Parse.Query("ParseExercise");
    query.equalTo("isGlobal", true);
    query.doesNotExist("user");
    query.ascending("name");
    query.limit(1000);
    try {
      this.loading = true;
      const results = await query.find();
      console.log("exercises", results);
      this.items = results.map((x: any) => x.toJSON());
    } catch (e) {
      console.log("TODO show error notification");
    } finally {
      this.loading = false;
    }
  }

  created() {
    // this.fetchCatgeories();
    // this.fetchBodyParts();
    this.fetchExercisesRedux();
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
