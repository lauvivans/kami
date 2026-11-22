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
// A centered reading column in normal flow, below the banner.
.page-content {
  // minmax(0, 1fr) keeps a wide block from stretching the column past the page.
  @include grid-layout(minmax(0, 1fr));

  row-gap: $space-4;
  max-width: calc($page-width + 2 * $page-gutter);
  margin: 0 auto;
  padding: $space-9 $page-gutter 0;

  // The icon overlaps the banner, so the column starts right below it.
  &--banner {
    padding-top: 0;
  }

  // room below the last block
  &__end {
    height: $space-10;
  }
}

.page-content--banner:not(.page-content--icon) {
  padding-top: $space-8;
}

.page-full-width .page-content {
  max-width: none;
}

@media (max-width: $screen-small) {
  .page-content {
    padding-left: $page-gutter-mobile;
    padding-right: $page-gutter-mobile;
  }
}
</style>
