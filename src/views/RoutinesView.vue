<template>
  <div class='RoutinesView'
       :class='$style.root'>
    <h1>Routines</h1>
    <div v-if='loading'
         :class='$style.loading'>
      <Spinner/>
    </div>
    <WorkoutRoutineItem v-else-if='items.length'
                        v-for='(item, index) in items'
                        :item='item'
                        :key='index' />
    <div v-else
         :class='$style.loading'>
      <EmptyResults>No Routines</EmptyResults>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Card from "@/components/Card.vue";
import api from "@/api";
import { format } from "date-fns";
import WorkoutRoutineItem from "@/components/WorkoutRoutineItem.vue";
import Spinner from "@/components/Spinner.vue";
import EmptyResults from "@/components/EmptyResults.vue";

@Component({
  components: {
    Card,
    WorkoutRoutineItem,
    Spinner,
    EmptyResults
  }
})
export default class RoutinesView extends Vue {
  items: Array<any> = [];
  loading = false;

  get currentUser() {
    return this.$store.getters["sessions/currentUser"];
  }

  async fetchRoutines() {
    try {
      this.loading = true;
      this.items = await api.getRoutineList();
    } catch (e) {
      this.$notify({
        group: "main",
        type: "error",
        title: "Error fetching routines."
      });
    } finally {
      this.loading = false;
    }
  }

  created() {
    this.fetchRoutines();
  }
}
</script>

<style lang='scss' module>
@import "@/styles/variables.scss";

.root {
  padding: 0 $app-content-gutter-spacing;
}

.loading {
  padding: 24px 0;
  text-align: center;
}
</style>
