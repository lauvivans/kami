<script setup lang="ts">
import {
  ref,
  computed,
  inject,
  type Ref,
  watch,
  onMounted,
  onBeforeUnmount,
} from "vue";
import { useIsMobile, useModal } from "@core/hooks";
import NestedLink from "@core/components/NestedLink.vue";
import Modal from "@core/components/Modal/Modal.vue";
import Icon from "@core/@client/components/Icon.vue";
import { useStore } from "@core/store";
import { Icons, Theme } from "@core/enum";
import setAsideOpen from "@core/util/local-storage/aside/setAsideOpen";
import getAsideOpen from "@core/util/local-storage/aside/getAsideOpen";
import {
  ASIDE_MAIN_CONTAINER,
  ASIDE_MAIN_CONTENT,
} from "@core/constants/aside";
import type { IMetadata } from "@core/@types";

const store = useStore;
const isAsideOpen = getAsideOpen();
const SETTINGS_MODAL_PROVIDE = "settingsModal";
const SEARCH_MODAL_PROVIDE = "searchModal";
const navDefault = ref(!isAsideOpen);
const navHover = ref(false);
const navWrapper = ref<HTMLElement>();
const navClick = ref(isAsideOpen);
const navBtnIcon = ref(isAsideOpen ? Icons.doubleArrowLeft : Icons.sandwich);
const asideDefault = ref(!isAsideOpen);
const mainContainerDefault = inject<Ref<boolean>>(ASIDE_MAIN_CONTAINER);
const mainContentDefault = inject<Ref<boolean>>(ASIDE_MAIN_CONTENT);

const props = defineProps<{ metadata: IMetadata }>();

store.storeDropStaleTabs(props.metadata.pages);

const asideClasses = computed(() => {
  return {
    "aside-default": asideDefault.value,
    "aside-click": !asideDefault.value,
  };
});

const navClasses = computed(() => {
  return {
    "nav-default": navDefault.value,
    "nav-hover": navHover.value,
    "nav-click": navClick.value,
  };
});

const {
  showModal: showSettingsModal,
  hideModal: hideSettingsModal,
  addModalListener: addSettingsModalListener,
} = useModal({ provideName: SETTINGS_MODAL_PROVIDE });

const {
  showModal: showSearchModal,
  hideModal: hideSearchModal,
  addModalListener: addSearchModalListener,
} = useModal({ provideName: SEARCH_MODAL_PROVIDE });

function togglePageState(isDefault = true) {
  asideDefault.value = isDefault;

  if (mainContainerDefault && mainContentDefault) {
    mainContainerDefault.value = isDefault;
    mainContentDefault.value = isDefault;
  }
}

function toggleNavState() {
  if (navClick.value) {
    togglePageState();

    navDefault.value = true;
    navClick.value = false;
    store.storeIsAsideOpen(false);

    if (canHover()) {
      navHover.value = true;
    }
  } else {
    togglePageState(false);

    navDefault.value = false;
    navHover.value = false;
    navClick.value = true;
    store.storeIsAsideOpen(true);
  }
}

// Touch screens fire mouseenter on tap, so only a pointer that can hover opens the floating sidebar.
const canHover = () => window.matchMedia("(hover: hover)").matches;

function toggleNavHover(toShow = false) {
  if (asideDefault.value) {
    navHover.value = toShow && canHover();
  }
}

function closeNavHoverOutside(event: Event) {
  if (!navWrapper.value?.contains(event.target as Node)) {
    navHover.value = false;
  }
}

watch(navClasses, (currentClass) => {
  if (currentClass["nav-hover"]) {
    navBtnIcon.value = Icons.doubleArrowRight;
  } else if (currentClass["nav-default"]) {
    navBtnIcon.value = Icons.sandwich;
  } else if (currentClass["nav-click"]) {
    navBtnIcon.value = Icons.doubleArrowLeft;
  }
});

const isMobile = useIsMobile();

// On small screens the open or floating sidebar covers the page, so close it after navigation.
watch(
  () => store.activePage,
  () => {
    if (!isMobile.value) return;
    if (navClick.value) toggleNavState();
    navHover.value = false;
  }
);

function saveAsideOpen() {
  setAsideOpen(store.isAsideOpen);
}

onMounted(() => {
  window.addEventListener("beforeunload", saveAsideOpen);
  document.addEventListener("pointerdown", closeNavHoverOutside);
});

onBeforeUnmount(() => {
  window.removeEventListener("beforeunload", saveAsideOpen);
  document.removeEventListener("pointerdown", closeNavHoverOutside);
});
</script>

<template>
  <aside :class="asideClasses">
    <div
      class="nav-wrapper"
      ref="navWrapper"
      @mouseenter="toggleNavHover(true)"
      @mouseleave="toggleNavHover()"
    >
      <nav :class="navClasses">
        <div class="nav-btn" role="button" id="nav-btn" @click="toggleNavState">
          <Icon :icon="navBtnIcon" />
        </div>
        <div class="nav-list-wrapper">
          <ul class="nav-list">
            <li class="nav-list__nav-item">
              <span>{{ props.metadata.user.author }}</span>
              {{ props.metadata.user.socialMedia }}
            </li>
            <li class="nav-list__nav-item">
              <div role="button" @click="showSearchModal">
                <Icon :icon="Icons.search" />
                <span>Search</span>
              </div>
              <div role="button" id="settings-btn" @click="showSettingsModal">
                <Icon :icon="Icons.settings" />
                <span>Settings</span>
              </div>
            </li>
            <li class="nav-list__nav-item">
              <div>
                <div class="nav-list__nav-item--category">Favorites</div>
                <NestedLink
                  :ids="
                    props.metadata.favorites.filter(
                      (id) =>
                        props.metadata.pages[id] &&
                        !props.metadata.pages[id].parentPage
                    )
                  "
                  :metadata="props.metadata"
                />
              </div>
              <div>
                <div class="nav-list__nav-item--category">Private</div>
                <NestedLink
                  :ids="
                    Object.entries(props.metadata.pages)
                      .filter(([_, value]) => !value.parentPage)
                      .map(([key]) => key)
                  "
                  :metadata="props.metadata"
                />
              </div>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  </aside>
  <Teleport to="body">
    <Modal
      class="settings-modal"
      :provideName="SETTINGS_MODAL_PROVIDE"
      :addModalListener="addSettingsModalListener"
      :hideModal="hideSettingsModal"
    >
      <div class="settings-modal__head">
        <h2>Settings</h2>
        <button type="button" aria-label="Close" @click="hideSettingsModal">
          <Icon :icon="Icons.close" />
        </button>
      </div>
      <fieldset class="settings-modal__themes">
        <legend>Theme</legend>
        <label
          v-for="[key, name] in Object.entries(Theme)"
          :key="key"
          class="settings-modal__theme"
        >
          <input
            type="radio"
            name="theme"
            :value="key"
            :checked="store.getTheme === key"
            @change="store.storeTheme(key as keyof typeof Theme)"
          />
          <!-- The theme class sets that theme's colors on the preview only. -->
          <span class="theme-preview" :class="key" aria-hidden="true">
            <span class="theme-preview__sidebar">
              <span class="theme-preview__line"></span>
              <span class="theme-preview__line"></span>
            </span>
            <span class="theme-preview__page">
              <span
                class="theme-preview__line theme-preview__line--title"
              ></span>
              <span class="theme-preview__line"></span>
              <span
                class="theme-preview__line theme-preview__line--accent"
              ></span>
              <span class="theme-preview__block"></span>
            </span>
          </span>
          {{ name }}
        </label>
      </fieldset>
    </Modal>

    <Modal
      :provideName="SEARCH_MODAL_PROVIDE"
      :addModalListener="addSearchModalListener"
      :hideModal="hideSearchModal"
    >
      <div>Not build yet</div>
    </Modal>
  </Teleport>
</template>

<style lang="scss">
.nav-wrapper {
  color: $text-secondary;
  user-select: none;

  // the same 28px square as the header buttons, so they line up
  .nav-btn {
    @extend %button;

    justify-content: center;
    padding: 0;
    width: $item-height;
    height: $item-height;
    margin-left: $space-5;
    color: $text-secondary;

    &,
    &:hover {
      border-radius: $radius-md;
    }

    .icon {
      color: inherit;
      font-size: $fs-md;
    }
  }

  .nav-default .nav-list {
    display: none;
  }

  .nav-hover {
    @include flex-layout($row-gap: $space-8);

    border-radius: $radius-sm;
    width: $sidebar-width;

    .nav-list {
      box-shadow: $shadow-floating;

      @include spacing($mt: $space-1, $pb: $space-4);

      transform: translateX(-100%);
      animation: slide-in 0.4s ease-in-out;
      animation-fill-mode: forwards;
      padding-right: $space-6;
      background-color: $bg-floating;
      border-radius: $radius-md;
      height: min-content;
      max-height: 75vh;

      &__nav-item {
        width: 100%;
      }
    }
  }

  .nav-click {
    @include flex-layout($flex-direction: row-reverse, $row-gap: $space-8);

    &:hover {
      .nav-btn {
        visibility: visible;
      }
    }

    .nav-btn {
      visibility: hidden;
      position: absolute;
      left: 78%;
      z-index: $z-raised;
      margin: $space-5 $space-6 0;
    }

    .nav-list {
      position: absolute;
      inset: 0;
      z-index: $z-content;
    }
  }

  .nav-hover,
  .nav-click {
    .nav-list {
      @include flex-layout($row-gap: $space-7);

      font-size: $fs-sm;

      &__nav-item:nth-child(1) {
        @include flex-layout($row-gap: $space-2);

        font-size: $fs-xs;

        @include spacing($ml: $space-5, $pt: $space-5);

        span {
          color: $text;
          font-size: $fs-md;
        }
      }

      &__nav-item:nth-child(2) {
        @include flex-layout($row-gap: $space-1);

        margin: $space-4;

        & > div {
          @include flex-layout($flex-direction: row, $column-gap: $space-3);

          align-items: center;

          @extend %hover-default;
        }
      }

      &__nav-item:nth-child(3) {
        display: flex;
        flex-direction: column;
        row-gap: $space-8;
        height: max-content;
        width: $nested-link-size;
        margin: 0 $space-1 $space-5 $space-5;
        overflow: hidden auto;

        .nested-link {
          width: $nested-link-size;
        }
      }

      &__nav-item--category {
        margin-bottom: $space-4;
        font-weight: $fw-semibold;
        font-size: $fs-xs;
      }
    }
  }
}

.settings-modal {
  .modal-static {
    width: min($settings-width, calc(100% - 2 * $space-4));
  }

  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: $space-5;

    h2 {
      font-size: $fs-md;
      font-weight: $fw-semibold;
    }

    button {
      @extend %button;
    }
  }

  &__themes {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: $space-5;
    border: 0;
    margin: 0;
    padding: 0;

    legend {
      margin-bottom: $space-4;
      font-size: $fs-xs;
      font-weight: $fw-medium;
      color: $text-secondary;
    }
  }

  &__theme {
    position: relative;
    display: grid;
    gap: $space-3;
    cursor: pointer;
    font-size: $fs-sm;

    // Hidden but focusable, so the arrow keys move between the themes.
    input {
      position: absolute;
      opacity: 0;
    }

    input:checked + .theme-preview {
      box-shadow: 0 0 0 $line-quote $accent;
    }

    input:focus-visible + .theme-preview {
      outline: $line-thick solid $accent;
      outline-offset: $space-2;
    }
  }
}

.theme-preview {
  display: grid;
  grid-template-columns: $theme-preview-sidebar minmax(0, 1fr);
  height: $theme-preview-height;
  border-radius: $radius-md;
  overflow: hidden;
  box-shadow: 0 0 0 $line $border;
  transition: box-shadow $duration;

  &__sidebar,
  &__page {
    display: grid;
    align-content: start;
    gap: $space-2;
    padding: $space-4;
    background: $bg;
  }

  &__sidebar {
    padding: $space-4 $space-3;
    background: $bg-sidebar;
  }

  &__line {
    height: $space-2;
    border-radius: $radius-pill;
    background: $text-tertiary;

    &--title {
      width: $theme-preview-title;
      background: $text;
    }

    &--accent {
      width: $theme-preview-accent;
      background: $accent;
    }
  }

  &__block {
    height: $space-5;
    border-radius: $radius-sm;
    background: $bg-block;
  }
}
</style>
