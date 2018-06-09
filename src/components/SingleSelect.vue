<template>
  <div :class="$style.SingleSelect">
    <div v-if='loading'>{{ loadingText }}</div>
    <Popover popoverClass='popover--dark' v-else>
      <div :class="selectionClass">{{ selection ? selection[label] : noSelectionText }}</div>
      <template slot="popover">
        <!-- TODO get key customizable -->
        <div :class='$style.list' v-close-popover>
          <div v-for='(option, index) in options' :key='index' :class='itemClass(option)' @click='optionClicked(option)'>
            <span :class='$style.itemLabel'>{{ option[label] }}</span><span :class='$style.checkmark' v-if='optionIsSelected(option)'>✔</span>
          </div>
        </div>
      </template>
    </Popover>
  </div>
</template>

<script>
import Popover from '@/components/Popover';
import { VClosePopover } from 'v-tooltip';

export default {
  name: "SingleSelect",
  components: {
    Popover
  },
  directives: {
    'close-popover': VClosePopover
  },
  props: {
    options: {
      type: Array,
      default() {
        return []
      },
    },
    label: {
      type: String,
      default: ''
    },
    trackBy: {
      type: String,
      default: ''
    },
    noSelectionText: {
      type: String,
      default: "No Selection"
    },
    loading: {
      type: Boolean,
      default: false
    },
    loadingText: {
      type: String,
      default: 'Loading...'
    }
  },
  data() {
    return {
      selection: null,
    }
  },
  computed: {
    selectionClass() {
      return {
        [this.$style.selection]: true,
        [this.$style.selectionHasValue]: !!this.selection
      }
    }
  },
  methods: {
    optionClicked(option) {
      if (this.optionIsSelected(option)) {
        this.selection = null;
      } else {
        this.selection = option;
      }
      this.$emit('select', this.selection);
    },
    optionIsSelected(option) {
      return option[this.label] === (this.selection ? this.selection[this.label] : '');
    },
    itemClass(option) {
      // TODO we should use trackby since name could be non-unique
      return {
        [this.$style.item]: true,
        [this.$style.itemSelected]: this.optionIsSelected(option)
      }
    }
  }
}
</script>

<style lang="scss" module>
@import "@/styles/variables.scss";

.SingleSelect {
  //
}

.list {
  ˜padding: 8px 0;
}

.item {
  display: flex;
  justify-content: space-between;
  padding: 12px;
  transition: $swift-ease-out;
  transition-property: color, background-color;

  &:hover {
    background-color: lighten(#293236, 10%);
    cursor: pointer;
  }
}

.itemLabel {
  margin-right: 10px;
}

.checkmark {
  color: $color-blue;
}

.itemSelected {
  // border: 1px solid red;
  background-color: lighten(#293236, 15%);
}

.selection {
  border-radius: 5px;
  // background-color: $color-grey-lighter;
  // background-color: $color-white;
  // background-color: #fff;
  background-color: $color-grey-lighter;
  color: #000000;
  cursor: pointer;
  padding: 4px 8px;
  transition: $swift-ease-out;
  transition-property: color, background-color;
  // outline: none;

  // &:active,
  // &:focus {
  // outline: none;
  // }
  &:hover {
    background-color: darken($color-grey-lighter, 10%);
  }
}

.selectionHasValue {
  background-color: $color-blue;
  color: $color-white;

  &:hover {
    background-color: lighten($color-blue, 5%);
  }
}
</style>
