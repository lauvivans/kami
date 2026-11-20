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
  <div class="toggle" @click="props.toToggle">
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
$toggle-btn-width: 30px;
$toggle-btn-height: 18px;

.toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: $black-7;
  padding: 0.35rem;
  font-size: 0.73rem;

  &:hover {
    @extend %hover-default;

    font-size: 0.73rem;
  }
}

.toggle-btn {
  @include sizing($toggle-btn-width, $toggle-btn-height);

  border-radius: 34px;
  padding: 2px;
  cursor: pointer;
  background-color: $gray-stroke;
  position: relative;

  &__circle {
    border-radius: 50%;
    background-color: $white;
    position: absolute;
    left: 2px;
    transition: left 0.3s ease-in-out;

    @include sizing(
      calc($toggle-btn-width / 2),
      calc($toggle-btn-height - 4px)
    );
  }

  &--active {
    background-color: $active;

    .toggle-btn__circle {
      left: calc(($toggle-btn-width / 2) - 2px);
    }
  }
}
</style>
