<script setup lang="ts">
const props = defineProps<{
  title: string;
  subtitle?: string;
  link: string;
  icon?: string;
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
}
</style>
