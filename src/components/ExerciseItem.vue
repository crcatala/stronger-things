<template>
  <router-link :class='$style.ExerciseItem' :to='linkPath'>
    <div :class='$style.leftItems'>
      <div :class='[$style.avatar]'>
        <!-- <img :class='$style.avatar' :src='item.avatar' v-if='item.avatar'/> -->
        <AvatarText :text='item.name' />
      </div>
      <div>
        <div :class='$style.title'>
          <span :class='$style.name'>{{ item.name }}</span>
          <!-- <Chip fontSize='12px' background='#26C6DA' color='#ffffff' padding='4px 8px' v-if='isCustom'>Custom</Chip> -->
        </div>
        <div :class='$style.description'>
          {{ bodyPartName }} ({{ exerciseTypeName }})
          <!-- {{ bodyPartName }} ({{ item.exerciseType }}) -->
        </div>
      </div>
    </div>
    <div class='record'>
      <!-- {{ item.recordValue }}lbs (x{{ item.recordReps }}) -->
      <!-- Last Performed 2018/05/01 - 95 lb (x8) -->
    </div>
  </router-link>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import get from "lodash/get";
import AvatarText from "@/components/AvatarText.vue";
import Chip from "@/components/Chip.vue";
import { getExerciseBodyPartName } from "@/services/ExerciseBodyPart";
import { getExerciseTypeName } from "@/services/ExerciseType";

// {
//   "name": "Leg Press",
//   "exerciseType": 2,
//   "isGlobal": true,
//   "bodyParts": 16,
//   "uniqueId": "A467F043-C96E-43C8-9133-A33EB8E62DED",
//   "instructions": "Place feet shoulder width apart in a position where the knees would not pass the feet at the bottom of the leg press movement.||Push through the heel and midfoot and lower the safety bars, making sure to brace the core and keeping knees pointed slightly outward.||Lower the weight platform until the legs create a 90 degree angle.||Push using the quads to the starting position, making sure knees are not locked.||Repeat for reps.",
// },

@Component({
  components: {
    AvatarText,
    Chip
  }
})
export default class ExerciseItem extends Vue {
  @Prop() private item!: any;

  get linkPath() {
    return { name: "ExerciseShowView", params: { id: this.item.objectId } };
  }

  get isOfficial() {
    return get(this.item, "type") === "official";
  }

  get isCustom() {
    return get(this.item, "type") === "custom";
  }

  get bodyPartName() {
    return getExerciseBodyPartName(this.item.bodyParts);
  }

  get exerciseTypeName() {
    return getExerciseTypeName(this.item.exerciseType);
  }
}
</script>

<style lang="scss" module>
@import "@/styles/variables.scss";
@import "@/styles/mixins.scss";

.ExerciseItem {
  @include reset-link-style;

  border-bottom: 1px solid $color-grey-lighter;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  transition: $swift-ease-out;
  transition-property: background-color, color;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: $color-grey-lighter-2;
  }
}

.avatar {
  width: 64px;
  border-radius: 100%;
  margin-right: 12px;
}

.title {
  margin-bottom: 8px;
  display: flex;
  align-items: center;
}

.name {
  font-size: 1.2em;
  margin-right: 12px;
}

.description {
  color: $color-grey;
}

.leftItems {
  display: flex;
  align-items: center;
}

.chip {
  font-size: 40px;
}
</style>
