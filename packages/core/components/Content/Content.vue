<script setup lang="ts">
import type { PageInfo } from "@core/@types";

const { page } = defineProps<{ page: PageInfo }>();
</script>

<template>
  <div
    class="page-content"
    :class="{
      'page-content--banner': page.banner?.path,
      'page-content--icon': page.icon,
    }"
  >
    <slot />
    <div class="page-content__end"></div>
  </div>
</template>

<style lang="scss">
.page-content {
  // minmax(0, 1fr) keeps a wide block from stretching the column past the page.
  @include grid-layout(minmax(0, 1fr));

  position: absolute;
  top: $space-10;
  left: 50%;
  transform: translate(-50%, 0%);
  z-index: $z-raised;
  width: 50%;
  row-gap: $space-4;

  // room below the last block
  &__end {
    height: calc($space-10 * 2);
  }

  &--icon {
    top: calc($space-10 + $icon-size-mobile);
  }
}

.page-full-width .page-content {
  padding: 0 $space-9 !important;
  width: 100% !important;
}

@media (max-width: $screen-xs) {
  .page-wrapper .page-content {
    width: 100% !important;
    padding: 0 $page-gutter-mobile !important;
  }
}
</style>
