<script setup lang="ts">
import Text from "../../Text.vue";

const value = defineModel<boolean>("isChecked");
</script>

<template>
  <li class="todo-item">
    <input class="todo-item__checkbox" type="checkbox" v-model="value" />
    <Text :style="value ? { textDecoration: 'line-through' } : ''">
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
