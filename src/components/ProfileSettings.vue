<template>
  <div class="ProfileSettings">
    <div :class='$style.item'>
      <div>
        <div :class="$style.icon">🎛</div>
      </div>
      <div>
        <div :class="$style.title">Action 1</div>
        <div :class="$style.description">Do Stuff</div>
      </div>
    </div>
    <div :class='$style.item'>
      <div>
        <div :class="$style.icon">🚀</div>
      </div>
      <div>
        <div :class="$style.title">Action 2</div>
        <div :class="$style.description">Do More Stuff</div>
      </div>
    </div>
    <div :class='$style.item' @click='logout'>
      <div>
        <div :class="$style.icon">👋</div>
      </div>
      <div>
        <div :class="$style.title">Logout</div>
        <div :class="$style.description">See you next time!</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Session from '@/services/Session';

@Component({})
export default class ProfileSettings extends Vue {
  async logout() {
    try {
      // await Session.logout();
      await this.$store.dispatch('sessions/logout');
      this.$notify({
        group: "main",
        type: "success",
        title: "Successfully Logged Out!",
      });
      this.$emit('logout');
      // TODO should this be moved higher parent?
      this.$router.push({ name: 'UserLoginView' });
    } catch (e) {
      this.$notify({
        group: "main",
        type: "error",
        title: "Error Logging Out",
      });
    }
  }
}
</script>

<style lang="scss" module>
@import "@/styles/variables.scss";

.item {
  display: flex;
  align-items: center;
  background-color: $color-white;
  border-top: 1px solid #e4e8eb;
  border-right: 1px solid #e4e8eb;
  border-left: 1px solid #e4e8eb;
  height: 88px;
  margin: 0 16px 0 16px;
  cursor: pointer;
  transition: $swift-ease-out;

  &:hover {
    background-color: $color-grey-lighter-2;
  }

  &:first-child {
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
  }

  &:last-child {
    border-bottom: 1px solid #e4e8eb;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    border-bottom-right-radius: 4px;
    border-bottom-left-radius: 4px;
  }
}

.icon {
  font-size: 28px;
  margin: 0 20px;
}

.title {
  font-size: 16px;
  font-weight: 600;
  color: #121212;
  margin-bottom: 8px;
}

.description {
  color: #5d6f83;
  font-weight: 400;
  font-size: 12px;
}
</style>
