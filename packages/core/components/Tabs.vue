<script setup lang="ts">
import Icon from "@core/@client/components/Icon.vue";
import { onBeforeUnmount, onMounted } from "vue";
import { useStore } from "@core/store";
import { Icons } from "@core/enum";
import { setActiveTab, setTabs } from "@core/util/local-storage";

const store = useStore;

const emit = defineEmits<{
  navigate: [path: string];
}>();

function updateActiveTab(index: number) {
  store.storeActiveTab(index);
  if (store.tabs[index]) emit("navigate", store.tabs[index].pagePath);
}

function addTab() {
  const tabs = store.getTabs;
  const activePage = store.getActivePage;
  tabs.push({
    pageId: activePage.id,
    pageName: activePage.title,
    pagePath: activePage.path,
  });
  store.storeTabs(tabs);
  const index = tabs.length - 1;
  store.storeActiveTab(index);
  store.storeActivePage(activePage);
  emit("navigate", activePage.path);
}

function removeTab(index: number) {
  const tabs = store.getTabs;
  if (tabs.length > 1) {
    tabs.splice(index, 1);
    store.storeTabs(tabs);
    store.storeActiveTab(0);
    if (tabs[0]) emit("navigate", tabs[0].pagePath);
  }
}

function saveTabs() {
  setTabs(store.tabs);
  setActiveTab(store.activeTab);
}

onMounted(() => {
  window.addEventListener("load", () =>
    store.storeUpdateTabs(store.activePage)
  );
  window.addEventListener("beforeunload", saveTabs);
});

onBeforeUnmount(() => {
  window.removeEventListener("load", () =>
    store.storeUpdateTabs(store.activePage)
  );
  window.addEventListener("beforeunload", saveTabs);
});
</script>

<template>
  <div class="tabs">
    <div
      v-for="[index, page] in store.tabs.entries()"
      class="tabs__tab"
      :key="index"
      :class="store.activeTab == index ? 'tabs__tab--active' : ''"
      @click.stop="updateActiveTab(index)"
    >
      <span>{{ page.pageName }}</span>
      <button class="tabs__tab--close" @click.stop="removeTab(index)">
        <Icon :icon="Icons.close" />
      </button>
    </div>
    <button
      class="tabs__add"
      @click.stop="addTab()"
      v-if="store.tabs.length < 10"
    >
      <Icon :icon="Icons.add" />
    </button>
  </div>
</template>

<style lang="scss">
.app .tabs {
  display: flex;
  background-color: $bg-tabs;
  top: 0;
  height: $tabs-height;
  z-index: $z-tabs;

  @media (max-width: $screen-small) {
    top: auto;
    bottom: 0;
    overflow-x: auto;

    &::-webkit-scrollbar,
    &::-webkit-scrollbar-track,
    &::-webkit-scrollbar-thumb {
      visibility: hidden;
    }
  }

  &__tab {
    all: unset;
  }

  &__tab,
  &__add,
  &__tab--close {
    outline: none;
    border: none;
    cursor: pointer;
    background-color: transparent;
  }

  &__tab {
    padding: $space-4;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: $tab-width;
    font-size: $fs-sm;
    border-right: $line solid $border;
    color: $text-secondary;

    span {
      @extend %ellipsis;
    }

    @media (max-width: $screen-small) {
      min-width: $tab-width-mobile;
    }

    &:hover {
      background-color: $bg-hover;
    }

    &--active {
      background-color: $bg;
      color: $text;

      &:hover {
        background-color: $bg;
      }
    }

    &--close {
      visibility: hidden;
    }
  }

  &__tab:hover {
    .tabs__tab--close {
      visibility: visible;
    }
  }

  &__add {
    @include spacing($mt: auto, $mb: auto, $ml: $space-4);
  }

  &__add,
  &__tab--close {
    @extend %button;
  }
}
</style>
