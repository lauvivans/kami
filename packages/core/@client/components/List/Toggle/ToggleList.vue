<script setup lang="ts">
import Icon from "@core/@client/components/Icon.vue";
import { Icons } from "@core/enum";

// The open icon rotates when the list opens; iconToClose is kept so
// existing portfolios still type-check, and is no longer shown.
const props = defineProps<{ iconToOpen: Icons; iconToClose?: Icons }>();
</script>

<template>
  <div class="toggle-list">
    <details class="details">
      <summary class="details__summary">
        <Icon class="details__chevron" :icon="props.iconToOpen" />
        <span class="details__summary--content">
          <slot name="summaryContent" />
        </span>
      </summary>
      <div class="details__content">
        <slot name="detailsContent"></slot>
      </div>
    </details>
  </div>
</template>

<style lang="scss">
.details {
  width: 100%;

  &__summary {
    display: flex;
    align-items: center;
    gap: $space-2;
    padding: $space-1 0;
    cursor: pointer;
    list-style: none;

    &::-webkit-details-marker {
      display: none;
    }

    &--content {
      flex: 1;
      min-width: 0;
    }

    // nested under the summary to win over the .icon color
    .details__chevron {
      font-size: $fs-md;
      color: $text-secondary;
      transition: transform $duration;
    }
  }

  &[open] > &__summary > &__chevron {
    transform: rotate(90deg);
  }

  &__content {
    padding-left: $space-7;
  }
}
</style>
