<script setup lang="ts">
const props = defineProps<{ href: string }>();
</script>

<template>
  <a class="link" target="_blank" :href="props.href"><slot /></a>
</template>

<style lang="scss">
.link {
  color: inherit;
  text-decoration: underline;
  text-decoration-color: $text-tertiary;
  text-underline-offset: $space-1;
  cursor: pointer;
  transition: text-decoration-color $duration;

  &:hover {
    text-decoration-color: $text;
  }
}
</style>
