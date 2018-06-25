<template>
  <div :class="$style.ExercisePersonalRecords">
    <div :class='[$style.record, $style.oneRepMax]'>
      <TrophyIcon :class='$style.icon' />
      <div>
        <div :class='$style.value'>{{ oneRepMax }}
          <span :class='$style.recordSubtitle'>lbs</span>
        </div>
        <div :class='$style.label'>1 Rep Max</div>
      </div>
    </div>
    <div :class='[$style.record, $style.weight]'>
      <MedalIcon :class='$style.icon' />
      <div>
        <div :class='$style.value'>{{ weight }}
          <span :class='$style.recordSubtitle'>lbs x {{ reps }}</span>
        </div>
        <div :class='$style.label'>Record Weight</div>
      </div>
    </div>
    <div :class='[$style.record, $style.volume]'>
      <DumbbellIcon :class='$style.icon' />
      <div>
        <div :class='$style.value'>{{ volume }}
          <span :class='$style.recordSubtitle'>lbs</span>
        </div>
        <div :class='$style.label'>Record Volume</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import TrophyIcon from "@/assets/icons/trophy.svg";
import MedalIcon from "@/assets/icons/medal.svg";
import DumbbellIcon from "@/assets/icons/dumbbell.svg";

@Component({
  components: {
    TrophyIcon,
    MedalIcon,
    DumbbellIcon
  }
})
export default class ExercisePersonalRecords extends Vue {
  @Prop() private oneRepMax!: number;
  @Prop() private weight!: number;
  @Prop() private reps!: number;
  @Prop() private volume!: number;
  @Prop({
    default: "kg"
  })
  private unit!: string;
}
</script>

<style lang="scss" module>
@import "@/styles/variables.scss";

.ExercisePersonalRecords {
  display: flex;
  justify-content: space-evenly;
  margin: 24px 0;
}

.record {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  box-shadow: $shadow-medium;
  width: 280px;
  height: 160px;
}

.oneRepMax {
  background: rgb(0, 176, 155);
  background: linear-gradient(
    180deg,
    rgba(0, 176, 155, 1) 0%,
    rgba(150, 201, 61, 1) 100%
  );
}

.weight {
  background: rgb(253, 200, 48);
  background: linear-gradient(
    180deg,
    rgba(253, 200, 48, 1) 0%,
    rgba(243, 115, 53, 1) 100%
  );
}

.volume {
  background: rgb(41, 128, 185);
  background: linear-gradient(
    180deg,
    rgba(41, 128, 185, 1) 0%,
    rgba(109, 213, 250, 1) 100%
  );
}

.icon {
  width: 64px;
  height: 64px;
  fill: $color-white;
  margin-right: 10px;
}

.value {
  color: $color-white;
  font-size: 40px;
  font-weight: 700;
}

.label {
  color: $color-white;
  font-size: 20px;
  font-weight: 300;
}
</style>
