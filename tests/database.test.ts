import { afterEach, describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";
import { mount, shallowMount } from "@vue/test-utils";
import { Database } from "@core/index.ts";
import DatabaseTableLayout from "@core/components/Database/DatabaseTableLayout.vue";
import DatabaseGalleryLayout from "@core/components/Database/DatabaseGalleryLayout.vue";
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
      Languages: {
        icon: "code",
        value: ["Vue", { name: "TypeScript", color: "green" }],
      },
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
    const tags = rows[0]!.findAll(".database-table__tags > div");
    expect(tags).toHaveLength(2);
    expect(tags[1]!.classes()).toContain("multi-select__tag--green");
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

describe("Database views", () => {
  const tabs = (wrapper: ReturnType<typeof shallowMount>) =>
    wrapper.findAll(".database-block__view");

  it("opens with the view set by layout", () => {
    const wrapper = shallowMount(Database, {
      props: { layout: "gallery", pages },
    });

    expect(wrapper.findComponent(DatabaseGalleryLayout).exists()).toBe(true);
    expect(wrapper.findComponent(DatabaseTableLayout).exists()).toBe(false);
    expect(tabs(wrapper).map((tab) => tab.attributes("aria-pressed"))).toEqual([
      "true",
      "false",
    ]);
  });

  it("switches views with the tabs", async () => {
    const wrapper = shallowMount(Database, {
      props: { layout: "gallery", title: "Projects", pages },
    });

    await tabs(wrapper)[1]!.trigger("click");

    expect(wrapper.findComponent(DatabaseTableLayout).exists()).toBe(true);
    expect(wrapper.findComponent(DatabaseGalleryLayout).exists()).toBe(false);
    expect(tabs(wrapper)[1]!.attributes("aria-pressed")).toBe("true");
    expect(wrapper.find(".database-block__title").text()).toBe("Projects");

    await tabs(wrapper)[0]!.trigger("click");

    expect(wrapper.findComponent(DatabaseGalleryLayout).exists()).toBe(true);
  });
});

describe("Database filter and sort", () => {
  const mountDatabase = () =>
    mount(Database, {
      props: { layout: "gallery", pages },
      global: {
        stubs: {
          teleport: true,
          DatabaseGalleryLayout: true,
          DatabaseTableLayout: true,
        },
      },
    });
  type Wrapper = ReturnType<typeof mountDatabase>;
  const tabs = (wrapper: Wrapper) => wrapper.findAll(".database-block__view");
  const actions = (wrapper: Wrapper) =>
    wrapper.findAll(".database-block__actions button");
  const item = (wrapper: Wrapper, text: string) =>
    wrapper
      .findAll(".database-menu button")
      .find((button) => button.text() === text)!;
  const shownIds = (wrapper: Wrapper, view: "gallery" | "table" = "gallery") =>
    (
      wrapper
        .findComponent(
          view === "gallery" ? DatabaseGalleryLayout : DatabaseTableLayout
        )
        .props("pages") as PageInfo[]
    ).map((page) => page.id);

  it("filters every view by a tag and clears the filter", async () => {
    const wrapper = mountDatabase();

    await actions(wrapper)[0]!.trigger("click");
    expect(
      wrapper.findAll(".database-menu button").map((button) => button.text())
    ).toEqual(["Created", "Languages", "Status"]);
    await item(wrapper, "Languages").trigger("click");
    await wrapper.find(".database-menu input").setValue(true);

    expect(shownIds(wrapper)).toEqual(["coffee"]);
    expect(actions(wrapper)[0]!.text()).toBe("Filter: Vue");

    await tabs(wrapper)[1]!.trigger("click");
    expect(shownIds(wrapper, "table")).toEqual(["coffee"]);
    await tabs(wrapper)[0]!.trigger("click");

    // close and reopen: the menu opens on the active property's values
    await actions(wrapper)[0]!.trigger("click");
    await actions(wrapper)[0]!.trigger("click");
    await item(wrapper, "Clear filter").trigger("click");

    expect(shownIds(wrapper)).toEqual(["coffee", "books"]);
    expect(actions(wrapper)[0]!.text()).toBe("Filter");
    expect(wrapper.find(".database-menu button").exists()).toBe(false);
  });

  it("sorts by the title and shows the sort on the button", async () => {
    const wrapper = mountDatabase();

    await actions(wrapper)[1]!.trigger("click");
    await item(wrapper, "Name").trigger("click");
    expect(shownIds(wrapper)).toEqual(["books", "coffee"]);

    await item(wrapper, "Descending ↓").trigger("click");
    expect(shownIds(wrapper)).toEqual(["coffee", "books"]);
    expect(actions(wrapper)[1]!.text()).toBe("Sort: Name ↓");

    await item(wrapper, "Clear sort").trigger("click");
    expect(actions(wrapper)[1]!.text()).toBe("Sort");
  });

  it("moves focus into the menu and back to its button", async () => {
    const wrapper = mount(Database, {
      props: { layout: "gallery", pages },
      attachTo: document.body,
      global: {
        stubs: { DatabaseGalleryLayout: true, DatabaseTableLayout: true },
      },
    });
    const menuButton = (text: string) =>
      [...document.querySelectorAll<HTMLElement>(".database-menu button")].find(
        (button) => button.textContent?.trim() === text
      )!;
    const focused = () => document.activeElement?.textContent?.trim();

    await actions(wrapper)[0]!.trigger("click");
    await nextTick();
    expect(focused()).toBe("Created");

    menuButton("Languages").click();
    await nextTick();
    await nextTick();
    expect(focused()).toBe("‹ Languages");

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await nextTick();
    expect(document.activeElement).toBe(actions(wrapper)[0]!.element);
    wrapper.unmount();
  });

  it("closes the menu on Escape", async () => {
    const wrapper = mountDatabase();

    await actions(wrapper)[1]!.trigger("click");
    expect(wrapper.find(".database-menu button").exists()).toBe(true);
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await wrapper.vm.$nextTick();

    expect(wrapper.find(".database-menu button").exists()).toBe(false);
  });
});
