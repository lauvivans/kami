<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { Icons } from "@core/enum";

const props = defineProps<{
  icon: Icons;
}>();
</script>

<template>
  <div class="icon" v-if="props.icon">
    <Icon :icon="props.icon" />
  </div>
</template>

<style lang="scss">
.icon {
  color: $text-tertiary;
  font-size: $icon-size-inline;
  display: flex;
  align-items: center;
}
</style>
