<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from "vue";

// A plain dropdown, like Notion's menus: no overlay, and the rest of the page
// stays clickable while it is open. It opens right under `anchor` and closes
// on a press outside it, on Escape or when the parent sets `open` to false.
const props = defineProps<{ anchor: HTMLElement | null }>();
const open = defineModel<boolean>("open", { required: true });

const menuRef = ref<HTMLElement | null>(null);
const position = ref({});

// pointerdown, not click: iOS Safari sends no click from a tap on a plain element.
function onPointerDown(e: PointerEvent) {
  const target = e.target as Node;
  if (!menuRef.value?.contains(target) && !props.anchor?.contains(target)) {
    open.value = false;
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === "Escape") open.value = false;
}

function removeListeners() {
  document.removeEventListener("pointerdown", onPointerDown);
  document.removeEventListener("keydown", onKeydown);
}

watch(open, (isOpen) => {
  if (!isOpen || !props.anchor) return removeListeners();
  const rect = props.anchor.getBoundingClientRect();
  position.value = { top: `${rect.bottom}px`, left: `${rect.left}px` };
  document.addEventListener("pointerdown", onPointerDown);
  document.addEventListener("keydown", onKeydown);
});

onBeforeUnmount(removeListeners);
</script>

<template>
  <!-- In body, so no overflow: hidden of the parent clips it -->
  <Teleport to="body">
    <div
      v-if="open"
      ref="menuRef"
      class="modal-dynamic dropdown"
      :style="position"
    >
      <slot />
    </div>
  </Teleport>
</template>

<style lang="scss">
// Same look as the other menus (.modal-dynamic from Modal.vue), but fixed:
// the anchor's position comes from the viewport.
.dropdown.modal-dynamic {
  position: fixed;
}
</style>
