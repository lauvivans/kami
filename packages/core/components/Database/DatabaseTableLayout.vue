<script setup lang="ts">
import { computed } from "vue";
import Icon from "@core/@client/components/Icon.vue";
import { Icons } from "@core/enum";
import type { PageInfo } from "@core/@types";
import { tagColorClass, tagName } from "@core/util/tagColorClass";

const props = defineProps<{
  pages: PageInfo[];
}>();

const emit = defineEmits<{ open: [page: PageInfo] }>();

// every property any page has, in the order they first appear, with its icon
const columns = computed(() => {
  const icons = new Map<string, keyof typeof Icons>();
  for (const page of props.pages) {
    for (const [key, { icon }] of Object.entries(page.databaseInfo ?? {})) {
      if (!icons.has(key)) icons.set(key, icon);
    }
  }
  return [...icons];
});

const valueOf = (page: PageInfo, key: string) =>
  page.databaseInfo?.[key]?.value;
</script>

<template>
  <div class="database-table">
    <div class="database-table__scroll">
      <table>
        <thead>
          <tr>
            <th>
              <span class="database-table__heading">
                <Icon :icon="Icons.text" />
                Name
              </span>
            </th>
            <th v-for="[key, icon] in columns" :key="key">
              <span class="database-table__heading">
                <Icon :icon="Icons[icon]" />
                {{ key }}
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="page in props.pages" :key="page.id">
            <td>
              <button
                class="database-table__page"
                type="button"
                @click.stop="emit('open', page)"
              >
                <img v-if="page.icon" :src="page.icon.path" alt="" />
                {{ page.title }}
              </button>
            </td>
            <td v-for="[key] in columns" :key="key">
              <div
                v-if="Array.isArray(valueOf(page, key))"
                class="multi-select database-table__tags"
              >
                <div
                  v-for="item in valueOf(page, key)"
                  :key="tagName(item)"
                  :class="tagColorClass(item)"
                >
                  {{ tagName(item) }}
                </div>
              </div>
              <span v-else>{{ valueOf(page, key) }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style lang="scss">
.database-table {
  margin-bottom: $space-6;

  // the table scrolls inside this box, so a wide table never widens the page
  &__scroll {
    max-width: 100%;
    overflow-x: auto;

    // on phones the table scrolls by swiping, so the scrollbar only takes room
    @media (max-width: $screen-small) {
      scrollbar-width: none;

      &::-webkit-scrollbar {
        display: none;
      }
    }
  }

  table {
    border-collapse: collapse;
    min-width: 100%;
    font-size: $fs-sm;
  }

  th,
  td {
    border: $line solid $border;
    padding: $space-3 $space-4;
    text-align: left;
    white-space: nowrap;
  }

  th {
    font-weight: $fw-regular;
    color: $text-secondary;
  }

  tr > :first-child {
    border-left: none;
  }

  tr > :last-child {
    border-right: none;
  }

  &__heading {
    display: flex;
    align-items: center;
    column-gap: $space-2;

    .icon {
      font-size: $fs-md;
    }
  }

  &__page {
    all: unset;
    display: flex;
    align-items: center;
    column-gap: $space-4;
    cursor: pointer;
    font-weight: $fw-semibold;
    border-radius: $radius-sm;

    &:hover {
      text-decoration: underline;
    }

    &:focus-visible {
      outline: $line-thick solid $accent;
    }

    img {
      width: $icon-size-inline;
    }
  }

  &__tags {
    flex-wrap: nowrap;
  }
}
</style>
