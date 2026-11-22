<script setup lang="ts">
import { inject, onBeforeUnmount, provide, ref, watch } from "vue";

// A plain dropdown, like Notion's menus: no overlay, and the rest of the page
// stays clickable while it is open. It opens right under `anchor` and closes
// on a press outside it, on Escape or when the parent sets `open` to false.
// `align="right"` lines up its right edge with the anchor's, for menus that open toward the left.
const props = defineProps<{
  anchor: HTMLElement | null;
  align?: "left" | "right";
}>();
const open = defineModel<boolean>("open", { required: true });

const menuRef = ref<HTMLElement | null>(null);
const position = ref({});

type Contains = (target: Node) => boolean;

// A dropdown opened inside this one is teleported out of its DOM, so it
// registers here to count as inside: a press in it keeps this one open.
const nested = new Set<Contains>();
const contains: Contains = (target) =>
  !!menuRef.value?.contains(target) ||
  !!props.anchor?.contains(target) ||
  [...nested].some((inNested) => inNested(target));

const parentNested = inject<Set<Contains> | null>("kamiDropdown", null);
parentNested?.add(contains);
provide("kamiDropdown", nested);

// pointerdown, not click: iOS Safari sends no click from a tap on a plain element.
function onPointerDown(e: PointerEvent) {
  if (!contains(e.target as Node)) open.value = false;
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
  position.value =
    props.align === "right"
      ? {
          top: `${rect.bottom}px`,
          right: `${document.documentElement.clientWidth - rect.right}px`,
        }
      : { top: `${rect.bottom}px`, left: `${rect.left}px` };
  document.addEventListener("pointerdown", onPointerDown);
  document.addEventListener("keydown", onKeydown);
});

onBeforeUnmount(() => {
  removeListeners();
  parentNested?.delete(contains);
});
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
// .modal-dynamic: the class the themes in _theme.scss color.
.modal-dynamic {
  // Fixed: the anchor's position comes from the viewport.
  position: fixed;
  z-index: 2500;
  min-width: 200px;
  padding: 6px;
  box-shadow: $box-shadow-3;
  background-color: $white;
  border-radius: 6px;
  outline: none;
  animation: fade-in 0.4s ease-in-out;
  animation-fill-mode: forwards;
  width: auto;
  height: auto;
  max-height: fit-content;

  // A static modal sets pointer-events: none on body, and the menu is teleported there.
  pointer-events: auto;
}
</style>
