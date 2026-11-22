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
.callout {
  display: flex;
  column-gap: $space-2;
  align-items: center;
  border-radius: $radius-md;
  line-height: $lh-body;
  padding: $space-6;
  background-color: $bg-block;
}
</style>
