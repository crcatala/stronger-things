<template>
  <SingleSelect class='ExerciseBodyPartSelect'
                :options='options'
                trackBy='id'
                label='name'
                noSelectionText="Any Body Part"
                v-on="$listeners" />
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import SingleSelect from "@/components/SingleSelect.vue";
import { EXERCISE_BODY_PART_OPTIONS } from "@/services/ExerciseBodyPart";

@Component({
  components: {
    SingleSelect
  }
})
export default class ExerciseBodyPartSelect extends Vue {
  get options() {
    return EXERCISE_BODY_PART_OPTIONS;
  }
}
</script>
