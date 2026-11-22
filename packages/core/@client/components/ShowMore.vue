<script setup lang="ts">
import { Comment, Fragment, computed, nextTick, ref, useSlots } from "vue";
import type { VNode } from "vue";
import LoadMoreButton from "@core/components/LoadMoreButton.vue";

const props = defineProps<{
  // how many blocks show at first and per click; all when unset
  limit?: number;
  label?: string;
  lessLabel?: string;
}>();

const slots = useSlots();

// A v-for or a <template> arrives as one Fragment; each child is a block.
function blocks(nodes: VNode[]): VNode[] {
  return nodes.flatMap((node) => {
    if (node.type === Fragment) return blocks(node.children as VNode[]);
    return node.type === Comment ? [] : [node];
  });
}
const items = () => blocks(slots.default?.() ?? []);

// a zero or negative limit would hide blocks, so it counts as no limit
const limit = computed(() =>
  props.limit && props.limit > 0 ? props.limit : undefined
);
const shownCount = ref(limit.value);
const listRef = ref<HTMLElement | null>(null);

async function toggle(total: number) {
  if (shownCount.value! >= total) {
    shownCount.value = limit.value;
    return;
  }
  const first = shownCount.value!;
  shownCount.value = first + limit.value!;
  await nextTick();
  listRef.value
    ?.querySelectorAll<HTMLElement>(".show-more__item")
    [first]?.focus();
}
</script>

<template>
  <div class="show-more">
    <div ref="listRef">
      <div
        v-for="(item, index) in items().slice(0, shownCount)"
        :key="index"
        class="show-more__item"
        tabindex="-1"
      >
        <component :is="item" />
      </div>
    </div>
    <LoadMoreButton
      v-if="limit && items().length > limit"
      @click="toggle(items().length)"
    >
      {{
        shownCount! < items().length
          ? (props.label ?? "Show more")
          : (props.lessLabel ?? "Show less")
      }}
    </LoadMoreButton>
  </div>
</template>

<style lang="scss">
.show-more__item:focus-visible {
  outline: $line-thick solid $accent;
  border-radius: $radius-md;
}
</style>
