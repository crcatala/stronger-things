<template>
  <SingleSelect class='ExerciseTypeSelect'
                :options='options'
                trackBy='id'
                label='name'
                noSelectionText="Any Category"
                v-on="$listeners" />
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import SingleSelect from "@/components/SingleSelect.vue";
import { EXERCISE_TYPE_OPTIONS } from "@/services/ExerciseType";

@Component({
  components: {
    SingleSelect
  }
})
export default class ExerciseTypeSelect extends Vue {
  get options() {
    return EXERCISE_TYPE_OPTIONS;
  }
}
</script>
