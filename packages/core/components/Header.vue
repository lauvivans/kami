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

  &__content {
    display: flex;
    user-select: none;
    justify-content: space-between;
  }

  &__btn {
    flex-shrink: 0;

    @extend %button;
  }
}
</style>
