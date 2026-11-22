<script setup lang="ts">
import type { PageInfo } from "@core/@types";

const props = defineProps<{
  cardPreviewIsCover: boolean;
  pages: PageInfo[];
}>();

const emit = defineEmits<{ open: [page: PageInfo] }>();

function handleCard(page: PageInfo) {
  emit("open", page);
}
</script>

<template>
  <div class="gallery">
    <div class="gallery__cards-wrapper">
      <div
        class="gallery__card-wrapper"
        v-for="page in pages"
        :key="page.id"
        @click.stop="handleCard(page)"
      >
        <div
          class="gallery__card-content"
          :class="{
            'gallery__card-content--padded': !props.cardPreviewIsCover,
          }"
        >
          <component
            class="gallery__card-content--content"
            v-if="!props.cardPreviewIsCover"
            :is="page.component"
            :page="page"
            :hideDatabase="true"
          />
          <div v-else class="gallery__card-content--banner">
            <img v-if="page.banner" :src="page.banner.path" />
          </div>
        </div>
        <div class="gallery__card-footer">
          <img
            class="gallery__page-icon"
            v-if="page.icon"
            :src="page.icon.path"
          />
          <div>{{ page.title }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.gallery {
  overflow-x: auto;

  &__cards-wrapper {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax($card-min-width, 1fr));
    gap: $space-4;
  }

  &__card-wrapper {
    border: $line solid $border;
    border-radius: $radius-md;
    cursor: pointer;
    font-size: $fs-sm;
    color: $text-secondary;

    &:hover {
      background-color: $bg-hover;
    }
  }

  &__card-content {
    @include flex-layout($row-gap: $space-6);

    background-color: $bg-block;
    height: $card-cover-height;
    overflow: hidden;

    &--padded {
      padding: $space-6 $space-5 0;
    }

    &--banner {
      height: 100%;

      > img {
        object-fit: cover;
        height: 100%;
        width: 100%;
      }
    }
  }

  &__card-footer {
    padding: $space-4;

    @include flex-layout($flex-direction: row, $column-gap: $space-4);

    align-items: center;
    font-weight: $fw-bold;
  }

  &__page-icon {
    width: $icon-size-inline;
  }
}
</style>
