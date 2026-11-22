<script setup lang="ts">
const props = defineProps<{ src: string }>();
</script>

<template>
  <div class="img-wrapper">
    <img :src="props.src" />
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
  }
}
</style>
