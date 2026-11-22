<script setup lang="ts">
import { provide } from "vue";
import { Text } from "../..";
import { INLINE_IMAGE } from "@core/constants/image";

provide(INLINE_IMAGE, true);
</script>

<template>
  <li class="numbered-item">
    <Text class="numbered-item__item"><slot /> </Text>
  </li>
</template>

<style lang="scss">
.numbered-item {
  display: flex;
  align-items: flex-start;
  column-gap: $space-4;
  width: 100%;
  counter-increment: numbered-list;

  // The number sits on the first line: same padding and line height as Text.
  &::before {
    content: counter(numbered-list) ".";
    min-width: $space-6;
    padding: $space-1 0;
    line-height: $lh-body;
    color: $text;
    font-variant-numeric: tabular-nums;
  }

  &__item {
    margin: 0;
    flex: 1;
    width: 100%;
  }
}
</style>
