<script>
export default {
  name: "Chip",
  props: {
    color: {
      type: String,
      default: ""
    },
    background: {
      type: String,
      default: ""
    },
    fontSize: {
      type: String,
      default: ""
    },
    padding: {
      type: String,
      default: "2px 10px"
    }
  },
  computed: {
    styles() {
      return {
        "background-color": this.background,
        color: this.color,
        fontSize: this.fontSize,
        padding: this.padding
      };
    }
  }
};
</script>

<template>
  <span class='app-chip' :style='styles'>
    <slot></slot>
  </span>
</template>

<style lang='scss' scoped>
.app-chip {
  display: inline-flex;
  padding: 2px 10px;
  background-color: #e0e0e0;
  color: #555;
  font-size: 10px;
  user-select: none;
  cursor: pointer;
  /* TODO: get max-width as a prop */
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  /* height: $chip-size; */
  border-radius: 9999px;
}
</style>
