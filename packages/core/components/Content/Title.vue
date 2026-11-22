<script setup lang="ts">
import type { PageInfo } from "@core/@types";

const { page } = defineProps<{ page: PageInfo }>();
</script>

<template>
  <div class="page-title">
    <div class="page-title__img-wrapper">
      <img v-if="page.icon" :src="page.icon.path" /><a
        v-if="page.icon?.link && page.icon?.author"
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
  row-gap: $space-8;

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
    max-width: $icon-size;
  }

  span {
    font-size: $fs-title;
    font-weight: $fw-bold;
  }
}

@media (min-width: $screen-small) {
  .font-size-small .page-title {
    span {
      font-size: $fs-title-mobile;
    }
  }
}

@media (max-width: $screen-xs) {
  .page-wrapper .page-title {
    span {
      font-size: $fs-title-mobile;
    }
  }
}
</style>
