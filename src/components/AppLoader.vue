<template>
  <div :class='$style.AppLoader'>
    <Spinner v-if='visible' />
  </div>
</template>

<script>
import Spinner from "@/components/Spinner.vue";

export default {
  name: "AppLoader",
  components: {
    Spinner
  },
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
