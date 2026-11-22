<script setup lang="ts">
import type { IMetadata, PageInfo } from "@core/@types";
import { ToggleList } from "@core/@client/components";
import NestedLink from "./NestedLink.vue";
import Tooltip from "@core/components/Tooltip.vue";
import { Icons } from "@core/enum";
import { useStore } from "@core/store";

const store = useStore;
const props = defineProps<{
  page: PageInfo | undefined;
  metadata: IMetadata;
}>();

function updateTabs(page: PageInfo) {
  const tabs = [...store.tabs];
  const activeTab = store.activeTab;
  tabs[activeTab] = {
    pageId: page.id,
    pageName: page.title,
    pagePath: page.path,
  };
  store.storeTabs(tabs);
}
</script>

<template>
  <div class="nav-link" v-if="props.page">
    <ToggleList
      class="nav-link__toggle-list"
      :iconToOpen="Icons.arrowRight"
      :iconToClose="Icons.arrowDown"
      :class="
        store.getActivePage.id === props.page.id
          ? 'nav-link__toggle-list--active'
          : ''
      "
    >
      <template #summaryContent>
        <router-link
          class="nav-link__link"
          :to="props.page.path"
          @click="updateTabs(props.page)"
        >
          <div>
            <div class="nav-link__icon" v-if="props.page.icon">
              <img :src="props.page.icon.path" />
            </div>
            <Tooltip class="nav-link__pagename" :text="props.page.title" />
          </div>
        </router-link>
      </template>
      <template #detailsContent>
        <NestedLink
          v-if="props.page.pages && Object.keys(props.page.pages).length > 0"
          :ids="props.page.pages"
          :metadata="props.metadata"
        />
        <div v-else class="details__item">No pages inside</div>
      </template>
    </ToggleList>
  </div>
</template>

<style lang="scss">
.nav-link {
  margin-bottom: $space-1;

  &__toggle-list {
    margin: 0;

    .details__summary {
      @extend %hover-default;

      height: $item-height;
      padding: 0 $space-2;
      border-radius: $radius-md;
      font-weight: $fw-regular;
      transition: background-color $duration;

      .details__chevron {
        color: $text-tertiary;
      }
    }
  }

  &__link {
    all: unset;
    display: block;

    > div {
      @include flex-layout($flex-direction: row, $column-gap: $space-3);

      align-items: center;
    }
  }

  &__icon {
    max-width: $icon-size-inline;

    img {
      width: 100%;
      height: auto;
    }
  }

  &__pagename {
    @extend %ellipsis;

    // leaves room for the toggle and the page icon
    max-width: calc($nested-link-size - $space-9);
  }
}

.nav-link__toggle-list {
  &--active {
    .details .details__summary {
      background-color: $bg-active;
    }

    .details__content .details .details__summary {
      background-color: transparent;
    }

    .nav-link__pagename {
      color: $text;
      font-weight: $fw-medium;
    }
  }
}
</style>
