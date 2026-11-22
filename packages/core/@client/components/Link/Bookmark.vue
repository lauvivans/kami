<script setup lang="ts">
const props = defineProps<{
  title: string;
  subtitle?: string;
  link: string;
  icon?: string;
  image?: string;
}>();
</script>

<template>
  <a class="bookmark" target="_blank" :href="props.link">
    <div class="bookmark__text">
      <span class="bookmark__title">{{ props.title }}</span>
      <span v-if="props.subtitle" class="bookmark__subtitle">{{
        props.subtitle
      }}</span>
      <span class="bookmark__url">
        <img
          v-if="props.icon"
          class="bookmark__icon"
          :src="props.icon"
          alt=""
        />
        <span>{{ props.link.replace(/^https?:\/\//, "") }}</span>
      </span>
    </div>
    <div v-if="props.image" class="bookmark__image">
      <img :src="props.image" alt="" />
    </div>
  </a>
</template>

<style lang="scss">
.bookmark {
  display: flex;
  overflow: hidden;
  border: $line solid $border;
  border-radius: $radius-md;
  color: inherit;
  text-decoration: none;
  transition: background-color $duration;

  &:hover {
    background-color: $bg-hover;
  }

  &__text {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: $space-1;
    min-width: 0;
    padding: $space-5 $space-6;
  }

  &__title {
    font-size: $fs-sm;
    font-weight: $fw-medium;
  }

  &__subtitle,
  &__url {
    font-size: $fs-xs;
    color: $text-secondary;
  }

  &__subtitle {
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-clamp: 2;
  }

  &__url {
    display: flex;
    gap: $space-3;
    align-items: center;

    span {
      @extend %ellipsis;
    }
  }

  &__icon {
    flex-shrink: 0;
    width: $icon-size-inline;
    height: $icon-size-inline;
    object-fit: contain;
  }

  // The image is absolute, so the text alone sets the card's height.
  &__image {
    position: relative;
    flex: 0 0 $bookmark-image-width;

    @media (max-width: $screen-small) {
      display: none;
    }

    img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}
</style>
