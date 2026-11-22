<script setup lang="ts">
const props = defineProps<{ title: string; subtitle?: string; link: string }>();
</script>

<template>
  <a class="bookmark" target="_blank" :href="props.link">
    <div class="bookmark__text">
      <span class="bookmark__title">{{ props.title }}</span>
      <span v-if="props.subtitle" class="bookmark__subtitle">{{
        props.subtitle
      }}</span>
      <span class="bookmark__url">{{
        props.link.replace(/^https?:\/\//, "")
      }}</span>
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
    min-width: 0;
    padding: $space-5 $space-6;
  }

  &__title {
    font-size: $fs-sm;
  }

  &__subtitle,
  &__url {
    @extend %ellipsis;

    font-size: $fs-xs;
    color: $text-secondary;
  }
}
</style>
