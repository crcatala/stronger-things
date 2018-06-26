<template>
  <div class='ExerciseList'>
    <Card>
      <ExerciseItem v-for='(item, index) in items'
                    :key='index'
                    :item='item' />
    </Card>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Card from "@/components/Card.vue";
import ExerciseItem from "@/components/ExerciseItem.vue";

@Component({
  components: {
    Card,
    ExerciseItem
  }
})
export default class ExerciseList extends Vue {
  @Prop() private items!: Array<object>;
}
</script>

<style lang='scss' module>
</style>
