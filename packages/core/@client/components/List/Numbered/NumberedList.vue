<script setup lang="ts">
import { computed } from "vue";
import NumberedItem from "./NumberedItem.vue";

const props = withDefaults(
  defineProps<{ items?: string[]; start?: number }>(),
  {
    start: 1,
  }
);

// Each list starts its own counter, so nested lists count from their start.
const style = computed(() => ({
  counterReset: `numbered-list ${props.start - 1}`,
}));
</script>

<template>
  <ol class="numbered-list" :start="props.start" :style="style">
    <template v-if="props.items && props.items.length > 0"
      ><NumberedItem
        v-for="(item, index) in props.items"
        :key="`${item}-${index}`"
        >{{ item }}</NumberedItem
      ></template
    >
    <template v-else><slot /></template>
  </ol>
</template>

<style lang="scss">
.numbered-list {
  width: 100%;
}
</style>
