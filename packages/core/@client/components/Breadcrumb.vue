<script setup lang="ts">
import type { IMetadata, PageInfo } from "@core/@types";
import { useStore } from "@core/store";
import { computed, onBeforeUnmount, ref, watch } from "vue";

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

// A plain dropdown, like Notion: no overlay, and the rest of the page stays clickable.
const menuOpen = ref(false);
const menuStyles = ref({});
const menuRef = ref<HTMLElement | null>(null);
// The "…" button; a template ref inside v-for would be an array
let moreButton: HTMLElement | null = null;

// pointerdown, not click: iOS Safari sends no click from a tap on a plain element.
function onPointerDown(e: PointerEvent) {
  const target = e.target as Node;
  if (!menuRef.value?.contains(target) && !moreButton?.contains(target)) {
    closeMenu();
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === "Escape") closeMenu();
}

function closeMenu() {
  menuOpen.value = false;
  document.removeEventListener("pointerdown", onPointerDown);
  document.removeEventListener("keydown", onKeydown);
}

function toggleMenu(e: MouseEvent) {
  if (menuOpen.value) return closeMenu();
  moreButton = e.currentTarget as HTMLElement;
  const rect = moreButton.getBoundingClientRect();
  menuStyles.value = { top: `${rect.bottom}px`, left: `${rect.left}px` };
  menuOpen.value = true;
  document.addEventListener("pointerdown", onPointerDown);
  document.addEventListener("keydown", onKeydown);
}

// Another page has other hidden crumbs
watch(hiddenCrumbs, closeMenu);
onBeforeUnmount(closeMenu);

const handleCrumb = (page: PageInfo) => {
  store.storeUpdateTabs(page);
  closeMenu();
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
            style="max-width: 1.1rem; height: auto"
            :src="page.icon.path"
          />
          <span :title="page.title">{{ page.title }}</span>
        </div>
      </router-link>
      <div v-if="index !== shownCrumbs.length - 1">/</div>
    </div>
  </div>
  <!-- In body: the breadcrumb's overflow: hidden would clip it -->
  <Teleport to="body">
    <nav
      v-if="menuOpen"
      ref="menuRef"
      class="modal-dynamic breadcrumb__menu"
      aria-label="Hidden pages"
      :style="menuStyles"
    >
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
  </Teleport>
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
  }

  // Same look as the other menus (.modal-dynamic from Modal.vue), but fixed
  // under "…", since the header it belongs to is fixed too.
  &__menu.modal-dynamic {
    @include flex-layout;

    position: fixed;
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
