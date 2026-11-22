<script setup lang="ts">
import type { PageInfo } from "@core/@types";

const { page } = defineProps<{ page: PageInfo }>();
</script>

<template>
  <div class="page-title">
    <div v-if="page.icon" class="page-title__img-wrapper">
      <img alt="" :src="page.icon.path" /><a
        v-if="page.icon.link && page.icon.author"
        target="_blank"
        :href="page.icon.link"
        >{{ page.icon.author }}</a
      >
    </div>
    <span>{{ page.title }}</span>
  </div>
</template>

<style lang="scss">
.page-title {
  display: flex;
  flex-direction: column;
  row-gap: $space-6;

  &__img-wrapper {
    display: flex;
    flex-direction: column;
    width: max-content;

    a {
      cursor: pointer;
      font-size: $fs-xs;
      align-self: flex-end;
    }
  }

  img {
    width: $icon-size;
    height: $icon-size;
    object-fit: contain;
  }

  span {
    font-size: $fs-title;
    font-weight: $fw-bold;
    line-height: $lh-heading;
  }
}

// The icon overlaps the banner by half its size, painted above it.
.page-content--banner .page-title__img-wrapper {
  position: relative;
  z-index: $z-raised;
  margin-top: calc($icon-size / -2);
}

@media (min-width: $screen-small) {
  .font-size-small .page-title {
    span {
      font-size: $fs-title-mobile;
    }
  }
}

@media (max-width: $screen-small) {
  .page-title {
    img {
      width: $icon-size-mobile;
      height: $icon-size-mobile;
    }

    span {
      font-size: $fs-title-mobile;
    }
  }

  .page-content--banner .page-title__img-wrapper {
    margin-top: calc($icon-size-mobile / -2);
  }
}
</style>
