<template functional>
  <div :class='$style.EmptyResults'>
    <slot>No Results</slot>
  </div>
</template>

<script>
export default {
  name: "EmptyResults"
};
</script>

<style lang="scss" module>
@import "@/styles/variables.scss";

.EmptyResults {
  width: 100%;
  background-color: $color-grey-lighter;
  padding: 24px;
  text-align: center;
  border-radius: 5px;
}
</style>
