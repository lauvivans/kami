<script setup lang="ts">
import type { TableAlign } from "@core/@types";

const props = defineProps<{
  head?: string[];
  rows?: string[][];
  // One entry per column.
  align?: TableAlign[];
}>();

const alignOf = (column: number) => {
  const align = props.align?.[column];
  return align ? { textAlign: align } : undefined;
};

// The box scrolls a wide table, so it takes focus for keyboard scrolling.
</script>

<template>
  <div class="table" tabindex="0">
    <table class="table__table">
      <template v-if="props.head || props.rows">
        <thead v-if="props.head">
          <tr>
            <th
              v-for="(cell, column) in props.head"
              :key="column"
              scope="col"
              :style="alignOf(column)"
            >
              {{ cell }}
            </th>
          </tr>
        </thead>
        <tbody v-if="props.rows">
          <tr v-for="(row, index) in props.rows" :key="index">
            <td
              v-for="(cell, column) in row"
              :key="column"
              :style="alignOf(column)"
            >
              {{ cell }}
            </td>
          </tr>
        </tbody>
      </template>
      <slot v-else />
    </table>
  </div>
</template>

<style lang="scss">
.table {
  max-width: 100%;
  margin: $space-4 0;
  overflow-x: auto;
  border-radius: $radius-sm;

  &:focus-visible {
    outline: $line-thick solid $accent;
  }

  // on phones the table scrolls by swiping, so the scrollbar only takes room
  @media (max-width: $screen-small) {
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  &__table {
    border-collapse: collapse;
    min-width: 100%;
    font-size: $fs-sm;
    line-height: $lh-body;
  }

  th,
  td {
    border: $line solid $border;
    padding: $space-3 $space-4;
    text-align: left;
    vertical-align: top;
  }

  th {
    font-weight: $fw-semibold;
    background-color: $bg-block;
  }
}
</style>
