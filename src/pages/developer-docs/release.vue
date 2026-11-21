<script setup lang="ts">
import { Text, Heading, BulletList, BulletItem, Callout, Code } from "@core/index.ts";

const flow = `feature branch ──squash──▶ main ──▶ semantic-release ──▶ npm + GitHub release`;
</script>

<template>
  <Heading :level="3">Branches</Heading>
  <Code>{{ flow }}</Code>
  <BulletList>
    <BulletItem
      ><Code inline>main</Code> is the only long-lived branch. Each change goes in a
      short-lived branch and a PR into <Code inline>main</Code>, which is
      squash-merged.</BulletItem
    >
    <BulletItem
      >The squash commit takes the PR title, so the title follows Conventional
      Commits and picks the version: <Code inline>fix</Code> and
      <Code inline>perf</Code> release a patch, <Code inline>feat</Code> a minor, and
      a breaking change a major. <Code inline>chore</Code>, <Code inline>docs</Code>,
      <Code inline>test</Code>, <Code inline>ci</Code> and
      <Code inline>refactor</Code> don't release.</BulletItem
    >
    <BulletItem
      >Release notes are on the GitHub releases page. Every PR gets a Cloudflare
      Pages preview of this site.</BulletItem
    >
  </BulletList>

  <Heading :level="3">GitHub Actions</Heading>
  <BulletList>
    <BulletItem
      ><Code inline>ci.yml</Code> runs on every PR: type check, lint, format check on
      the changed files, tests and the package build.</BulletItem
    >
    <BulletItem
      ><Code inline>release.yml</Code> runs on every push to <Code inline>main</Code>: it
      builds the package, checks its contents and runs semantic-release,
      which publishes to npm and creates the GitHub release. It publishes
      with npm trusted publishing, so the repository keeps no npm token and
      every version gets a provenance attestation.</BulletItem
    >
  </BulletList>

  <Heading :level="3">This site</Heading>
  <Text
    >This documentation and the demo are the app in <Code inline>src/</Code>, built
    with <Code inline>npm run build</Code> and hosted on Cloudflare Pages.</Text
  >
  <Callout emoji="📌"
    >Both workflows read the Node version from <Code inline>.nvmrc</Code>.</Callout
  >
</template>
