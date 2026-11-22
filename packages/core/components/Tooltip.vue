<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, useId } from "vue";

// A text that ends in an ellipsis when it doesn't fit, and shows the full text
// in a tooltip on hover or keyboard focus, only when it is actually cut off.
const props = defineProps<{ text: string }>();

const DELAY_MS = 500;

const id = useId();
const textRef = ref<HTMLElement | null>(null);
const tipRef = ref<HTMLElement | null>(null);
const shown = ref(false);
const position = ref({});
let trigger: HTMLElement | null = null;
let timer: ReturnType<typeof setTimeout> | undefined;

async function show() {
  const el = textRef.value!;
  if (el.scrollWidth <= el.clientWidth) return;
  shown.value = true;
  trigger!.setAttribute("aria-describedby", id);
  document.addEventListener("keydown", onKeydown);
  await nextTick();
  if (!tipRef.value) return; // hidden again before it rendered
  // Below the trigger, moved above or left when it would leave the viewport
  const rect = trigger!.getBoundingClientRect();
  const tip = tipRef.value!.getBoundingClientRect();
  const { clientWidth, clientHeight } = document.documentElement;
  const top =
    rect.bottom + tip.height > clientHeight
      ? rect.top - tip.height
      : rect.bottom;
  const left = Math.max(0, Math.min(rect.left, clientWidth - tip.width));
  position.value = { top: `${top}px`, left: `${left}px` };
}

function schedule() {
  clearTimeout(timer);
  timer = setTimeout(show, DELAY_MS);
}

function hide() {
  clearTimeout(timer);
  shown.value = false;
  trigger?.removeAttribute("aria-describedby");
  document.removeEventListener("keydown", onKeydown);
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === "Escape") hide();
}

const events = {
  // A tap on a touch laptop also fires pointerenter; only hover pointers show it.
  pointerenter: (e: Event) => {
    if ((e as PointerEvent).pointerType !== "touch") schedule();
  },
  pointerleave: hide,
  focusin: schedule,
  focusout: hide,
} as const;

onMounted(() => {
  // The link or button around the text gets focus; a plain item, like a tab, is its parent
  trigger = textRef.value!.closest("a, button") ?? textRef.value!.parentElement;
  for (const [name, fn] of Object.entries(events))
    trigger!.addEventListener(name, fn);
});

onBeforeUnmount(() => {
  hide();
  for (const [name, fn] of Object.entries(events))
    trigger?.removeEventListener(name, fn);
});
</script>

<template>
  <span ref="textRef" class="ellipsis">
    {{ props.text }}
    <!-- In body, so the sidebar's overflow doesn't clip it -->
    <Teleport to="body">
      <div
        v-if="shown"
        :id="id"
        ref="tipRef"
        class="tooltip"
        role="tooltip"
        :style="position"
      >
        {{ props.text }}
      </div>
    </Teleport>
  </span>
</template>

<style lang="scss">
.tooltip {
  position: fixed;
  z-index: $z-tooltip;
  max-width: 100vw;
  box-sizing: border-box;
  padding: $space-1 $space-3;
  border-radius: $radius-sm;
  box-shadow: $shadow-floating;
  background-color: $text;
  color: $text-inverse;
  font-size: $fs-xs;
  line-height: $lh-body;
  overflow-wrap: anywhere;
  pointer-events: none;

  // Touch screens have no hover, and a tap opens the page
  @media (hover: none) {
    display: none;
  }
}
</style>
