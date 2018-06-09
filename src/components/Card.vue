<script>
export default {
  props: {
    raised: {
      type: Boolean,
      default: true
    },
    hoverable: {
      type: Boolean,
      default: false
    },
    shiftable: {
      type: Boolean,
      default: false
    },
    zoomable: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    classes() {
      return {
        "card--raised": this.raised,
        "card--hoverable": this.hoverable,
        "card--shiftable": this.shiftable,
        "card--zoomable": this.zoomable
      };
    }
  }
};
</script>

<template>
  <div class='card' :class='classes'>
    <slot></slot>
  </div>
</template>

<style lang='scss' scoped>
@import "@/styles/variables.scss";

$card-radius: 5px;
$card-shiftable-offset: 6px;

.card {
  display: block;
  overflow: visible;
  border-radius: $card-radius;
  background-color: #fff;
  transition: $swift-ease-out;
  margin-top: 0;
  border: 1px solid $color-grey-lighter;
  transition-property: all;

  &--hoverable {
    cursor: pointer;

    &:hover {
      box-shadow: $shadow-5dp;
    }
  }

  &--raised {
    border: none;
    // border: 1px solid transparent;
    box-shadow: $shadow-subtle;
  }

  &--shiftable {
    &:hover {
      transform: translateY(-$card-shiftable-offset);
    }
  }
}
</style>
