<script setup lang="ts">
const props = defineProps<{ level: 1 | 2 | 3 | 4 }>();
</script>

<template>
  <h1 class="heading" v-if="props.level == 1"><slot></slot></h1>
  <h2 class="heading" v-if="props.level == 2"><slot></slot></h2>
  <h3 class="heading" v-if="props.level == 3"><slot></slot></h3>
  <h4 class="heading" v-if="props.level == 4"><slot></slot></h4>
</template>

<style scoped lang="scss">
// The margin adds to the page's gap between blocks, so a heading has more
// space above than below.
.heading {
  font-weight: $fw-semibold;
  line-height: $lh-heading;
}

h1 {
  font-size: $fs-h1;
  margin-top: $space-8;
}

h2 {
  font-size: $fs-h2;
  margin-top: $space-7;
}

h3 {
  font-size: $fs-h3;
  margin-top: $space-6;
}

h4 {
  font-size: $fs-md;
  margin-top: $space-5;
}
</style>
