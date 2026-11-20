<template>
  <div class="column"><slot /></div>
</template>

<style lang="scss">
.column {
  display: flex;
  flex-direction: column;
  row-gap: $default-spacing;
}
</style>
