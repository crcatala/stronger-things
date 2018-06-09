<template>
  <div :class='$style.BrandLogo'>
    <img src='@/assets/brand-icon.png' :class='$style.icon'/>
    Stronger Things
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class BrandLogo extends Vue {
  @Prop() private msg!: string;
}
</script>

<style lang="scss" module>
.BrandLogo {
  display: flex;
  align-items: center;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 700;
}

.icon {
  width: 50px;
  margin-right: 8px;
}
</style>
