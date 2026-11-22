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

  background-color: $black-5;
  z-index: 999;
}

.modal-static {
  z-index: 2000;
  box-shadow: $box-shadow-1;
  border-radius: 5px;
  background-color: $white;
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
  padding: 2rem 1.9rem;
  overflow-y: hidden;
  height: auto;
  max-height: 80vh;

  @media (max-width: $screen-medium) {
    padding: 2rem 0.5rem;
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
