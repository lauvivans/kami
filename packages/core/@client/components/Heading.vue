<script setup lang="ts">
import Empty from "./Empty.vue";

const props = defineProps<{ level: 1 | 2 | 3 | 4 }>();
</script>

<template>
  <Empty />
  <h1 class="heading" v-if="props.level == 1"><slot></slot></h1>
  <h2 class="heading" v-if="props.level == 2"><slot></slot></h2>
  <h3 class="heading" v-if="props.level == 3"><slot></slot></h3>
  <h4 class="heading" v-if="props.level == 4"><slot></slot></h4>
</template>

<style scoped lang="scss">
.heading {
  font-weight: $fw-semibold;
  line-height: $lh-heading;
}

h1 {
  font-size: $fs-h1;
}

h2 {
  font-size: $fs-h2;
}

h3 {
  font-size: $fs-h3;
}

h4 {
  font-size: $fs-md;
}
</style>
