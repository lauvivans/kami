<template>
  <blockquote class="quote">
    <slot></slot>
  </blockquote>
</template>

<style scoped lang="scss">
.quote {
  padding: $space-1 0 $space-1 $space-6;
  border-left: $line-quote solid $text;
  font-size: $fs-md;
  line-height: $lh-body;
}
</style>
