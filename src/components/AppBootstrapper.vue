<template>
  <div>
    <slot v-if='storeLoaded' />
    <AppLoader v-else
               :visible='appLoaderVisible' />
  </div>
</template>

<script>
//
// This wrapper component does any required bootstrapping before rendering app
// Right now, it's to ensure IndexedDB storage loaded because it can get large
// due to caching of all workouts
//
import AppLoader from "@/components/AppLoader.vue";

export default {
  components: {
    AppLoader
  },
  data() {
    return {
      appLoaderVisible: true,
      storeLoaded: false
    };
  },
  created() {
    this.$store._vm.$root.$on("storageReady", () => {
      this.storeLoaded = true;
    });
  }
};
</script>

