<template>
  <div class="loader"></div>
</template>

<style lang="scss">
.loader {
  width: $space-9;
  aspect-ratio: 1;
  display: grid;
  border-radius: 50%;
  background:
    linear-gradient(0deg, $text-tertiary 30%, transparent 0 70%, $text 0),
    linear-gradient(90deg, $text-tertiary 30%, transparent 0 70%, $text 0);
  background-position: 50%;
  background-size:
    8% 100%,
    100% 8%;
  background-repeat: no-repeat;
  animation: l23 1s infinite steps(12);
}

.loader::before,
.loader::after {
  content: "";
  grid-area: 1/1;
  border-radius: 50%;
  background: inherit;
  opacity: 0.915;
  transform: rotate(30deg);
}

.loader::after {
  opacity: 0.83;
  transform: rotate(60deg);
}

@keyframes l23 {
  100% {
    transform: rotate(1turn);
  }
}
</style>
