<script setup lang="ts">
import { ref } from "vue";
import Modal from "@core/components/Modal/Modal.vue";
import Icon from "@core/@client/components/Icon.vue";
import type { PageInfo } from "@core/@types";
import { Banner, Wrapper, Content, Title } from "@core/components/Content";
import { Icons } from "@core/enum";
import Settings from "@core/components/Settings.vue";
import DatabaseInfo from "@core/components/DatabaseInfo.vue";

const props = defineProps<{
  hideMainModal: () => void;
  addMainModalListener: () => void;
  provideName: string;
  page: PageInfo;
}>();

const settingsOpen = ref(false);
const settingsBtn = ref<HTMLElement | null>(null);

const handleNavigate = () => {
  props.hideMainModal();
};
</script>

<template>
  <Teleport to="body">
    <Modal
      class="page-modal"
      :provideName="props.provideName"
      :hideModal="props.hideMainModal"
      :addModalListener="props.addMainModalListener"
    >
      <div class="page-modal__header">
        <router-link
          @click="handleNavigate"
          :to="props.page.path"
          aria-label="Open as full page"
        >
          <Icon class="page-modal__expand" :icon="Icons.expand" />
        </router-link>
        <div class="page-modal__actions">
          <button
            class="page-modal__btn-settings"
            id="settings-btn"
            ref="settingsBtn"
            @click="settingsOpen = !settingsOpen"
            type="button"
            aria-label="Open settings"
            aria-haspopup="menu"
            :aria-expanded="settingsOpen"
          >
            <Icon :icon="Icons.moreHorizontal" />
          </button>
          <button type="button" aria-label="Close" @click="props.hideMainModal">
            <Icon :icon="Icons.close" />
          </button>
        </div>
      </div>
      <Wrapper>
        <Banner :page="props.page" />
        <Content :page="props.page">
          <Title :page="props.page" />
          <DatabaseInfo :page="props.page" />
          <component :is="page.component" :page="props.page" />
        </Content>
      </Wrapper>
      <Settings
        v-model:open="settingsOpen"
        :anchor="settingsBtn"
        :pageId="props.page.id"
      />
    </Modal>
  </Teleport>
</template>

<style lang="scss">
.page-modal {
  // The visible height minus a margin; dvh follows the mobile toolbar, vh is
  // the fallback. The page wrapper scrolls, so the end of a long page stays reachable.
  .modal-static {
    display: flex;
    flex-direction: column;
    width: min($modal-width, calc(100% - 2 * $space-9));
    max-width: none;
    height: calc(100vh - 2 * $space-9);
    height: calc(100dvh - 2 * $space-9);
    max-height: none;
    padding: 0;
    overflow: hidden;
  }

  .page-wrapper {
    flex: 1;
    height: auto;
    margin-top: 0;
  }

  // The modal's own header sits above the page, so a page without a banner
  // starts the column at the top.
  .page-content:not(.page-content--banner) {
    padding-top: 0;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    flex-shrink: 0;
    padding: $space-4 $space-5;

    button {
      @extend %button;
    }
  }

  &__actions {
    display: flex;
    column-gap: $space-2;
  }

  &__expand {
    @extend %button;
  }
}

@media (max-width: $screen-small) {
  .page-modal .modal-static {
    width: calc(100% - 2 * $space-4);
    height: calc(100vh - 2 * $space-4);
    height: calc(100dvh - 2 * $space-4);
  }
}
</style>
