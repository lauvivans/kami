<script setup lang="ts">
import Icon from "@core/@client/components/Icon.vue";
import type { PageInfo } from "@core/@types";
import { Icons } from "@core/enum";

const props = defineProps<{
  href?: string;
  emoji: string;
  page?: PageInfo;
}>();
</script>

<template>
  <router-link class="link" :to="props.page.path" v-if="props.page">
    <div>
      <img v-if="props.page.icon" :src="props.page.icon.path" />
      <template v-else>{{ props.emoji }}</template>
      <Icon class="link__arrow" :icon="Icons.arrowLink" />
    </div>
    <span>{{ props.page.title }}</span></router-link
  >
  <a class="link" target="_blank" :href="props.href" v-else>
    <div>
      {{ props.emoji }}
      <Icon class="link__arrow" :icon="Icons.arrowLink" />
    </div>
    <span><slot></slot></span>
  </a>
</template>

<style scoped lang="scss">
.link {
  all: unset;
  display: flex;
  padding: $space-4 $space-1;
  cursor: pointer;
  color: $text !important;
  column-gap: $space-2;

  &:hover {
    background-color: $bg-hover;
    border-radius: $radius-md;
  }

  span {
    font-weight: $fw-semibold;
    border-bottom: $line solid $border;
    padding-bottom: $space-1;
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
