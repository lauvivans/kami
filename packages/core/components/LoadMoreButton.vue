<template>
  <button type="button" class="load-more-button"><slot /></button>
</template>

<style lang="scss">
// Notion's "Load more" row: the width of the list, muted until hovered
.load-more-button {
  all: unset;
  box-sizing: border-box;
  width: 100%;
  height: $item-height;
  margin-top: $space-4;
  padding: 0 $space-4;
  cursor: pointer;
  font-size: $fs-sm;
  color: $text-secondary;
  border-radius: $radius-md;

  &:hover {
    background-color: $bg-hover;
  }

  &:focus-visible {
    outline: $line-thick solid $accent;
  }
}
</style>
