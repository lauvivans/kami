<script setup lang="ts">
import type { DatabaseTag, PageInfo } from "@core/@types";
import { tagColorClass, tagName } from "@core/util/tagColorClass";

const props = defineProps<{
  cardPreviewIsCover: boolean;
  pages: PageInfo[];
}>();

const emit = defineEmits<{ open: [page: PageInfo] }>();

function handleCard(page: PageInfo) {
  emit("open", page);
}

// the tags of every multi-select property, shown under the card title; two
// properties can share a tag name, so the template keys them by index
const tagsOf = (page: PageInfo): DatabaseTag[] =>
  Object.values(page.databaseInfo ?? {}).flatMap(({ value }) =>
    Array.isArray(value) ? value : []
  );
</script>

<template>
  <div class="gallery">
    <div class="gallery__cards-wrapper">
      <div
        class="gallery__card-wrapper"
        v-for="page in pages"
        :key="page.id"
        tabindex="-1"
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
        <div class="gallery__card-body">
          <div class="gallery__card-title">
            <img
              class="gallery__page-icon"
              v-if="page.icon"
              :src="page.icon.path"
            />
            <div>{{ page.title }}</div>
          </div>
          <div v-if="tagsOf(page).length" class="multi-select">
            <div
              v-for="(item, index) in tagsOf(page)"
              :key="index"
              :class="tagColorClass(item)"
            >
              {{ tagName(item) }}
            </div>
          </div>
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
    gap: $space-5;
  }

  &__card-wrapper {
    border: $line solid $border;
    border-radius: $radius-lg;
    overflow: hidden;
    cursor: pointer;
    font-size: $fs-sm;
    color: $text;
    background-color: $bg;
    transition: background-color $duration;

    &:hover {
      background-color: $bg-hover;
    }

    // "Load more" moves focus to the first new card
    &:focus-visible {
      outline: $line-thick solid $accent;
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

  &__card-body {
    @include flex-layout($row-gap: $space-3);

    padding: $space-4 $space-5 $space-5;
  }

  &__card-title {
    @include flex-layout($flex-direction: row, $column-gap: $space-4);

    align-items: center;
    font-weight: $fw-medium;
  }

  &__page-icon {
    width: $icon-size-inline;
  }
}
</style>
