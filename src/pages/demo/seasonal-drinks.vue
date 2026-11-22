<script setup lang="ts">
import { Text, Callout, BulletList } from "@core/index.ts";
</script>

<template>
  <Callout emoji="🧭"
    >This page is four levels deep: Demo, Coffee shop website, Menu and
    Seasonal drinks. The breadcrumb at the top shows the first page and the last
    two, and the <strong>…</strong> button opens a menu with the pages in
    between.</Callout
  >
  <Text>Drinks that join the menu for a few months each year.</Text>
  <BulletList :items="['Pumpkin latte', 'Iced hibiscus tea', 'Cinnamon cold brew']" />
</template>
