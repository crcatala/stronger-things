<template>
  <Card :class="$style.ExerciseInstructionsCard">
    <h3 :class='$style.title'>Instructions</h3>
    <p v-for='item in instructionItems'>
      {{ item }}
    </p>
  </Card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Card from "@/components/Card.vue";

@Component({
  components: {
    Card
  }
})
export default class ExerciseInstructionsCard extends Vue {
  @Prop() private instructions!: string;

  get instructionItems() {
    return this.instructions.split("||");
  }
}
</script>

<style lang="scss" module>
.ExerciseInstructionsCard {
  padding: 16px;
}

.title {
  margin-top: 0;
}
</style>
