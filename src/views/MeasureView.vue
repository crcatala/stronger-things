<template>
  <div class='MeasureView' :class='$style.MeasureView'>
    <h1>Measure</h1>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Parse from '@/services/Parse';;

@Component
export default class MeasureView extends Vue {
  @Prop() private msg!: string;

  async login() {
    try {
      const res = await Parse.User.logIn('test', 'password');
      console.log('success', res);
    } catch (e) {
      console.log('error', e);
    }
  }

  created() {
    // Parse.User.logIn("myname", "mypass", {
    //   success: function(user: any) {
    //     console.log('success', user)
    // },
    // error: function(user: any, error: any) {
    //   console.log('error', user, error)
    //   // The login failed. Check error to see why.
    // }});
    this.login();
  }
}
</script>

<style lang='scss' module>
@import "@/styles/variables.scss";

.MeasureView {
  padding: 0 $app-content-gutter-spacing;
}
</style>
