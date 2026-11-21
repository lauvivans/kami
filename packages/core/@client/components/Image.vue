<script setup lang="ts">
// Without `alt` the image is treated as decorative.
const props = defineProps<{ src: string; alt?: string }>();
</script>

<template>
  <div class="img-wrapper">
    <img :src="props.src" :alt="props.alt ?? ''" />
  </div>
</template>

<style lang="scss">
.img-wrapper {
  display: flex;
  justify-content: center;
  max-width: 100%;

  img {
    width: 100%;
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
</style>
