<script setup lang="ts">
import type { IMetadata, PageInfo } from "@core/@types";
import { useStore } from "@core/store";
import { useModal } from "@core/hooks";
import Modal from "@core/components/Modal/Modal.vue";
import { computed, ref } from "vue";

// Two root nodes (breadcrumb + menu), so attributes from the parent go to the breadcrumb
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

const MENU_PROVIDE_NAME = "breadcrumbMenu";

const { showModal, hideModal, addModalListener } = useModal({
  provideName: MENU_PROVIDE_NAME,
});

const menuStyles = ref({});

const openMenu = (e: MouseEvent) => {
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
  menuStyles.value = { top: `${rect.bottom}px`, left: `${rect.left}px` };
  showModal();
};

const handleCrumb = (page: PageInfo) => {
  store.storeUpdateTabs(page);
  hideModal();
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
        @click="openMenu"
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
            style="max-width: 1.1rem; height: auto"
            :src="page.icon.path"
          />
          <span :title="page.title">{{ page.title }}</span>
        </div>
      </router-link>
      <div v-if="index !== shownCrumbs.length - 1">/</div>
    </div>
  </div>
  <Modal
    :provideName="MENU_PROVIDE_NAME"
    :hideModal="hideModal"
    :addModalListener="addModalListener"
    :modalStyles="menuStyles"
  >
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
            style="max-width: 1.1rem; height: auto"
            :src="page.icon.path"
          />
          <span :title="page.title">{{ page.title }}</span>
        </div>
      </router-link>
    </nav>
  </Modal>
</template>

<style lang="scss">
.breadcrumb {
  display: flex;
  align-items: center;
  min-width: 0;
  overflow: hidden;

  // Earlier crumbs shrink first down to their minimum, then the current page shrinks
  &__crumb {
    display: flex;
    align-items: center;
    min-width: 0;

    &:not(:last-child) {
      flex-shrink: 1000;
      min-width: $breadcrumb-crumb-min-width;
    }

    // "…" is already short, so it keeps its own width
    &--more:not(:last-child) {
      flex-shrink: 0;
      min-width: 0;
    }

    > div {
      flex-shrink: 0;
    }
  }

  &__menu {
    @include flex-layout;
  }

  &__page {
    all: unset;
    min-width: 0;

    > div {
      display: flex;
      column-gap: 0.4rem;
      align-items: center;

      @extend %hover-default;

      span {
        @extend %ellipsis;
      }
    }
  }
}
</style>
