<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{ href: string }>();
// A path such as "/my-projects" is a portfolio page; "//host" is another site.
const isPage = computed(() => /^\/(?!\/)/.test(props.href));
</script>

<template>
  <router-link v-if="isPage" class="link" :to="props.href"
    ><slot
  /></router-link>
  <a v-else class="link" target="_blank" rel="noopener" :href="props.href"
    ><slot
  /></a>
</template>

<style lang="scss">
.link {
  color: inherit;
  text-decoration: underline;
  text-decoration-color: $text-tertiary;
  text-underline-offset: $space-1;
  cursor: pointer;
  transition: text-decoration-color $duration;

  &:hover {
    text-decoration-color: $text;
  }
}
</style>
