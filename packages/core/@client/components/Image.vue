<script setup lang="ts">
import { computed, inject, ref } from "vue";
import Icon from "@core/@client/components/Icon.vue";
import { Icons } from "@core/enum";
import { INLINE_IMAGE } from "@core/constants/image";

const props = withDefaults(
  defineProps<{
    src: string;
    // empty marks a decorative image
    alt?: string;
    zoomable?: boolean;
  }>(),
  { alt: "", zoomable: true }
);

const inline = inject(INLINE_IMAGE, false);
const canZoom = computed(() => props.zoomable && !inline);

const trigger = ref<HTMLButtonElement>();
const viewer = ref<HTMLDialogElement>();

function open() {
  viewer.value?.showModal();
}

function close() {
  viewer.value?.close();
}

// Covers Escape too, which closes the dialog natively. Safari doesn't focus a
// button on click, so focus goes back by hand instead of by the browser.
function onClose() {
  trigger.value?.focus();
}

// The dialog fills the screen, so a click that lands on it and not on the
// image or the close button is a click on the backdrop.
function onViewerClick(event: MouseEvent) {
  if (event.target === viewer.value) close();
}
</script>

<template>
  <div class="img-wrapper">
    <template v-if="canZoom">
      <button
        ref="trigger"
        type="button"
        class="img-wrapper__trigger"
        :aria-label="props.alt ? undefined : 'Open image'"
        aria-haspopup="dialog"
        @click="open"
      >
        <img :src="props.src" :alt="props.alt" />
      </button>
      <!-- In <body>, so the page behind (which scrolls on its own) can't
           scroll under the backdrop. -->
      <Teleport to="body">
        <dialog
          ref="viewer"
          class="image-viewer"
          :aria-label="props.alt || 'Image'"
          @click="onViewerClick"
          @close="onClose"
        >
          <img class="image-viewer__img" :src="props.src" :alt="props.alt" />
          <button
            type="button"
            class="image-viewer__close"
            aria-label="Close"
            @click="close"
          >
            <Icon :icon="Icons.close" />
          </button>
        </dialog>
      </Teleport>
    </template>
    <img v-else :src="props.src" :alt="props.alt" />
  </div>
</template>

<style lang="scss">
.img-wrapper {
  display: flex;
  justify-content: center;
  max-width: 100%;

  img {
    width: 100%;
    border-radius: $radius-md;
  }

  &__trigger {
    all: unset;
    display: flex;
    width: 100%;
    cursor: zoom-in;
    border-radius: $radius-md;

    &:focus-visible {
      outline: $line-thick solid $accent;
    }
  }
}

@media (min-width: $screen-medium) {
  .page-full-width {
    .img-wrapper {
      justify-content: flex-start;
      max-width: 43%;
    }
  }
}

.page-full-width .img-wrapper,
.img-wrapper {
  @media (max-width: $screen-xs) {
    max-width: 100%;

    img {
      width: 100%;
    }
  }
}

// Inside a list item the image sits in the text line, like an icon next to
// a link. Last in the file so it wins over the page-width rules above.
.bullet-item .img-wrapper,
.todo-item .img-wrapper {
  display: inline-flex;
  vertical-align: middle;

  // Vue drops the whitespace between tags on separate lines, so keep a gap.
  margin-inline-end: $space-2;

  img {
    width: auto;
    max-height: $icon-size-inline;
    border-radius: 0;
  }
}

// A modal <dialog> renders in the browser's top layer, above every z-index,
// so it needs none. The modals' global `dialog { all: unset }` also drops the
// browser's hiding of a closed dialog, so it is set here again.
.image-viewer {
  all: unset;
  position: fixed;
  inset: 0;
  box-sizing: border-box;
  width: 100%;
  height: 100dvh;
  padding: $space-9 $space-6;
  cursor: zoom-out;

  &[open] {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &:not([open]) {
    display: none;
  }

  &::backdrop {
    background-color: $overlay;
  }

  // natural size at most, fitted inside the padding
  &__img {
    display: block;
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    border-radius: $radius-md;
    box-shadow: $shadow-floating;
    cursor: default;
  }

  &__close {
    @extend %button;

    position: absolute;
    top: $space-5;
    right: $space-5;
    padding: $space-2;
    border-radius: $radius-sm;
    font-size: $fs-h3;
    background-color: $bg-floating;
    color: $text;
    box-shadow: $shadow-floating;

    &:hover {
      background-color: $bg-floating;
      color: $text-secondary;
    }

    &:focus-visible {
      outline: $line-thick solid $accent;
    }

    .icon {
      color: inherit;
      font-size: inherit;
    }
  }
}
</style>
