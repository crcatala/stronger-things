<template>
  <transition name='drawer-right'
              mode="out-in">
    <div class='drawer'
         :class='$style.drawer'
         :style='styles'>
      <slot></slot>
    </div>
  </transition>
</template>

<script>
import classList from "@/services/classList";

export default {
  name: "DrawerRight",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    backgroundColor: {
      type: String,
      default: "#ffffff"
    }
  },
  computed: {
    styles() {
      return {
        backgroundColor: this.backgroundColor
      };
    }
  },
  created() {
    classList.add(document.body, "noScroll");
    classList.add(document.documentElement, "noScroll");
  },
  beforeDestroy() {
    classList.remove(document.body, "noScroll");
    classList.remove(document.documentElement, "noScroll");
  }
};
</script>

<style lang='scss' module>
@import "@/styles/variables.scss";

$drawer-width: 512px;
$drawer-margin: 16px;

.drawer {
  display: inline-block;
  margin: $drawer-margin;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: $color-grey-light;
  width: $drawer-width;
  z-index: 1001;
  overflow-y: auto;
  overflow-x: hidden;
  box-shadow: -1px 0 12px 0 rgba(0, 0, 0, 0.08);
  border-radius: 8px;
}
</style>

<style lang='scss'>
.drawer-right-enter-active,
.drawer-right-leave-active {
  transition: transform 0.5s cubic-bezier(0.3, 1, 0.32, 1);
  transform: translateX(0px);
}

.drawer-right-enter,
.drawer-right-leave-to {
  transform: translateX(120%);
}
</style>

<style>
.noScroll {
  overflow: hidden;
}
</style>
