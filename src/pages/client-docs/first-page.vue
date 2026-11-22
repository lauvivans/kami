<script setup lang="ts">
import {
  Text,
  Heading,
  Callout,
  BulletList,
  BulletItem,
  LinkMention,
  Code,
  Quote,
} from "@core/index.ts";
import metadata from "@/metadata";
import { aboutPage as page, aboutMetadata as meta } from "@/code-samples";

const quote = `<Quote>A quote from a person or a source.</Quote>`;
</script>

<template>
  <Heading :level="3">1. Write the page</Heading>
  <Text
    >Create a Vue component in <Code inline>src/pages/</Code> and build its content
    with Kami's blocks.</Text
  >
  <Code lang="vue">{{ page }}</Code>
  <Text
    >For long-form pages, <Code inline>Quote</Code> sets a quotation apart with a
    line on its left. It takes text, links and highlights:</Text
  >
  <Quote>A quote from a person or a source.</Quote>
  <Code lang="vue">{{ quote }}</Code>

  <Heading :level="3">2. Add it to the metadata</Heading>
  <Text
    >Every page needs an entry in <Code inline>metadata.pages</Code>. The key and the
    <Code inline>id</Code> must match.</Text
  >
  <Code lang="ts">{{ meta }}</Code>

  <Heading :level="3">Page fields</Heading>
  <BulletList>
    <BulletItem
      ><Code inline>id</Code>, <Code inline>path</Code>, <Code inline>title</Code> and
      <Code inline>component</Code> are required.</BulletItem
    >
    <BulletItem
      ><Code inline>isHomepage</Code> marks the page shown at
      <Code inline>/</Code>.</BulletItem
    >
    <BulletItem
      ><Code inline>pages</Code> lists the ids of the sub-pages, and
      <Code inline>parentPage</Code> points a sub-page to its parent. The sidebar
      and the breadcrumb follow them. Past 3 levels, the breadcrumb shows the
      first page and the last two, and the pages in between open from
      <Code inline>…</Code>.</BulletItem
    >
    <BulletItem
      ><Code inline>banner</Code> and <Code inline>icon</Code> take an image path from
      <Code inline>public/</Code>, plus an optional author and link for the
      credit.</BulletItem
    >
    <BulletItem
      ><Code inline>databaseInfo</Code> shows properties under the title, like the
      properties of a Notion database item. An array value shows as tags. A tag
      is a text, or <Code inline>{ name, color }</Code> to pick its color
      (purple, blue, yellow, brown, green, orange, gray, pink or red); without one, it gets
      a color from its text. A <Code inline>Database</Code> block
      in the table view lists its pages as rows, with one column per
      property. Its Filter button keeps the pages that have any of the values
      picked for one property, and Sort orders them by the title or a property,
      ascending or descending. Values compare as text, so "2" comes before
      "10", and a list of tags sorts by its first tag. Both apply to every view
      and reset on reload.</BulletItem
    >
  </BulletList>
  <Text
    ><Code inline>metadata.favorites</Code> lists the pages shown under Favorites in
    the sidebar. Pages without a parent are listed under Private.</Text
  >

  <Callout emoji="👀"
    >The Blocks page in the demo shows every block with the code that renders
    it.</Callout
  >
  <LinkMention :page="metadata.pages['blocks']" emoji="🧱" />

  <Text>Next step:</Text>
  <LinkMention :page="metadata.pages['first-deploy']" emoji="✅" />
</template>
