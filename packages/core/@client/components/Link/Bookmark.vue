<script setup lang="ts">
const props = defineProps<{ title: string; subtitle?: string; link: string }>();
</script>

<template>
  <div class="bookmark">
    <a target="_blank" :href="props.link"
      ><div class="bookmark__left">
        <span class="bookmark__left__title">{{ props.title }}</span>
        <span class="bookmark__left__subtitle">{{ props.subtitle }}</span>
      </div>
      <div></div
    ></a>
  </div>
</template>

<style lang="scss">
.bookmark {
  padding: $space-6;
  border: $line solid $border;
  border-radius: $radius-md;
  display: flex;
  align-items: center;
  cursor: pointer;

  &:hover {
    background-color: $bg-hover;
  }

  a {
    all: unset;
  }

  &__left {
    display: flex;
    flex-direction: column;
    row-gap: $space-4;

    &__title {
      font-weight: $fw-regular;
    }
  }
}
</style>
