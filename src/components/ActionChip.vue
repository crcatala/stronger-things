<template>
  <div :class="classes">
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: "default"
    }
  },
  computed: {
    classes() {
      return {
        [this.$style.ActionChip]: true,
        [this.$style.default]: this.type === "default",
        [this.$style.secondary]: this.type === "secondary"
      };
    }
  }
};
</script>

<style lang="scss" module>
@import "@/styles/variables.scss";

.ActionChip {
  border-radius: 5px;
  cursor: pointer;
  padding: 4px 8px;
  transition: $swift-ease-out;
  transition-property: color, background-color;
}

.default {
  background-color: $color-grey-lighter;
  color: #000000;

  &:hover {
    background-color: darken($color-grey-lighter, 10%);
  }
}

.secondary {
  background-color: $color-blue;
  color: $color-white;

  &:hover {
    background-color: lighten($color-blue, 5%);
  }
}
</style>
