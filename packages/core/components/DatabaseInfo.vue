<script setup lang="ts">
import { Icons } from "@core/enum";
import Icon from "@core/@client/components/Icon.vue";
import type { PageInfo } from "@core/@types";
import { tagColorClass, tagName } from "@core/util/tagColorClass";

const props = defineProps<{ page: PageInfo }>();
</script>

<template>
  <table
    class="database"
    v-if="props.page.parentPage && $props.page.databaseInfo"
  >
    <thead>
      <tr>
        <th></th>
        <th width="100%"></th>
      </tr>
      <tr
        v-for="[key, value] in Object.entries($props.page.databaseInfo)"
        class="database__properties"
        :key="key"
      >
        <td class="database__property">
          <Icon v-if="value.icon" :icon="Icons[value.icon]" />
          <span>{{ key }}</span>
        </td>
        <td class="database__property database__property--val">
          <span v-if="value.value && typeof value.value === 'string'">{{
            value.value
          }}</span>
          <div
            v-else-if="Array.isArray(value.value) && value.value.length > 0"
            class="multi-select"
          >
            <div
              v-for="item in value.value"
              :key="tagName(item)"
              :class="tagColorClass(item)"
            >
              {{ tagName(item) }}
            </div>
          </div>
          <span v-else>Empty</span>
        </td>
      </tr>
    </thead>
  </table>
</template>

<style lang="scss">
.database {
  margin-bottom: $space-6;

  &__properties {
    display: flex;
    column-gap: $space-4;
  }

  &__property {
    display: flex;
    width: max-content !important;
    min-width: $prop-name-width-mobile;
    column-gap: $space-2;
    align-items: center;
    flex-wrap: wrap;

    @extend %hover-default;

    &--val {
      // Lets the value cell shrink so the tags wrap on narrow screens.
      width: auto !important;
      vertical-align: middle;
    }
  }
}

.multi-select {
  display: flex;
  gap: $space-2;
  align-items: center;
  flex-wrap: wrap;

  div {
    padding: $space-2 $space-4;
    width: max-content;
    border-radius: $radius-sm;
    color: $tag-text;
  }

  // one class per color in $tag-colors, picked by tagColorClass()
  @each $name, $color in $tag-colors {
    &__tag--#{$name} {
      background-color: $color;
    }
  }
}
</style>
