<template>
  <button type="button" class="load-more-button"><slot /></button>
</template>

<style lang="scss">
// as wide as its text, muted until hovered
.load-more-button {
  all: unset;
  display: block;
  box-sizing: border-box;
  width: max-content;
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
