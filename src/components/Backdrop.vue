<template>
  <transition name='backdrop' mode='out-in'>
    <div class='backdrop' :class='$style.backdrop' @click='$emit("close")'></div>
  </transition>
</template>

<script>
export default {
  name: 'Backdrop'
}
</script>

<style lang='scss' module>
.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  // background-color: $color-grey;
  background-color: #486997;
  opacity: 0.25;
  // transition: opacity 0.25s ease-in-out;
}
</style>

<style lang='scss'>
.backdrop-enter-active,
.backdrop-leave-active {
  transition: opacity 0.25s ease-in-out;
}

.backdrop-enter,
.backdrop-leave-to {
  opacity: 0;
}
</style>
