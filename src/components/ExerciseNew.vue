<template>
  <div :class='$style.form'>
    <div :class='$style.content'>
      <h2 :class='$style.title'>Create New Exercise</h2>
      <div :class='$style.input'>
        <InputField placeholder='Exercise Name'
                    v-model='name'
                    :class='$style.input'
                    clearable/>
      </div>
      <div :class='$style.select'>
        <ExerciseBodyPartSelect @select='bodyPartSelected' />
      </div>
      <div :class='$style.select'>
        <ExerciseTypeSelect @select='exerciseTypeSelected' />
      </div>
    </div>
    <div :class='$style.actions'>
      <AppButton :class='$style.save'
                 @click.native='save'
                 :disabled='!formValid'
                 :loading='saving'>
        <span slot='loading'>Saving</span>Save</AppButton>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import SingleSelect from "@/components/SingleSelect.vue";
import InputField from "@/components/InputField.vue";
import AppButton from "@/components/AppButton.vue";
import Parse from "@/services/Parse";
import ExerciseBodyPartSelect from "@/components/ExerciseBodyPartSelect.vue";
import ExerciseTypeSelect from "@/components/ExerciseTypeSelect.vue";

const noop = function() {};
@Component({
  components: {
    ExerciseBodyPartSelect,
    ExerciseTypeSelect,
    InputField,
    AppButton
  }
})
export default class ExercisesView extends Vue {
  @Prop() private msg!: string;
  @Prop({
    default: noop
  })
  private onSuccess!: Function;

  bodyPartsLoading: boolean = false;
  categoriesLoading: boolean = false;
  saving: boolean = false;
  items: Array<object> = [];
  categories: Array<object> = [];
  bodyParts: Array<object> = [];
  category: any = null;
  bodyPart: any = null;
  name: string = "";

  get formValid() {
    return this.name && this.bodyPart && this.category;
  }

  bodyPartSelected(item: any) {
    this.bodyPart = item;
  }

  exerciseTypeSelected(item: any) {
    this.category = item;
  }

  async save() {
    // TODO: this no longer works with new DB schema
    let bodyPart;
    let category;
    if (this.bodyPart && this.bodyPart.objectId) {
      bodyPart = new Parse.Object("ExerciseBodyPart", {
        id: this.bodyPart.objectId
      });
    } else {
      bodyPart = null;
    }
    if (this.category && this.category.objectId) {
      category = new Parse.Object("ExerciseCategory", {
        id: this.category.objectId
      });
    } else {
      category = null;
    }
    const exercise = new Parse.Object("Exercise");

    try {
      this.saving = true;
      await exercise.save({
        name: this.name,
        bodyPart,
        category,
        type: "custom"
      });
      this.$emit("success", exercise.toJSON());
      // Can revert back to events once this PR lands https://github.com/euvl/vue-js-modal/pull/232
      this.onSuccess();
      this.$notify({
        group: "main",
        type: "success",
        title: "Successfully Created Exercise!"
      });
    } catch (e) {
      this.$emit("error", e);
      this.$notify({
        group: "main",
        type: "error",
        title: "Error Creating Exercise"
      });
    } finally {
      this.saving = false;
    }
  }
}
</script>

<style lang="scss" module>
.form {
  padding: 24px;
  display: flex;
  flex-direction: column;
  height: 200px;
}

.title {
  margin-top: 0;
}

.select {
  display: inline-block;
  margin-right: 12px;

  &:last-child {
    margin-right: 0;
  }
}

.input {
  width: 400px;
  margin-bottom: 24px;
}

.content {
  flex: 1 0 auto;
}

.actions {
  flex-shrink: 0;
}

.save {
  float: right;
}
</style>
