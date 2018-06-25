<template>
  <div :class="$style.app" v-if='storeLoaded'>
    <AppHeader v-if='currentUser' />
    <!-- <UpdateChecker/> -->
    <transition name="route" mode="out-in">
      <router-view :key='$route.path' />
    </transition>
    <notifications group="main" position="bottom right" style='bottom: 16px; right: 16px;' />
    <modals-container class='app-modal-container' />
  </div>
  <AppLoader v-else :visible='appLoaderVisible' />
</template>

<script>
import { Component, Vue } from "vue-property-decorator";
import AppHeader from "@/components/AppHeader.vue";
import AppLoader from "@/components/AppLoader.vue";
import UpdateChecker from "@/components/UpdateChecker.vue";
import { setTimeout } from "timers";

export default {
  components: {
    AppHeader,
    UpdateChecker,
    AppLoader
  },
  data() {
    return {
      test: "hey",
      appLoaderVisible: true,
      storeLoaded: false
    };
  },
  computed: {
    currentUser() {
      return this.$store.getters["sessions/currentUser"];
    }
  },
  created() {
    this.$store._vm.$root.$on("storageReady", () => {
      this.storeLoaded = true;
    });

    // Don't show loader until at least 250s for better experience
    // setTimeout(() => {
    //   this.appLoaderVisible = true;
    // }, 250);
  }
};
</script>

<style lang="scss" module>
@import "@/styles/variables.scss";

.app {
  min-width: $app-min-width;
}
</style>

<style lang='scss'>
@import "@/styles/variables.scss";
//
// Global for transition
//
.route-enter-active,
.route-leave-active {
  transition: opacity 0.15s $swift-ease-out-timing-function;
}

.route-enter,
.route-leave-to {
  opacity: 0;
}
</style>
