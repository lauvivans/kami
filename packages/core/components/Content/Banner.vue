<script setup lang="ts">
import type { PageInfo } from "@core/@types";

const { page } = defineProps<{ page: PageInfo }>();
</script>

<template>
  <div v-if="page.banner" class="page-banner">
    <img :src="page.banner.path" />
    <a
      v-if="page.banner.link && page.banner.author"
      :href="page.banner.link"
      target="_blank"
      >{{ page.banner.author }}</a
    >
  </div>
</template>

<style lang="scss">
.page-banner {
  width: 100%;
  height: $banner-height;
  max-height: $banner-height;
  position: relative;

  a {
    all: unset;
    display: block;
    position: absolute;
    background-color: $bg-floating;
    color: $text;
    bottom: 0;
    right: 0;
    margin-right: $space-6;
    margin-bottom: $space-5;
    padding: $space-4;
    border-radius: $radius-sm;
    cursor: pointer;
    font-size: $fs-sm;
    z-index: $z-raised;

    &:hover {
      color: $text-secondary;
      background-color: $bg-block;
    }
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
