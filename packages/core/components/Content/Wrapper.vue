<script setup lang="ts">
import { useStore } from "@core/store";

const store = useStore;
</script>

<template>
  <main
    v-if="store.getDynamicCurrentPageInfo"
    class="page-wrapper"
    :class="[
      store.getDynamicCurrentPageInfo?.settings.fontSize,
      store.getDynamicCurrentPageInfo?.settings.fontFamily,
      store.getDynamicCurrentPageInfo?.settings.pageSize,
    ]"
  >
    <slot />
  </main>
</template>

<style lang="scss">
.page-wrapper {
  overflow: hidden auto;
  position: relative;
  width: 100%;
  margin-top: calc($header-height + $tabs-height);
  height: calc(100vh - ($header-height + $tabs-height));
  height: calc(100dvh - ($header-height + $tabs-height));

  // Keeps the z-indexes inside the page (banner, mentions) below the header.
  isolation: isolate;

  @media (max-width: $screen-small) {
    margin-top: $header-height;
  }
}

.font-roboto-mono {
  font-family: $font-mono;
}

.font-roboto-serif {
  font-family: $font-serif;
}

@media (min-width: $screen-small) {
  .font-size-small {
    p,
    span,
    div:not(:has(h1, h2, h3, h4)) {
      font-size: $fs-sm;
    }
  }
}
</style>
