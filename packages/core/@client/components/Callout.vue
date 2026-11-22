<script setup lang="ts">
const props = defineProps<{ emoji?: string }>();
</script>

<template>
  <div class="callout">
    {{ props.emoji }}
    <p>
      <slot></slot>
    </p>
  </div>
</template>

<style scoped lang="scss">
// flex-start keeps the emoji on the first line when the text wraps
.callout {
  display: flex;
  column-gap: $space-4;
  align-items: flex-start;
  border-radius: $radius-md;
  line-height: $lh-body;
  padding: $space-6 $space-6 $space-6 $space-5;
  background-color: $bg-block;
}
</style>
