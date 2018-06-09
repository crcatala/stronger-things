<template>
  <div>
    <div :class='$style.AppHeader'>
      <div :class='$style.leftSide'>
        <router-link to='/' :class='$style.brand'>
          <BrandLogo/>
        </router-link>
        <div :class='$style.AppHeader__nav'>
          <!-- <router-link :class='$style.AppHeader__link' :active-class="$style['AppHeader__link--active']" :to="{ name: 'ProfileView'}">Profile</router-link> -->
          <router-link :class='$style.AppHeader__link' :active-class="$style['AppHeader__link--active']" :to="{ name: 'HistoryView'}">History</router-link>
          <router-link :class='$style.AppHeader__link' :active-class="$style['AppHeader__link--active']" :to="{ name: 'ExercisesView'}">Exercises</router-link>
          <router-link :class='$style.AppHeader__link' :active-class="$style['AppHeader__link--active']" :to="{ name: 'RoutinesView'}">Routines</router-link>
          <!-- <router-link :class='$style.AppHeader__link' :active-class="$style['AppHeader__link--active']" :to="{ name: 'MeasureView'}">Measure</router-link> -->
        </div>
      </div>
      <div @click='profileDrawerVisible = true' :class='$style.UserProfileButton'>
        {{ currentUser.username }}
      </div>
    </div>
    <Backdrop v-if='profileDrawerVisible' @close='profileDrawerVisible = false' />
    <DrawerRight v-if='profileDrawerVisible' @close='profileDrawerVisible = false' backgroundColor='#fcfcfd'>
      <div :class='$style.profileDrawerTitle'>Settings</div>
      <ProfileSettings @logout='profileDrawerVisible = false' />
    </DrawerRight>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import BrandLogo from "@/components/BrandLogo.vue";
import DrawerRight from "@/components/DrawerRight.vue";
import ProfileSettings from "@/components/ProfileSettings.vue";
import Backdrop from "@/components/Backdrop.vue";

@Component({
  components: {
    BrandLogo,
    ProfileSettings,
    DrawerRight,
    Backdrop
  }
})
export default class AppHeader extends Vue {
  @Prop() private msg!: string;

  profileDrawerVisible: boolean = false;

  get currentUser() {
    return this.$store.getters["sessions/currentUser"];
  }
}
</script>

<style lang='scss' module>
@import "@/styles/variables.scss";
@import "@/styles/mixins.scss";

.AppHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: $color-white;
  padding: 0 $app-gutter-spacing;
  border-bottom: 1px solid $color-grey-lighter;

  &__link {
    display: inline-block;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: $color-grey-dark;
    text-decoration: none;
    padding: 16px 0;
    margin: 0 10px;
    opacity: 0.7;
    border-bottom: 2px solid transparent;
    transition: $swift-ease-out;

    &:hover {
      opacity: 1;
    }
  }

  &__link--active {
    opacity: 1;
    border-bottom: 2px solid $color-blue;
  }
}

.leftSide {
  display: flex;
  // justify-content: center;
  align-items: center;
}
.brand {
  @include reset-link-style;
  margin-right: 24px;
}

.profileDrawerTitle {
  color: $color-grey;
  text-transform: uppercase;
  text-align: center;
  // margin: 24px 0;
  margin: 32px 0 24px 0;
}

.UserProfileButton {
  border-radius: 6px;
  border: 1px solid transparent;
  transition: border-color 0.2s;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  user-select: none;
  cursor: pointer;

  &:hover {
    background-color: #f9f9f9;
    border: 1px solid #e4e8eb;
  }
}
</style>
