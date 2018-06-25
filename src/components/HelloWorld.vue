<template>
  <div :class="$style.HelloWorld">
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class HelloWorld extends Vue {
  @Prop() private msg!: string;
}
</script>

<style lang="scss" module>
.HelloWorld {
  // Styles
}
</style>
