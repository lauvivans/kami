<script setup lang="ts">
import { computed } from "vue";
import Heading from "@core/@client/components/Heading.vue";
import type { PageInfo, PagesInfo } from "@core/@types";

const props = withDefaults(
  defineProps<{
    // The pages from markdownPages, as it returns them or as an array.
    pages: PagesInfo | PageInfo[];
    // The language of the month names and dates.
    locale?: string;
  }>(),
  { locale: "en-US" }
);

// Dates are YYYY-MM-DD, read as UTC so no time zone moves a post to
// another day or month. Anything else counts as no date, since Intl throws
// on an invalid one.
const toDate = (date?: string) => {
  const parsed = /^\d{4}-\d{2}-\d{2}/.test(date ?? "")
    ? new Date(`${date!.slice(0, 10)}T00:00:00Z`)
    : undefined;
  return parsed && !isNaN(parsed.getTime()) ? parsed : undefined;
};

const groups = computed(() => {
  const month = new Intl.DateTimeFormat(props.locale, {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
  const day = new Intl.DateTimeFormat(props.locale, {
    dateStyle: "medium",
    timeZone: "UTC",
  });
  const pages = Array.isArray(props.pages)
    ? props.pages
    : Object.values(props.pages);
  // ISO dates sort as text; posts without a valid date go last.
  const dated = pages
    .map((page) => {
      const date = toDate(page.date);
      return { page, date, iso: date ? page.date!.slice(0, 10) : "" };
    })
    .sort((a, b) => b.iso.localeCompare(a.iso));

  const result: {
    key: string;
    label: string;
    posts: { page: PageInfo; iso: string; date: string }[];
  }[] = [];
  for (const { page, date, iso } of dated) {
    const key = iso.slice(0, 7);
    let group = result[result.length - 1];
    if (group?.key !== key) {
      group = { key, label: date ? month.format(date) : "", posts: [] };
      result.push(group);
    }
    group.posts.push({ page, iso, date: date ? day.format(date) : "" });
  }
  return result;
});
</script>

<template>
  <div class="post-list">
    <section v-for="group in groups" :key="group.key">
      <Heading v-if="group.label" :level="4">{{ group.label }}</Heading>
      <ul class="post-list__posts">
        <li v-for="{ page, iso, date } in group.posts" :key="page.id">
          <router-link class="post-list__post" :to="page.path">
            <span class="post-list__title">{{ page.title }}</span>
            <time v-if="iso" :datetime="iso">{{ date }}</time>
          </router-link>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped lang="scss">
.post-list {
  width: 100%;

  &__posts {
    list-style: none;
    margin-top: $space-2;
  }

  &__post {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    column-gap: $space-4;
    padding: $space-2 $space-1;
    border-radius: $radius-md;
    color: $text;
    text-decoration: none;
    transition: background-color $duration;

    &:hover {
      background-color: $bg-hover;
    }

    time {
      flex-shrink: 0;
      color: $text-secondary;
      font-size: $fs-sm;
    }
  }

  &__title {
    font-weight: $fw-medium;
  }
}
</style>
