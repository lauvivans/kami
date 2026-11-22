<script setup lang="ts">
import { ref } from "vue";
import type { PageInfo } from "@core/@types";
import MainModalView from "@core/components/Modal/MainModalView.vue";
import { useModal } from "../../../hooks";
import { useStore } from "@core/store";
import DatabaseGalleryLayout from "./DatabaseGalleryLayout.vue";
import DatabaseTableLayout from "./DatabaseTableLayout.vue";

const props = defineProps<{
  layout: "gallery" | "table";
  title?: string;
  cardPreviewIsCover?: boolean;
  pages: PageInfo[];
}>();

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
  <DatabaseGalleryLayout
    v-if="props.layout === 'gallery'"
    :card-preview-is-cover="props.cardPreviewIsCover"
    :title="props.title"
    :pages="props.pages"
    @open="openPage"
  />
  <DatabaseTableLayout
    v-else
    :title="props.title"
    :pages="props.pages"
    @open="openPage"
  />
  <MainModalView
    v-if="pageModal"
    provideName="pageModal"
    :page="pageModal"
    :hideMainModal="hideModal"
    :addMainModalListener="addModalListener"
  />
</template>
