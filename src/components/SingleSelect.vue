<template>
  <div :class="$style.SingleSelect">
    <div v-if='loading'>{{ loadingText }}</div>
    <Popover v-else
             popoverClass='popover--dark'>
      <ActionChip v-if='selection'
                  type='secondary'>{{ selection[label] }}</ActionChip>
      <ActionChip v-else>{{ noSelectionText }}</ActionChip>
      <template slot="popover">
        <!-- TODO get key customizable -->
        <div :class='$style.list'
             v-close-popover>
          <div v-for='(option, index) in options'
               :key='index'
               :class='itemClass(option)'
               @click='optionClicked(option)'>
            <span :class='$style.itemLabel'>{{ option[label] }}</span>
            <span :class='$style.checkmark'
                  v-if='optionIsSelected(option)'>✔</span>
          </div>
        </div>
      </template>
    </Popover>
  </div>
</template>

<script>
import Popover from "@/components/Popover";
import ActionChip from "@/components/ActionChip";
import { VClosePopover } from "v-tooltip";

export default {
  name: "SingleSelect",
  components: {
    Popover,
    ActionChip
  },
  directives: {
    "close-popover": VClosePopover
  },
  props: {
    options: {
      type: Array,
      default() {
        return [];
      }
    },
    label: {
      type: String,
      default: ""
    },
    trackBy: {
      type: String,
      default: ""
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
      default: "Loading..."
    }
  },
  data() {
    return {
      selection: null
    };
  },
  methods: {
    optionClicked(option) {
      if (this.optionIsSelected(option)) {
        this.selection = null;
      } else {
        this.selection = option;
      }
      this.$emit("select", this.selection);
    },
    optionIsSelected(option) {
      return (
        option[this.label] ===
        (this.selection ? this.selection[this.label] : "")
      );
    },
    itemClass(option) {
      // TODO we should use trackby since name could be non-unique
      return {
        [this.$style.item]: true,
        [this.$style.itemSelected]: this.optionIsSelected(option)
      };
    }
  }
};
</script>

<style lang="scss" module>
@import "@/styles/variables.scss";

.list {
  padding: 8px 0;
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
  background-color: lighten(#293236, 15%);
}
</style>
