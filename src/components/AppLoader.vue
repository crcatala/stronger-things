<template>
  <div :class='$style.AppLoader'>
    <div v-if='visible'>Loading...</div>
    <!-- <div>Loading...</div> -->
  </div>
</template>

<script>
export default {
  name: "AppLoader",
  props: {
    visible: {
      type: Boolean,
      default: true
    }
  }
};
</script>

<style lang="scss" module>
.AppLoader {
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
</style>
