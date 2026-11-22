<script setup lang="ts">
import { useId } from "vue";
import Text from "@core/@client/components/Text.vue";
import Icon from "@core/@client/components/Icon.vue";
import { Icons } from "@core/enum";

const value = defineModel<boolean>("isChecked");
const labelId = useId();
</script>

<template>
  <li class="todo-item">
    <span class="todo-item__box">
      <input
        class="todo-item__checkbox"
        type="checkbox"
        v-model="value"
        :aria-labelledby="labelId"
      />
      <Icon v-if="value" class="todo-item__check" :icon="Icons.check" />
    </span>
    <Text
      :id="labelId"
      class="todo-item__item"
      :class="{ 'todo-item__item--done': value }"
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

  // As tall as one line of text plus Text's padding, so the checkbox is
  // centered on the first line, also when the text wraps.
  &__box {
    position: relative;
    display: flex;
    align-items: center;
    height: calc($lh-body * 1em + 2 * $space-1);
  }

  // Drawn by hand for the rounded corners and the accent color
  &__checkbox {
    appearance: none;
    flex-shrink: 0;
    width: $space-6;
    height: $space-6;
    margin: 0;
    border: $line-thick solid $text-secondary;
    border-radius: $radius-sm;
    pointer-events: none;

    &:checked {
      border-color: $accent;
      background-color: $accent;
    }
  }

  // Two classes, to win over .icon
  & &__check {
    position: absolute;
    inset: 0;
    justify-content: center;
    font-size: $space-5;
    color: $text-inverse;
    pointer-events: none;
  }

  &__item {
    margin: 0;
    flex: 1;

    &--done {
      color: $text-tertiary;
      text-decoration: line-through;
    }
  }
}
</style>
