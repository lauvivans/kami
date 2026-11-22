<script setup lang="ts">
import { computed } from "vue";
import Icon from "@core/@client/components/Icon.vue";
import type { PageInfo } from "@core/@types";
import { Icons } from "@core/enum";

const props = defineProps<{
  href?: string;
  emoji: string;
  page?: PageInfo;
}>();
// A path such as "/my-projects" is a portfolio page; "//host" is another site.
const to = computed(
  () =>
    props.page?.path ??
    (props.href && /^\/(?!\/)/.test(props.href) ? props.href : undefined)
);
</script>

<template>
  <router-link class="link" :to="to" v-if="to">
    <div>
      <img v-if="props.page?.icon" :src="props.page.icon.path" />
      <template v-else>{{ props.emoji }}</template>
      <Icon class="link__arrow" :icon="Icons.arrowLink" />
    </div>
    <span
      ><slot>{{ props.page?.title ?? props.href }}</slot></span
    ></router-link
  >
  <a class="link" target="_blank" rel="noopener" :href="props.href" v-else>
    <div>
      {{ props.emoji }}
      <Icon class="link__arrow" :icon="Icons.arrowLink" />
    </div>
    <span
      ><slot>{{ props.href?.replace(/^https?:\/\//, "") }}</slot></span
    >
  </a>
</template>

<style scoped lang="scss">
.link {
  all: unset;
  display: flex;
  padding: $space-4 $space-1;
  cursor: pointer;
  color: $text;
  column-gap: $space-2;

  span {
    font-weight: $fw-medium;
    text-decoration: underline;
    text-decoration-color: $text-tertiary;
    text-underline-offset: $space-1;
    transition: text-decoration-color $duration;
  }

  &:hover {
    background-color: $bg-hover;
    border-radius: $radius-md;

    span {
      text-decoration-color: $text;
    }
  }

  > div:first-of-type {
    position: relative;
    z-index: $z-content;
  }

  &__arrow {
    position: absolute;
    top: $space-2;
    left: $space-2;
    z-index: $z-raised;
    color: $text;
  }

  img {
    width: $icon-size-inline;
    height: auto;
    object-fit: contain;
  }
}
</style>
