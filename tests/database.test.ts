import { afterEach, describe, expect, it, vi } from "vitest";
import { mount, shallowMount } from "@vue/test-utils";
import { Database } from "@core/index.ts";
import DatabaseTableLayout from "@core/@client/components/Database/DatabaseTableLayout.vue";
import { useStore } from "@core/store";
import type { PageInfo } from "@core/@types";

const pages: PageInfo[] = [
  {
    id: "coffee",
    path: "/coffee",
    title: "Coffee shop",
    component: {},
    databaseInfo: {
      Created: { icon: "clock", value: "March 2026" },
      Languages: { icon: "code", value: ["Vue", "TypeScript"] },
    },
  },
  {
    id: "books",
    path: "/books",
    title: "Bookshelf",
    component: {},
    databaseInfo: { Status: { icon: "check", value: "Done" } },
  },
];

const cells = (row: ReturnType<ReturnType<typeof mount>["find"]>) =>
  row.findAll("td").map((td) => td.text());

afterEach(() => {
  vi.useRealTimers();
});

describe("Database table layout", () => {
  it("renders one row per page and one column per property", () => {
    const wrapper = mount(DatabaseTableLayout, {
      props: { pages },
      global: { stubs: { Icon: true } },
    });

    expect(wrapper.findAll("th").map((th) => th.text())).toEqual([
      "Name",
      "Created",
      "Languages",
      "Status",
    ]);
    const rows = wrapper.findAll("tbody tr");
    expect(rows).toHaveLength(2);
    expect(cells(rows[0]!)).toEqual([
      "Coffee shop",
      "March 2026",
      "VueTypeScript",
      "",
    ]);
    expect(cells(rows[1]!)).toEqual(["Bookshelf", "", "", "Done"]);
    expect(rows[0]!.findAll(".database-table__tags > div")).toHaveLength(2);
  });

  it("emits open with the page when its title is clicked", async () => {
    const wrapper = mount(DatabaseTableLayout, {
      props: { pages },
      global: { stubs: { Icon: true } },
    });

    await wrapper.findAll(".database-table__page")[1]!.trigger("click");

    expect(wrapper.emitted("open")).toEqual([[pages[1]]]);
  });

  it("opens the page modal from Database", async () => {
    vi.useFakeTimers();
    const wrapper = shallowMount(Database, {
      props: { layout: "table", pages },
    });

    wrapper.findComponent(DatabaseTableLayout).vm.$emit("open", pages[0]);
    await wrapper.vm.$nextTick();

    expect(useStore.getCurrentModalPageId).toBe("coffee");
    expect(
      wrapper.findComponent({ name: "MainModalView" }).props("page")
    ).toEqual(pages[0]);
  });
});
