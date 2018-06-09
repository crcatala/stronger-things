<template>
  <div :class="$style.app">
    <AppHeader v-if='currentUser' />
    <transition name="route" mode="out-in">
      <router-view :key='$route.path' />
    </transition>
    <notifications group="main" position="bottom right" style='bottom: 16px; right: 16px;' />
    <modals-container class='app-modal-container' />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import AppHeader from "@/components/AppHeader.vue";

@Component({
  components: {
    AppHeader
  },
  computed: {
    currentUser() {
      console.log(this.$store.getters);
      console.log(this.$store.getters["sessions/currentUser"]);
      return this.$store.getters["sessions/currentUser"];
    }
  }
})
export default class App extends Vue {
  test = "hey";
}
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
