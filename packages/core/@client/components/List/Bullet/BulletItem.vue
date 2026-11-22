<script setup lang="ts">
import { Text } from "../..";
import Icon from "@core/@client/components/Icon.vue";
import { Icons } from "@core/enum";
</script>

<template>
  <li class="bullet-item">
    <Icon class="bullet-item__icon" :icon="Icons.circle" />
    <Text class="bullet-item__item"><slot /> </Text>
  </li>
</template>

<style lang="scss">
.bullet-item {
  display: flex;
  align-items: flex-start;
  column-gap: $space-4;
  width: 100%;

  &__icon {
    margin-top: $space-3;
    font-size: $fs-xs;
    color: $text;
  }

  // A plain block, so inline content (code, links, highlights) flows with
  // the text instead of becoming separate flex columns.
  &__item {
    margin: 0;
    flex: 1;
    width: 100%;
  }
}
</style>
