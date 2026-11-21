<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useDisplay } from "@core/hooks";
import Icon from "@core/@client/components/Icon.vue";
import { Icons } from "@core/enum";

const detailsContentRef = ref();
const props = defineProps<{ iconToOpen: Icons; iconToClose: Icons }>();
const { toggleDisplay, setDisplayToNone } = useDisplay();
const icon = ref(props.iconToOpen);

const toToggle = () => {
  toggleDisplay(detailsContentRef);

  const displayState = detailsContentRef.value
    ? detailsContentRef.value.style.display
    : null;

  if (displayState === "block") {
    icon.value = props.iconToClose;
  } else {
    icon.value = props.iconToOpen;
  }
};

onMounted(() => {
  setDisplayToNone(detailsContentRef);
});
</script>

<template>
  <div class="toggle-list">
    <!-- The table only lays out the icon column, so it is not a data table. -->
    <table class="details" role="presentation">
      <thead>
        <tr class="details__summary">
          <td class="details__summary--icon">
            <button
              type="button"
              :aria-expanded="icon === props.iconToClose"
              :aria-label="icon === props.iconToClose ? 'Collapse' : 'Expand'"
              @click.prevent.stop="toToggle"
            >
              <Icon :icon="icon" />
            </button>
          </td>
          <td class="details__summary--content">
            <slot name="summaryContent" ref="summaryContentRef" />
          </td>
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
      padding: 4px;

      > button {
        @extend %button;
      }

      > button > div {
        font-size: $fs-medium + 0.1rem;
        color: $black;
      }
    }

    &--content {
      width: 90%;
      vertical-align: middle;
    }
  }

  &__content {
    margin: 5px 0;
  }
}
</style>
