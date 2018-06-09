<template>
  <div class='RoutinesView' :class='$style.root'>
    <h1>Routines</h1>
    <div v-if='loading' :class='$style.loading'>
      <Spinner/>
    </div>
    <WorkoutRoutineItem v-else v-for='(item, index) in items' :item='item' :key='index' />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Card from "@/components/Card.vue";
import Parse from "@/services/Parse";
import { format } from "date-fns";
import WorkoutRoutineItem from "@/components/WorkoutRoutineItem.vue";
import Spinner from "@/components/Spinner.vue";

@Component({
  components: {
    Card,
    WorkoutRoutineItem,
    Spinner
  }
})
export default class RoutinesView extends Vue {
  items: Array<any> = [];
  loading = false;

  async fetchRoutines() {
    try {
      this.loading = true;
      const query = new Parse.Query("WorkoutRoutine");
      const results = await query.find();
      this.items = results.map((x: any) => x.toJSON());
    } catch (e) {
      console.log(e);
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
