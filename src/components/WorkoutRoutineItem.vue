<template>
  <Card class='WorkoutRoutineItem'
        :class='$style["item-card"]'>
    <div :class='$style["item-title"]'>{{ item.objectId }}</div>
    <div :class='$style["item-subtitle"]'>Last updated {{ formattedDate(item.updatedAt) }}</div>
  </Card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { format } from "date-fns";
import get from "lodash/get";
import Card from "@/components/Card.vue";
import { calculate1RM } from "@/services/LiftingCalculator";
import { VTooltip } from "v-tooltip";

@Component({
  components: {
    Card
  },
  directives: {
    tooltip: VTooltip
  }
})
export default class WorkoutRoutineItem extends Vue {
  @Prop() private item!: object;

  formattedDate(date: any) {
    return format(date, "hh:mma, EEEE, MMMM dd y");
  }
}
</script>

<style lang="scss" module>
@import "@/styles/variables.scss";
@import "@/styles/mixins.scss";

.item-card {
  padding: 16px;
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0px;
  }
}

.item-title {
  font-size: 1.4em;
  color: $color-grey-dark;
  user-select: none;
  margin-bottom: 6px;
}

.item-subtitle {
  font-size: 1em;
  color: $color-grey;
}
</style>
