<script setup lang="ts">
import Text from "@core/@client/components/Text.vue";

const value = defineModel<boolean>("isChecked");
</script>

<template>
  <li class="todo-item">
    <span class="todo-item__box">
      <input class="todo-item__checkbox" type="checkbox" v-model="value" />
    </span>
    <Text
      class="todo-item__item"
      :style="value ? { textDecoration: 'line-through' } : ''"
    >
      <slot />
    </Text>
  </li>
</template>

<style lang="scss">
.todo-item {
  display: flex;
  align-items: flex-start;
  column-gap: $default-spacing;

  // As tall as one line of text (Text.vue uses line-height 1.5), so the
  // checkbox is centered on the first line, also when the text wraps.
  &__box {
    display: flex;
    align-items: center;
    height: 1.5em;
  }

  &__checkbox {
    margin: 0;
    pointer-events: none;
  }

  &__item {
    margin: 0;
    flex: 1;
  }
}
</style>
