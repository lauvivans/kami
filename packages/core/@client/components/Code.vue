<script setup lang="ts">
// Inline: <Code inline>npm run dev</Code>
// Block: <Code lang="ts">{{ sample }}</Code>. Pass multi-line code through
// {{ }}, since Vue collapses the whitespace of text written in the slot.
// Without `lang`, the block shows plain text.
import { useSlots } from "vue";
import { highlight, type CodeLanguage } from "@core/util/highlight";

const props = defineProps<{ inline?: boolean; lang?: CodeLanguage }>();
const slots = useSlots();

function slotText(): string {
  return (slots.default?.() ?? [])
    .map((node) => (typeof node.children === "string" ? node.children : ""))
    .join("");
}
</script>

<template>
  <code v-if="props.inline" class="code code--inline"><slot /></code>
  <pre
    v-else-if="props.lang"
    class="code code--block"
  ><code v-html="highlight(slotText(), props.lang)"></code></pre>
  <pre v-else class="code code--block"><code><slot /></code></pre>
</template>

<style scoped lang="scss">
.code {
  font-family: $font-mono;
  font-weight: $fw-medium;
  font-size: $fs-code;

  &--inline {
    padding: $space-1 $space-2;
    border-radius: $radius-sm;
    color: $code-inline;
    background-color: $bg-hover;
  }

  &--block {
    overflow-x: auto;
    margin: $space-4 0;
    padding: $space-7 $space-6;
    border-radius: $radius-md;
    line-height: $lh-body;
    white-space: pre;
    tab-size: 2;
    background-color: $bg-block;
  }
}

// GitHub's code colors, set per theme in _theme.scss.
.code--block {
  :deep(.hljs-keyword),
  :deep(.hljs-selector-tag),
  :deep(.hljs-name) {
    color: $code-keyword;
  }

  :deep(.hljs-string),
  :deep(.hljs-regexp),
  :deep(.hljs-attribute) {
    color: $code-string;
  }

  :deep(.hljs-title),
  :deep(.hljs-section),
  /* stylelint-disable-next-line selector-class-pattern -- class name set by highlight.js */
  :deep(.hljs-built_in) {
    color: $code-function;
  }

  :deep(.hljs-number),
  :deep(.hljs-literal),
  :deep(.hljs-type),
  :deep(.hljs-attr),
  :deep(.hljs-selector-class) {
    color: $code-number;
  }

  :deep(.hljs-comment),
  :deep(.hljs-meta) {
    color: $code-comment;
  }

  :deep(.hljs-comment) {
    font-style: italic;
  }
}
</style>
