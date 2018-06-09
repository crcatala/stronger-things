<template>
  <div class='AvatarText' :class='$style.AvatarText'>
    <h1>{{ text[0] }}</h1>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class AvatarText extends Vue {
  @Prop() private text!: string;
}
</script>

<style lang='scss' module>
@import "@/styles/variables.scss";

.AvatarText {
  width: 64px;
  height: 64px;
  display: flex;
  justify-content: center;
  text-transform: capitalize;
  font-weight: 300;
  font-size: 0.9em;
  align-items: center;
  border-radius: 100%;
  color: $color-grey;
  background-color: $color-grey-lighter;
}
</style>
