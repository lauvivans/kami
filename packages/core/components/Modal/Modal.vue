<script setup lang="ts">
import { inject, onMounted, type Ref } from "vue";

const props = defineProps<{
  hideModal: () => void;
  addModalListener: () => void;
  provideName: string;
  // the dialog's accessible name
  label?: string;
}>();

const modalRef = inject<Ref<HTMLDivElement>>(props.provideName);

defineExpose({
  ref: modalRef,
});

onMounted(() => {
  props.hideModal();
  props.addModalListener();
});
</script>

<template>
  <div class="overlay" ref="modalRef">
    <dialog
      class="modal modal-static"
      :aria-label="props.label"
      aria-modal="true"
      tabindex="-1"
    >
      <slot></slot>
    </dialog>
  </div>
</template>

<style lang="scss">
dialog {
  all: unset;
}

.overlay {
  position: fixed;
  inset: 0;

  @include sizing(100%, 100%);

  background-color: $overlay;
  z-index: $z-overlay;
}

// Sizes to its content inside the visible screen; the page modal sets its own size.
.modal-static {
  z-index: $z-modal;
  box-shadow: $shadow-floating;
  border-radius: $radius-lg;
  background-color: $bg;
  animation: fade-in 1s;
  user-select: none;
  outline: none;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: $space-6 $space-7 $space-7;
  max-width: calc(100% - 2 * $space-4);
  max-height: calc(100dvh - 2 * $space-9);
  overflow: hidden auto;
}
</style>
