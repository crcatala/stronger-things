<template>
  <AppButton @click.native='newClicked'>New</AppButton>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import AppButton from "@/components/AppButton.vue";
import ExerciseNew from "@/components/ExerciseNew.vue";

@Component({
  components: {
    AppButton,
    ExerciseNew
  }
})
export default class ExerciseCreateAction extends Vue {
  @Prop() private msg!: string;

  closeModal() {
    this.$modal.hide("ExerciseNew");
  }

  newClicked() {
    const onSuccess = () => {
      this.closeModal();
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
}
</script>

<style lang="scss" module>
// .ExerciseCreateAction {
// }
</style>
