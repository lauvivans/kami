<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import type { PageInfo } from "@core/@types";
import Icon from "@core/@client/components/Icon.vue";
import { Icons } from "@core/enum";
import MainModalView from "@core/components/Modal/MainModalView.vue";
import { useModal } from "@core/hooks";
import { useStore } from "@core/store";
import DatabaseGalleryLayout from "@core/components/Database/DatabaseGalleryLayout.vue";
import DatabaseTableLayout from "@core/components/Database/DatabaseTableLayout.vue";
import Dropdown from "@core/components/Dropdown.vue";
import {
  propertyValues,
  viewPages,
  type DatabaseFilter,
  type DatabaseSort,
} from "@core/util/databaseView";

type View = "gallery" | "table";
type Menu = "filter" | "sort";

const props = defineProps<{
  // the view the database opens with; the visitor can switch with the tabs
  layout: View;
  title?: string;
  cardPreviewIsCover?: boolean;
  pages: PageInfo[];
}>();

const views: { id: View; label: string; icon: Icons }[] = [
  { id: "gallery", label: "Gallery", icon: Icons.gridView },
  { id: "table", label: "Table", icon: Icons.list },
];

const view = ref<View>(props.layout);

// Filter and sort apply to every view and reset on reload
const filter = ref<DatabaseFilter>();
const sort = ref<DatabaseSort>();
const shownPages = computed(() =>
  viewPages(props.pages, filter.value, sort.value)
);
const properties = computed(() => propertyValues(props.pages));

const menu = ref<Menu | null>(null);
const menuOpen = computed({
  get: () => menu.value !== null,
  set: (open) => {
    if (!open) menu.value = null;
  },
});
const filterButton = ref<HTMLElement | null>(null);
const sortButton = ref<HTMLElement | null>(null);
const menuRef = ref<HTMLElement | null>(null);
const anchorOf = (name: Menu | null) =>
  name === "filter" ? filterButton.value : sortButton.value;
// the property whose values the Filter menu lists
const filterProperty = ref<string>();
const filterValues = computed(
  () =>
    properties.value.find((item) => item.property === filterProperty.value)
      ?.values ?? []
);

function toggleMenu(name: Menu) {
  menu.value = menu.value === name ? null : name;
  filterProperty.value = filter.value?.property;
}

// The menu is teleported to body, so focus moves into it when it opens or its
// items change, and back to its button on close; this "pre" watcher runs while
// the menu is still in the DOM.
watch([menu, filterProperty], ([name], [previous]) => {
  if (name) {
    nextTick(() =>
      menuRef.value?.querySelector<HTMLElement>("button, input")?.focus()
    );
  } else if (menuRef.value?.contains(document.activeElement)) {
    anchorOf(previous)?.focus();
  }
});

function toggleFilterValue(property: string, value: string) {
  const current =
    filter.value?.property === property ? filter.value.values : [];
  const values = current.includes(value)
    ? current.filter((item) => item !== value)
    : [...current, value];
  filter.value = values.length ? { property, values } : undefined;
}

function clear(name: Menu) {
  if (name === "filter") filter.value = undefined;
  else sort.value = undefined;
  menu.value = null;
}

const pageModal = ref<PageInfo>();

const { showModal, hideModal, addModalListener } = useModal({
  provideName: "pageModal",
});

function openPage(page: PageInfo) {
  pageModal.value = page;
  useStore.storeCurrentModalPageId(page.id);
  // waits for MainModalView to mount before showing it
  setTimeout(showModal, 250);
}
</script>

<template>
  <div class="database-block">
    <div class="database-block__navbar">
      <div class="database-block__menu">
        <div class="database-block__views">
          <button
            v-for="item in views"
            :key="item.id"
            type="button"
            class="database-block__view"
            :class="{ 'database-block__view--active': view === item.id }"
            :aria-pressed="view === item.id"
            @click="view = item.id"
          >
            <Icon :icon="item.icon" />
            <span>{{ item.label }}</span>
          </button>
        </div>
        <div
          class="database-block__actions"
          :class="{ 'database-block__actions--active': menu || filter || sort }"
        >
          <button
            ref="filterButton"
            type="button"
            aria-haspopup="true"
            :aria-expanded="menu === 'filter'"
            :class="{ 'database-block__action--active': filter }"
            @click="toggleMenu('filter')"
          >
            {{ filter ? `Filter: ${filter.values.join(", ")}` : "Filter" }}
          </button>
          <button
            ref="sortButton"
            type="button"
            aria-haspopup="true"
            :aria-expanded="menu === 'sort'"
            :class="{ 'database-block__action--active': sort }"
            @click="toggleMenu('sort')"
          >
            {{
              sort
                ? `Sort: ${sort.property ?? "Name"} ${sort.desc ? "↓" : "↑"}`
                : "Sort"
            }}
          </button>
        </div>
      </div>

      <h3 v-if="props.title" class="database-block__title">
        {{ props.title }}
      </h3>
    </div>

    <DatabaseGalleryLayout
      v-if="view === 'gallery'"
      :card-preview-is-cover="props.cardPreviewIsCover"
      :pages="shownPages"
      @open="openPage"
    />
    <DatabaseTableLayout v-else :pages="shownPages" @open="openPage" />
  </div>
  <Dropdown v-model:open="menuOpen" :anchor="anchorOf(menu)">
    <div ref="menuRef" class="database-menu">
      <template v-if="menu === 'filter'">
        <template v-if="filterProperty === undefined">
          <button
            v-for="{ property } in properties"
            :key="property"
            type="button"
            @click="filterProperty = property"
          >
            {{ property }}
          </button>
          <span v-if="!properties.length" class="database-menu__empty">
            No properties to filter by
          </span>
        </template>
        <template v-else>
          <button type="button" @click="filterProperty = undefined">
            ‹ {{ filterProperty }}
          </button>
          <label v-for="value in filterValues" :key="value">
            <input
              type="checkbox"
              :checked="
                filter?.property === filterProperty &&
                filter.values.includes(value)
              "
              @change="toggleFilterValue(filterProperty, value)"
            />
            {{ value }}
          </label>
        </template>
        <button
          v-if="filter"
          type="button"
          class="database-menu__clear"
          @click="clear('filter')"
        >
          Clear filter
        </button>
      </template>
      <template v-else-if="menu === 'sort'">
        <button
          v-for="property in [null, ...properties.map((item) => item.property)]"
          :key="property ?? ''"
          type="button"
          :aria-pressed="sort?.property === property"
          @click="sort = { property, desc: sort?.desc ?? false }"
        >
          {{ property ?? "Name" }}
        </button>
        <hr />
        <button
          v-for="desc in [false, true]"
          :key="String(desc)"
          type="button"
          :aria-pressed="sort?.desc === desc"
          @click="sort = { property: sort?.property ?? null, desc }"
        >
          {{ desc ? "Descending ↓" : "Ascending ↑" }}
        </button>
        <button
          v-if="sort"
          type="button"
          class="database-menu__clear"
          @click="clear('sort')"
        >
          Clear sort
        </button>
      </template>
    </div>
  </Dropdown>
  <MainModalView
    v-if="pageModal"
    provideName="pageModal"
    :page="pageModal"
    :hideMainModal="hideModal"
    :addMainModalListener="addModalListener"
  />
</template>

<style lang="scss">
.database-block {
  &:hover,
  &:focus-within {
    .database-block__actions {
      visibility: visible;
    }
  }

  &__navbar {
    @include flex-layout($row-gap: $space-6);

    margin-bottom: $space-8;
  }

  &__menu {
    @include flex-layout($flex-direction: row);

    justify-content: space-between;
    border-bottom: $line solid $border;
  }

  &__views {
    @include flex-layout($flex-direction: row, $column-gap: $space-4);
  }

  &__view {
    all: unset;
    display: flex;
    align-items: center;
    column-gap: $space-1;
    cursor: pointer;
    color: $text-secondary;
    padding-bottom: $space-4;
    border-bottom: $line-thick solid transparent;

    &--active {
      font-weight: $fw-bold;
      color: inherit;
      border-bottom-color: $text;
    }

    &:focus-visible {
      outline: $line-thick solid $accent;
    }
  }

  &__actions {
    @include flex-layout($flex-direction: row, $column-gap: $space-4);

    visibility: hidden;

    // an open menu or an active filter or sort keeps the buttons in sight
    &--active {
      visibility: visible;
    }

    button {
      all: unset;
      color: $text;
      cursor: pointer;
      box-sizing: border-box;
      padding: $space-3 $space-2;
      margin-bottom: $space-2;

      &:hover {
        border-radius: $radius-sm;
        background-color: $bg-hover;
      }

      &:focus-visible {
        outline: $line-thick solid $accent;
      }
    }

    .database-block__action--active {
      color: $accent;
    }
  }

  &__title {
    font-weight: $fw-bold;
    font-size: $fs-h3;
  }
}

.database-menu {
  @include flex-layout;

  button,
  label {
    @extend %hover-default;

    // no `all: unset` here: it would also undo %hover-default
    display: flex;
    align-items: center;
    column-gap: $space-4;
    box-sizing: border-box;
    border: none;
    background-color: transparent;
    font-family: inherit;
    text-align: left;

    &:focus-visible,
    &:has(:focus-visible) {
      outline: $line-thick solid $accent;
    }
  }

  [aria-pressed="true"] {
    color: $accent;
  }

  hr {
    width: 100%;
    border: none;
    border-top: $line solid $border;
  }

  &__empty {
    padding: $space-4;
    color: $text-secondary;
  }
}
</style>
