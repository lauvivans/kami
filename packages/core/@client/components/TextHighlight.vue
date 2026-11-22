<script setup lang="ts">
import type { TagColor } from "@core/@types";

const props = defineProps<{ color?: TagColor }>();
</script>

<template>
  <span class="highlight" :class="props.color && `highlight--${props.color}`"
    ><slot
  /></span>
</template>

<style scoped lang="scss">
.highlight {
  font-weight: $fw-semibold;
}

// one class per color in $tag-colors, like the database tags
@each $name, $color in $tag-colors {
  .highlight--#{$name} {
    padding: 0 $space-2;
    border-radius: $radius-sm;
    color: $tag-text;
    background-color: $color;
  }
}
</style>
