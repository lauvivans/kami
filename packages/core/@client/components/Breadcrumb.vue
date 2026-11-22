<script setup lang="ts">
import type { IMetadata, PageInfo } from "@core/@types";
import { useStore } from "@core/store";
import Dropdown from "@core/components/Dropdown.vue";
import { computed, ref, shallowRef, watch } from "vue";

// Two root nodes (breadcrumb + dropdown), so attributes from the parent go to the breadcrumb
defineOptions({ inheritAttrs: false });

const props = defineProps<{ metadata: IMetadata }>();

const store = useStore;

const breadcrumbs = computed(() => {
  if (store.activePage) {
    const breadcrumbs = [];
    let newActivePage = store.activePage;

    if (newActivePage.parentPage) {
      let parentPage = props.metadata.pages[newActivePage.parentPage];
      breadcrumbs.unshift(newActivePage);

      while (parentPage) {
        newActivePage = parentPage;
        breadcrumbs.unshift(newActivePage);

        if (newActivePage.parentPage) {
          parentPage = props.metadata.pages[newActivePage.parentPage];
        } else {
          parentPage = undefined;
        }
      }
    } else {
      breadcrumbs.push(newActivePage);
    }

    return breadcrumbs;
  }

  return [];
});

// Like Notion: past 3 levels, show the first and the last two pages and move the rest into a menu
const hiddenCrumbs = computed(() =>
  breadcrumbs.value.length > 3 ? breadcrumbs.value.slice(1, -2) : []
);

const shownCrumbs = computed(() =>
  hiddenCrumbs.value.length
    ? [breadcrumbs.value[0], null, ...breadcrumbs.value.slice(-2)]
    : breadcrumbs.value
);

const menuOpen = ref(false);
// The "…" button; a template ref inside v-for would be an array
const moreButton = shallowRef<HTMLElement | null>(null);

function toggleMenu(e: MouseEvent) {
  moreButton.value = e.currentTarget as HTMLElement;
  menuOpen.value = !menuOpen.value;
}

// Another page has other hidden crumbs
watch(hiddenCrumbs, () => (menuOpen.value = false));

const handleCrumb = (page: PageInfo) => {
  store.storeUpdateTabs(page);
  menuOpen.value = false;
};
</script>

<template>
  <div class="breadcrumb" v-bind="$attrs">
    <div
      class="breadcrumb__crumb"
      :class="{ 'breadcrumb__crumb--more': !page }"
      v-for="(page, index) in shownCrumbs"
      :key="page?.id ?? 'more'"
    >
      <button
        v-if="!page"
        class="breadcrumb__page"
        type="button"
        aria-label="Show hidden pages"
        aria-haspopup="menu"
        :aria-expanded="menuOpen"
        @click="toggleMenu"
      >
        <div>…</div>
      </button>
      <router-link
        v-else-if="page.path"
        class="breadcrumb__page"
        :to="page.path"
        @click="handleCrumb(page)"
      >
        <div>
          <img
            v-if="page.icon"
            class="breadcrumb__icon"
            :src="page.icon.path"
          />
          <span :title="page.title">{{ page.title }}</span>
        </div>
      </router-link>
      <div v-if="index !== shownCrumbs.length - 1" class="breadcrumb__sep">
        /
      </div>
    </div>
  </div>
  <Dropdown v-model:open="menuOpen" :anchor="moreButton">
    <nav class="breadcrumb__menu" aria-label="Hidden pages">
      <router-link
        v-for="page in hiddenCrumbs"
        :key="page.id"
        class="breadcrumb__page"
        :to="page.path"
        @click="handleCrumb(page)"
      >
        <div>
          <img
            v-if="page.icon"
            class="breadcrumb__icon"
            :src="page.icon.path"
          />
          <span :title="page.title">{{ page.title }}</span>
        </div>
      </router-link>
    </nav>
  </Dropdown>
</template>

<style lang="scss">
.breadcrumb {
  display: flex;
  align-items: center;

  // Takes the free header space instead of sizing by its crumbs, whose
  // `width` below is only a shrink floor and would make it too narrow.
  flex: 1 1 0;
  min-width: 0;
  overflow: hidden;

  // Earlier crumbs shrink first down to their minimum, then the current page shrinks
  &__crumb {
    display: flex;
    align-items: center;
    min-width: 0;

    // Sized by content; the automatic minimum is then the smaller of the
    // content and `width`, so a short title like "Menu" leaves no gap.
    &:not(:last-child) {
      flex: 0 1000 content;
      width: $breadcrumb-crumb-min-width;
      min-width: auto;
    }

    // "…" is already short, so it keeps its own width
    &--more:not(:last-child) {
      flex-shrink: 0;
      min-width: 0;
    }

    > div {
      flex-shrink: 0;
    }

    &:last-child .breadcrumb__page > div {
      color: $text;
    }
  }

  &__sep {
    color: $text-tertiary;
    padding: 0 $space-1;
  }

  &__icon {
    max-width: $icon-size-inline;
    height: auto;
  }

  &__menu {
    @include flex-layout;
  }

  &__page {
    all: unset;
    min-width: 0;

    > div {
      display: flex;
      column-gap: $space-3;
      align-items: center;

      @extend %hover-default;

      box-sizing: border-box;
      height: $item-height;
      padding: 0 $space-3;
      font-weight: $fw-regular;

      span {
        @extend %ellipsis;
      }
    }
  }
}
</style>
