<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useDisplay } from "@core/hooks";
import Icon from "@core/@client/components/Icon.vue";
import { Icons } from "@core/enum";

const detailsContentRef = ref();
// The open icon rotates when the list opens; iconToClose is kept so
// existing portfolios still type-check, and is no longer shown.
const props = defineProps<{ iconToOpen: Icons; iconToClose?: Icons }>();
const { toggleDisplay, setDisplayToNone } = useDisplay();
const open = ref(false);

const toToggle = () => {
  toggleDisplay(detailsContentRef);
  open.value = detailsContentRef.value?.style.display === "block";
};

onMounted(() => {
  setDisplayToNone(detailsContentRef);
});
</script>

<template>
  <div class="toggle-list">
    <table class="details">
      <thead>
        <tr class="details__summary">
          <th class="details__summary--icon">
            <Icon
              :class="{ 'details__chevron--open': open }"
              :icon="props.iconToOpen"
              @click.prevent.stop="toToggle"
            />
          </th>
          <th class="details__summary--content">
            <slot name="summaryContent" ref="summaryContentRef" />
          </th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td></td>
          <td>
            <div class="details__content" ref="detailsContentRef">
              <slot name="detailsContent"></slot>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style lang="scss">
th {
  text-align: start;
  margin: 0;
  padding: 0;
}

.toggle-list {
  width: 100%;
}

.details {
  width: 100%;

  &__summary {
    @extend %hover-default;

    &--icon {
      width: 10%;
      padding: $space-2;

      > div {
        @extend %button;

        font-size: $fs-md;
        color: $text;
        transition: transform $duration;
      }
    }

    &--content {
      width: 90%;
      vertical-align: middle;
    }
  }

  & &__chevron--open {
    transform: rotate(90deg);
  }

  &__content {
    margin: $space-2 0;
  }
}
</style>
