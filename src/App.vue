<template>
  <AppBootstrapper :class="$style.app">
    <AppHeader v-if='!$route.meta.fullScreen' />
    <!-- <UpdateChecker/> -->
    <transition name="route"
                mode="out-in">
      <router-view :key='$route.path' />
    </transition>
    <notifications group="main"
                   position="bottom right"
                   style='bottom: 16px; right: 16px;' />
    <modals-container class='app-modal-container' />
  </AppBootstrapper>
</template>

<script>
import { Component, Vue } from "vue-property-decorator";
import AppBootstrapper from "@/components/AppBootstrapper.vue";
import AppHeader from "@/components/AppHeader.vue";
import UpdateChecker from "@/components/UpdateChecker.vue";

export default {
  components: {
    AppBootstrapper,
    AppHeader,
    UpdateChecker
  }
};
</script>

<style lang="scss" module>
@import "@/styles/variables.scss";

.app {
  min-width: $app-min-width;
}
</style>
