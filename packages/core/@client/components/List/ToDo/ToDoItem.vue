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
  column-gap: $space-4;

  // As tall as one line of text (Text.vue uses $lh-body), so the
  // checkbox is centered on the first line, also when the text wraps.
  &__box {
    display: flex;
    align-items: center;
    height: calc($lh-body * 1em);
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
