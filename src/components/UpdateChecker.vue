<template>
  <div>
    <!-- TODO: find the vue option for components without template -->
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";

@Component
export default class UpdateChecker extends Vue {
  created() {
    console.log("UpdateChecker created");
    // this.$store.dispatch("workouts/checkForUpdates");
  }
}
</script>
