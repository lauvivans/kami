<script setup lang="ts">
import { ref } from "vue";
import { Breadcrumb } from "@core/@client/components";
import { Icons } from "@core/enum";
import Icon from "@core/@client/components/Icon.vue";
import type { IMetadata } from "@core/@types";
import Settings from "@core/components/Settings.vue";
import { useStore } from "@core/store";

const store = useStore;

const props = defineProps<{ metadata: IMetadata }>();

const settingsOpen = ref(false);
const settingsBtn = ref<HTMLElement | null>(null);
</script>

<template>
  <header class="header">
    <div class="header__content">
      <Breadcrumb :metadata="props.metadata" />
      <div></div>
      <button
        class="header__btn"
        id="header-btn"
        ref="settingsBtn"
        @click="settingsOpen = !settingsOpen"
        type="button"
        aria-label="Open settings"
        aria-haspopup="menu"
        :aria-expanded="settingsOpen"
      >
        <Icon :icon="Icons.moreHorizontal" />
      </button>
    </div>
  </header>
  <Settings
    v-model:open="settingsOpen"
    :anchor="settingsBtn"
    :pageId="
      store.getDynamicCurrentPageInfo
        ? store.getDynamicCurrentPageInfo.pageId
        : 'not-found'
    "
  />
</template>

<style lang="scss">
.header {
  background-color: $bg;
  height: $header-height;
  z-index: $z-header;
  font-size: $fs-sm;

  &__content {
    display: flex;
    align-items: center;
    gap: $space-2;
    height: 100%;
    user-select: none;
    justify-content: space-between;
  }

  &__btn {
    @extend %button;

    flex-shrink: 0;
    justify-content: center;
    padding: 0;
    width: $item-height;
    height: $item-height;
    color: $text-secondary;
    transition: background-color $duration;

    &,
    &:hover {
      border-radius: $radius-md;
    }

    .icon {
      color: inherit;
      font-size: $fs-md;
    }
  }
}
</style>
