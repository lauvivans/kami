<script setup lang="ts">
import { Text, BulletList, LinkMention } from "@core/index.ts";
import metadata from "@/metadata";
</script>

<template>
  <Text>The menu page lists the drinks and pastries, grouped by type.</Text>
  <BulletList :items="['Coffee', 'Tea', 'Pastries']" />
  <Text>Each season the menu gets a few new drinks:</Text>
  <LinkMention :page="metadata.pages['seasonal-drinks']" emoji="🍂" />
</template>
