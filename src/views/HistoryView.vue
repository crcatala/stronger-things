<template>
  <div :class='$style.HistoryView'>
    <h1>History</h1>
    <div v-if='loading'
         :class='$style.loading'>
      <Spinner/>
    </div>
    <div v-else-if='items.length'>
      <div :class='$style.filters'>
        <div :class='$style.expansionToggle'
             v-if='expandAll'
             @click='collapseItems'>Collapse All</div>
        <div :class='$style.expansionToggle'
             v-else
             @click='expandItems'>Expand All</div>
      </div>
      <WorkoutSessionItem :class='$style["item-card"]'
                          v-for='(item, index) in filteredItems'
                          :key='index'
                          :item='item'
                          :expanded='item.expanded'
                          @toggleExercises='toggleExercises(item)' />
      <div :class='$style.viewMore'
           v-if='filteredItems.length && filteredItems.length < items.length'
           @click='viewMore'>View More</div>
    </div>
    <div v-else
         :class='$style.loading'>
      <EmptyResults>No Workouts</EmptyResults>
    </div>
  </div>
</template>

<script lang="ts">
import Parse from "@/services/Parse";
import { Component, Prop, Watch, Vue } from "vue-property-decorator";
import WorkoutSessionCard from "@/components/WorkoutSessionCard.vue";
import WorkoutSessionItem from "@/components/WorkoutSessionItem.vue";
import Spinner from "@/components/Spinner.vue";
import EmptyResults from "@/components/EmptyResults.vue";
import Http from "@/services/Http";
import { format } from "date-fns";

const PAGE_INVERVAL = 25;

@Component({
  components: {
    Spinner,
    EmptyResults,
    WorkoutSessionCard,
    WorkoutSessionItem
  }
})
export default class HistoryView extends Vue {
  workoutSessions: Array<any> = [];
  loading = false;
  filteredItems = [];
  expandAll = false;

  @Watch("items")
  itemsChanged() {
    this.viewMore();
  }

  get items() {
    // clone because we mutate with `expanded` state and odd persisted state otherwise
    const list = this.$store.getters["workouts/list"];
    return list.map((x: any) => ({
      ...x,
      expanded: false
    }));
  }

  get currentUser() {
    return this.$store.getters["sessions/currentUser"];
  }

  viewMore() {
    this.filteredItems = this.items.slice(
      0,
      this.filteredItems.length + PAGE_INVERVAL
    );
  }

  expandItems() {
    this.filteredItems.forEach((item: any) => {
      item.expanded = true;
    });
    this.expandAll = true;
  }

  collapseItems() {
    this.filteredItems.forEach((item: any) => {
      item.expanded = false;
    });
    this.expandAll = false;
  }

  created() {
    this.$store.dispatch("workouts/refreshList");
    this.viewMore();
  }

  toggleExercises(item: any) {
    item.expanded = !item.expanded;
  }
}
</script>

<style lang='scss' module>
@import "@/styles/variables.scss";

.HistoryView {
  padding: 0 $app-content-gutter-spacing;
  margin-bottom: 48px;
}

.loading {
  padding: 24px 0;
  text-align: center;
}

.item-card {
  padding: 16px;
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0px;
  }
}

.viewMore {
  padding: 16px;
  background-color: $color-grey-lighter;
  border-radius: 10px;
  cursor: pointer;
  text-align: center;
  text-transform: uppercase;
  transition: $swift-ease-out;
  transition-property: color, background-color;

  &:hover {
    background-color: darken($color-grey-lighter, 10%);
  }
}

.filters {
  margin: 16px 0;
}

.expansionToggle {
  // TODO: this is exact styling from SingleSelect .selection except the display prop
  display: inline-block;
  border-radius: 5px;
  background-color: $color-grey-lighter;
  color: #000000;
  cursor: pointer;
  padding: 4px 8px;
  transition: $swift-ease-out;
  transition-property: color, background-color;

  &:hover {
    background-color: darken($color-grey-lighter, 10%);
  }
}
</style>
