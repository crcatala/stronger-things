<template>
  <button :class='classes'
          :disabled='disabled'>
    <slot name='loading'
          v-if='loading'>
      Loading...
    </slot>
    <slot v-else/>
  </button>
</template>

<script>
export default {
  name: "AppButton",
  props: {
    type: {
      type: String,
      default: "primary"
    },
    loading: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    classes() {
      return {
        [this.$style.AppButton]: true,
        [this.$style.loading]: this.loading,
        [this.$style["primary"]]: this.type === "primary"
      };
    }
  }
};
</script>


<style lang='scss' module>
@import "@/styles/variables.scss";

.AppButton {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px;
  border: 0;
  border-radius: 5px;
  transition: $swift-ease-out;
  cursor: pointer;

  &[disabled] {
    background-color: $color-grey;
    cursor: not-allowed;

    &:hover {
      background-color: lighten($color-grey, 5%);
    }
  }

  &:focus {
    outline: 0;
  }

  &:hover {
    background-color: lighten($color-blue, 5%);
  }
}

.primary {
  background-color: $color-blue;
  color: $color-white;
}

.loading {
  background-color: lighten($color-blue, 5%);
  cursor: not-allowed;
}
</style>
