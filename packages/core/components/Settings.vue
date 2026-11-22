<script setup lang="ts">
import { FontFamily } from "@core/enum";
import { useToggle } from "@core/hooks";
import { useStore } from "@core/store";
import { watch } from "vue";
import Dropdown from "@core/components/Dropdown.vue";
import ToggleBtn from "@core/components/ToggleBtn.vue";
import { storeToRefs } from "pinia";

const store = useStore;

const { getDynamicPageInfo } = storeToRefs(store);

const props = defineProps<{
  anchor: HTMLElement | null;
  pageId: string;
}>();
const open = defineModel<boolean>("open", { required: true });

const PAGE_SIZE_PROVIDE_NAME = "pageSize";
const FONT_SIZE_PROVIDE_NAME = "fontSize";

const fontFamilyEntries = Object.entries(FontFamily) as [
  keyof typeof FontFamily,
  string,
][];

function isActiveFont(key: keyof typeof FontFamily) {
  const fontFamily =
    store.getDynamicPageInfo[props.pageId]?.settings.fontFamily;
  return fontFamily ? fontFamily === key : key === "font-roboto";
}

const { active: activeFontSize, toToggle: toToggleFontSize } = useToggle({
  provideName: FONT_SIZE_PROVIDE_NAME,
  isActive:
    getDynamicPageInfo.value[props.pageId]?.settings.fontSize ===
    "font-size-small",
});

const { active: activePageSize, toToggle: toTogglePageSize } = useToggle({
  provideName: PAGE_SIZE_PROVIDE_NAME,
  isActive:
    getDynamicPageInfo.value[props.pageId]?.settings.pageSize ===
    "page-full-width",
});

watch(activePageSize, (newPageSize) => {
  store.storeDynamicPageInfo({
    pageSize: newPageSize ? "page-full-width" : "page-default-width",
  });
});

watch(activeFontSize, (newFontSize) => {
  store.storeDynamicPageInfo({
    fontSize: newFontSize ? "font-size-small" : "font-size-default",
  });
});
</script>

<template>
  <Dropdown v-model:open="open" :anchor="props.anchor" align="right">
    <div class="modal-settings__style">
      <span>Style</span>
      <div class="modal-settings__fonts">
        <div
          v-for="[key, value] in fontFamilyEntries"
          :key="key"
          class="modal-settings__font-wrapper"
          role="button"
          tabindex="0"
          :aria-pressed="isActiveFont(key)"
          @click="store.storeDynamicPageInfo({ fontFamily: key })"
          @keydown.enter.space.prevent="
            store.storeDynamicPageInfo({ fontFamily: key })
          "
          :class="{ 'modal-settings__font-wrapper--active': isActiveFont(key) }"
        >
          <span class="modal-settings__ag">Ag</span>
          <span class="modal-settings__font-name">{{ value }}</span>
        </div>
      </div>
    </div>

    <div class="modal-settings__size-and-width">
      <ToggleBtn
        :provideName="FONT_SIZE_PROVIDE_NAME"
        :active="activeFontSize"
        :toToggle="toToggleFontSize"
        >Small Text</ToggleBtn
      >
      <ToggleBtn
        :provideName="PAGE_SIZE_PROVIDE_NAME"
        :active="activePageSize"
        :toToggle="toTogglePageSize"
        >Full width</ToggleBtn
      >
    </div>
  </Dropdown>
</template>

<style lang="scss">
.modal-settings {
  &__style {
    padding: $space-4 0;
    border-bottom: $line solid $border;
    display: flex;
    flex-direction: column;
    row-gap: $space-6;

    > span {
      font-size: $fs-xs;
      color: $text-secondary;
      font-weight: $fw-semibold;
    }
  }

  &__ag {
    color: $text-secondary;
    font-stretch: condensed;
    font-size: $fs-h3;
  }

  &__font-name {
    color: $text-tertiary;
    font-weight: $fw-semibold;
    font-size: $fs-xs;
  }

  &__fonts {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }

  &__font-wrapper {
    display: flex;
    flex-direction: column;
    row-gap: $space-4;
    align-items: center;
    border-radius: $radius-md;
    cursor: pointer;
    transition: background-color 0.2s;
    padding: $space-2 $space-1;

    &:nth-child(1) {
      font-family: $font-sans;
    }

    &:nth-child(2) {
      font-family: $font-serif;
    }

    &:nth-child(3) {
      font-family: $font-mono;
    }

    &:hover {
      background-color: $bg-hover;
    }

    &--active {
      animation: blink 1s;

      .modal-settings__ag {
        color: $accent;
      }
    }
  }

  &__size-and-width {
    display: flex;
    flex-direction: column;
    row-gap: $space-4;
    padding: $space-6 $space-1 $space-4;

    @media (max-width: $screen-xs) {
      display: none;
    }
  }
}
</style>
