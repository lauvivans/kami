<script setup lang="ts">
import { inject, onMounted, type Ref } from "vue";

const props = defineProps<{
  hideModal: () => void;
  addModalListener: () => void;
  provideName: string;
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
    <dialog class="modal modal-static">
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

.modal-static {
  z-index: $z-modal;
  box-shadow: $shadow-floating;
  border-radius: $radius-md;
  background-color: $bg-floating;
  animation: fade-in 1s;
  transition: width 0.3s;
  user-select: none;
  outline: none;
  min-width: 70%;
  max-width: 80%;
  width: auto;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: $space-8;
  overflow-y: hidden;
  height: auto;
  max-height: 80vh;

  @media (max-width: $screen-medium) {
    padding: $space-8 $space-4;
    max-width: 90%;
    min-width: 90%;
  }
}

@media (max-width: $screen-xs) {
  .modal-static {
    max-height: 70vh;
  }
}
</style>
