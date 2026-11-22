<script setup lang="ts">
import Text from "@core/@client/components/Text.vue";

const value = defineModel<boolean>("isChecked");
</script>

<template>
  <li class="todo-item">
    <input class="todo-item__checkbox" type="checkbox" v-model="value" />
    <Text
      class="todo-item__item"
      :style="value ? { textDecoration: 'line-through' } : ''"
    >
      <slot />
    </Text>
  </li>
</template>

<style lang="scss">
// The checkbox and the text share a line; baseline keeps the box on the
// first line of a long item.
.todo-item {
  display: flex;
  align-items: baseline;
  column-gap: $default-spacing;

  &__checkbox {
    pointer-events: none;
  }

  &__item {
    margin: 0;
    flex: 1;
  }
}
</style>
