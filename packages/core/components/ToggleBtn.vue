<script setup lang="ts">
import { inject } from "vue";

const props = defineProps<{
  active: boolean;
  toToggle: () => void;
  provideName: string;
}>();

const toggleRef = inject(props.provideName);

defineExpose({
  ref: toggleRef,
});
</script>

<template>
  <div
    class="toggle"
    role="switch"
    tabindex="0"
    :aria-checked="props.active"
    @click="props.toToggle"
    @keydown.enter.space.prevent="props.toToggle"
  >
    <slot></slot>
    <div
      class="toggle-btn"
      :class="props.active ? 'toggle-btn--active' : ''"
      @click.stop.prevent="props.toToggle"
      ref="toggleRef"
    >
      <div class="toggle-btn__circle"></div>
    </div>
  </div>
</template>

<style lang="scss">
$toggle-btn-width: $item-height + $space-1;
$toggle-btn-height: $space-6 + $space-1;

.toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: $text;
  padding: $space-3;
  font-size: $fs-xs;

  &:hover {
    @extend %hover-default;

    font-size: $fs-xs;
  }
}

.toggle-btn {
  @include sizing($toggle-btn-width, $toggle-btn-height);

  border-radius: $radius-pill;
  padding: $space-1;
  cursor: pointer;
  background-color: $text-tertiary;
  position: relative;

  &__circle {
    border-radius: 50%;
    background-color: $bg-floating;
    position: absolute;
    left: $space-1;
    transition: left 0.3s ease-in-out;

    @include sizing(
      calc($toggle-btn-width / 2),
      calc($toggle-btn-height - $space-2)
    );
  }

  &--active {
    background-color: $accent;

    .toggle-btn__circle {
      left: calc(($toggle-btn-width / 2) - $space-1);
    }
  }
}
</style>
