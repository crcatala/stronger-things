<template>
  <div class='input-field' :class='classes'>
    <input
      ref='input'
      class='input-field__input'
      :value='value'
      :placeholder='placeholder'
      @input='input'
      :type='type'
      @keyup.enter.prevent='$emit("submit")'
    />
    <ClearIcon class='input-field__clear' v-if='value && clearable' @click.native='clear'/>
  </div>
</template>

<script>
import ClearIcon from "@/assets/icons/font-awesome/times-circle.svg";
import debounce from "lodash/debounce";

const debouncedSubmit = debounce(function() {
  this.$emit("submit");
}, 250);

export default {
  name: "InputField",
  components: {
    ClearIcon
  },
  props: {
    placeholder: {
      type: String,
      default: "Enter Text"
    },
    value: {
      type: String,
      default: ""
    },
    clearable: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'text'
    },
    autoSubmit: {
      type: Boolean,
      default: false
    },
    debounceInterval: {
      type: Number,
      default: 250
    }
  },
  computed: {
    classes() {
      return {
        "input-field--has-selection": this.value
      };
    }
  },
  methods: {
    input(e) {
      this.$emit("input", e.target.value);
      if (this.autoSubmit) {
        this.debouncedSubmit();
      }
    },
    clear() {
      this.$emit("input", "");
      this.$emit("submit");
    },
  },
  created() {
    this.debouncedSubmit = debounce(() => {
      this.$emit("submit");
    }, this.debounceInterval);
  }
};
</script>

<style lang='scss' scoped>
@import "@/styles/variables.scss";

/* Styled input form to match vue-select */
$search-clear-icon-size: 16px;
$input-field-height: 40px;
$input-field-padding: 8px;

.input-field {
  // min-height: $input-field-height;
  display: block;
  position: relative;
  padding: $input-field-padding;
  border-radius: 2px;
  border: 1px solid $color-grey-lighter;
  background: $color-white;

  &__input {
    position: relative;
    display: inline-block;
    min-height: 20px;
    line-height: 20px;
    border: none;
    border-radius: 2px;
    background: #fff;
    // padding: 1px 0 0 5px;
    width: 100%;
    transition: border 0.1s ease;
    box-sizing: border-box;
    // margin-bottom: 8px;
    font-family: inherit;
    font-size: 14px;
    touch-action: manipulation;

    &:focus {
      outline: none;
      border-color: #a8a8a8;
    }
  }

  &--has-selection {
    // border-color: $material-color-blue-300;
    border-color: $color-blue;
  }

  &__clear {
    position: absolute;
    width: $search-clear-icon-size;
    height: $search-clear-icon-size;
    top: $input-field-height/2 - $search-clear-icon-size/2;
    right: $input-field-padding;
    cursor: pointer;
    // fill: $material-color-grey-700;
    fill: $color-grey;
    transition: $swift-ease-out;

    &:hover {
      // fill: $material-color-grey-800;
      fill: $color-grey;
    }
  }
}
</style>
