<script setup lang="ts">
import { Text, Heading, Callout, LinkMention, Code } from "@core/index.ts";
import metadata from "@/metadata";

const create = `npx @lauvivans/kami my-portfolio`;
const run = `cd my-portfolio
npm run dev`;
const tree = `my-portfolio/
├── public/
│   ├── banners/        page banners
│   └── icons/          page icons
├── src/
│   ├── metadata/
│   │   └── index.ts    the list of pages
│   ├── pages/          one Vue component per page
│   ├── App.vue         sidebar, tabs and header
│   └── main.ts         routes and styles
└── package.json`;
</script>

<template>
  <Heading :level="3">Create the project</Heading>
  <Text
    >The CLI copies the template into a new folder, installs its dependencies
    and installs Kami. The folder name defaults to
    <Code inline>my-portfolio</Code>.</Text
  >
  <Code lang="bash">{{ create }}</Code>
  <Callout emoji="⚠️"
    >If the folder already exists, the CLI stops with an error and changes
    nothing.</Callout
  >

  <Heading :level="3">Run it</Heading>
  <Code lang="bash">{{ run }}</Code>
  <Text
    >Open the address Vite prints. The template comes with one page, a banner
    and an icon, so you see a working portfolio right away.</Text
  >

  <Heading :level="3">What's inside</Heading>
  <Code>{{ tree }}</Code>
  <Text
    >The styles come from one CSS file, imported once in
    <Code inline>src/main.ts</Code>: <Code inline>@lauvivans/kami/dist/kami.css</Code>.</Text
  >
  <Text
    >The "by Kami" badge at the bottom right is optional. To remove it, delete
    the <Code inline>&lt;footer class="footer"&gt;</Code> line from
    <Code inline>src/App.vue</Code>.</Text
  >

  <Text>Next step:</Text>
  <LinkMention :page="metadata.pages['first-page']" emoji="🔨" />
</template>
