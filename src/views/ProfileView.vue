<template>
  <div class='ProfileView' :class='$style.root'>
    <h1>Profile</h1>
    <Card>
      <h3>Activity</h3>
      Hey
    </Card>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Card from '@/components/Card.vue'

@Component({
  components: {
    Card
  }
})
export default class ProfileView extends Vue {
  @Prop() private msg!: string;
}
</script>

<style lang='scss' module>
@import "@/styles/variables.scss";

.root {
  padding: 0 $app-content-gutter-spacing;
}
</style>
