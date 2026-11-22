<script setup lang="ts">
import { ref } from "vue";
import type { PageInfo } from "@core/@types";
import Icon from "@core/@client/components/Icon.vue";
import { Icons } from "@core/enum";
import MainModalView from "@core/components/Modal/MainModalView.vue";
import { useModal } from "../../../hooks";
import { useStore } from "@core/store";
import DatabaseGalleryLayout from "./DatabaseGalleryLayout.vue";
import DatabaseTableLayout from "./DatabaseTableLayout.vue";

type View = "gallery" | "table";

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
  <div class="database">
    <div class="database__navbar">
      <div class="database__menu">
        <div class="database__views">
          <button
            v-for="item in views"
            :key="item.id"
            type="button"
            class="database__view"
            :class="{ 'database__view--active': view === item.id }"
            :aria-pressed="view === item.id"
            @click="view = item.id"
          >
            <Icon :icon="item.icon" />
            <span>{{ item.label }}</span>
          </button>
        </div>
        <div class="database__actions">
          <button type="button">Filter</button>
          <button type="button">Sort</button>
        </div>
      </div>

      <h3 v-if="props.title" class="database__title">{{ props.title }}</h3>
    </div>

    <DatabaseGalleryLayout
      v-if="view === 'gallery'"
      :card-preview-is-cover="props.cardPreviewIsCover"
      :pages="props.pages"
      @open="openPage"
    />
    <DatabaseTableLayout v-else :pages="props.pages" @open="openPage" />
  </div>
  <MainModalView
    v-if="pageModal"
    provideName="pageModal"
    :page="pageModal"
    :hideMainModal="hideModal"
    :addMainModalListener="addModalListener"
  />
</template>

<style lang="scss">
.database {
  &:hover,
  &:focus-within {
    .database__actions {
      visibility: visible;
    }
  }

  &__navbar {
    @include flex-layout($row-gap: 15px);

    margin-bottom: 30px;
  }

  &__menu {
    @include flex-layout($flex-direction: row);

    justify-content: space-between;
    border-bottom: 1px solid $black-2;
  }

  &__views {
    @include flex-layout($flex-direction: row, $column-gap: 10px);
  }

  &__view {
    all: unset;
    display: flex;
    align-items: center;
    column-gap: 3px;
    cursor: pointer;
    color: $black-6;
    padding-bottom: $default-spacing;
    border-bottom: 2px solid transparent;

    &--active {
      font-weight: $fw-700;
      color: inherit;
      border-bottom-color: $black;
    }

    &:focus-visible {
      outline: 2px solid $active;
    }
  }

  &__actions {
    @include flex-layout($flex-direction: row, $column-gap: 10px);

    visibility: hidden;

    button {
      all: unset;
      color: $black-8;
      cursor: pointer;
      box-sizing: border-box;
      padding: 7px 5px;
      margin-bottom: 5px;

      &:hover {
        border-radius: 10%;
        background-color: $gray-4;
      }
    }
  }

  &__title {
    font-weight: $fw-700;
    font-size: $fs-large;
  }
}
</style>
