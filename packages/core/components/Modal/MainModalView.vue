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
      :isStatic="true"
      :hideModal="props.hideMainModal"
      :addModalListener="props.addMainModalListener"
    >
      <div class="page-modal__header">
        <router-link
          @click="handleNavigate"
          :to="props.page.path"
          aria-label="Go to page expanded"
        >
          <Icon class="page-modal__expand" :icon="Icons.expand" />
        </router-link>
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
  // The page wrapper shrinks to the modal's max height, so the end of a long page stays reachable.
  .modal-static {
    display: flex;
    flex-direction: column;
  }

  .page-wrapper {
    margin-top: 25px !important;
  }

  &__header {
    display: flex;
    justify-content: space-between;

    button {
      @extend %button;
    }
  }

  &__btn-settings,
  &__expand {
    @extend %button;
  }
}

@media (max-width: $screen-xs) {
  .page-modal {
    width: 100%;

    .page-content {
      top: 10px;
    }

    :has(.page-content--banner):has(.page-content--icon) {
      .page-content {
        top: 160px;
      }
    }

    :not(:has(.page-content--icon)):has(.page-content--banner) {
      .page-content {
        top: 190px;
      }
    }

    :not(:has(.page-content--banner)) {
      .page-content {
        top: 10px;
      }
    }
  }
}
</style>
