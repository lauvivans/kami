<script setup lang="ts">
import { useId } from "vue";
import Text from "@core/@client/components/Text.vue";

const value = defineModel<boolean>("isChecked");
const labelId = useId();
</script>

<template>
  <li class="todo-item">
    <input
      class="todo-item__checkbox"
      type="checkbox"
      v-model="value"
      :aria-labelledby="labelId"
    />
    <Text
      :id="labelId"
      :style="value ? { textDecoration: 'line-through' } : ''"
    >
      <slot />
    </Text>
  </li>
</template>

<style lang="scss">
.todo-item {
  &__checkbox {
    pointer-events: none;
  }
}
</style>
