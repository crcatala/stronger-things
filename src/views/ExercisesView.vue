<template>
  <div :class='$style.ExercisesView'>
    <div :class='$style.header'>
      <h1>Exercises</h1>
      <div>
        <InputField placeholder='Search...' v-model='searchFilter' :class='$style.input' @submit='search' autoSubmit clearable/>
      </div>
      <AppButton @click.native='newClicked'>New</AppButton>
    </div>
    <div :class='$style.filters'>
      <div>
        <div :class='$style.filterItem'>
          <SingleSelect :loading='bodyPartsLoading' :options='bodyPartOptions' trackBy='id' label='name' noSelectionText="Any Body Part" @select='bodyPartSelected' />
        </div>
        <div :class='$style.filterItem'>
          <SingleSelect :loading='categoriesLoading' :options='exerciseTypeOptions' trackBy='id' label='name' noSelectionText="Any Category" @select='categorySelected' />
        </div>
      </div>
    </div>
    <div v-if='loading' :class='$style.loading'>
      <Spinner/>
    </div>
    <ExerciseList :items='items' v-else-if='items.length' />
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

  bodyPartsLoading: boolean = false;
  categoriesLoading: boolean = false;
  loading: boolean = false;
  items: Array<object> = [];
  // categories: Array<object> = [];
  // bodyParts: Array<object> = [];
  categoryFilter: any = null;
  bodyPartFilter: any = null;
  searchFilter: string = "";
  category = null;

  get bodyPartOptions() {
    return EXERCISE_BODY_PART_OPTIONS;
  }

  get exerciseTypeOptions() {
    return EXERCISE_TYPE_OPTIONS;
  }

  search() {
    this.fetchExercises({
      searchFilter: this.searchFilter,
      categoryFilter: this.categoryFilter,
      bodyPartFilter: this.bodyPartFilter
    });
  }

  async fetchCatgeories() {
    const query = new Parse.Query("ExerciseCategory");
    try {
      this.categoriesLoading = true;
      const results = await query.find();
      this.categories = results.map((x: any) => x.toJSON());
    } catch (e) {
      console.log("TODO show error notification");
    } finally {
      this.categoriesLoading = false;
    }
  }

  async fetchBodyParts() {
    const query = new Parse.Query("ExerciseBodyPart");
    try {
      this.bodyPartsLoading = true;
      const results = await query.find();
      this.bodyParts = results.map((x: any) => x.toJSON());
    } catch (e) {
      console.log("TODO show error notification");
    } finally {
      this.bodyPartsLoading = false;
    }
  }

  async fetchExercises({
    searchFilter = "",
    categoryFilter = null,
    bodyPartFilter = null
  } = {}) {
    const query = new Parse.Query("Exercise");
    // query.include('category').include('bodyPart');
    query.include("category");
    // query.equalTo("type", "official");
    query.ascending("name");
    if (searchFilter) {
      query.matches("name", searchFilter, "i");
    }
    if (categoryFilter) {
      query.equalTo(
        "category",
        new Parse.Object("ExerciseCategory", {
          id: get(categoryFilter, "objectId")
        })
      );
    }
    if (bodyPartFilter) {
      query.equalTo(
        "bodyPart",
        new Parse.Object("ExerciseBodyPart", {
          id: get(bodyPartFilter, "objectId")
        })
      );
    }
    query.limit(100);
    try {
      this.loading = true;
      const results = await query.find();
      this.items = results.map((x: any) => x.toJSON());
    } catch (e) {
      console.log("TODO show error notification");
    } finally {
      this.loading = false;
    }
  }

  bodyPartSelected(item: any) {
    // this.bodyPartFilter = item;
    // this.search();
  }

  categorySelected(item: any) {
    // this.categoryFilter = item;
    // this.search();
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
