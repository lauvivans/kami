import { describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { Icons, ToDoList, ToggleList } from "@core/index.ts";

describe("ToDoList", () => {
  it("renders each label inside the Text block without warnings", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const wrapper = mount(ToDoList, {
      props: {
        items: [
          { name: "Buy coffee", isChecked: true },
          { name: "Grind beans", isChecked: false },
        ],
      },
    });

    const labels = wrapper.findAll(".todo-item .text");
    expect(labels.map((label) => label.text())).toEqual([
      "Buy coffee",
      "Grind beans",
    ]);
    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
  });

  it("marks only the checked items as done", () => {
    const wrapper = mount(ToDoList, {
      props: {
        items: [
          { name: "Buy coffee", isChecked: true },
          { name: "Grind beans", isChecked: false },
        ],
      },
    });

    const items = wrapper.findAll(".todo-item");
    expect(
      items.map((item) => item.find(".todo-item__check").exists())
    ).toEqual([true, false]);
    expect(
      items.map((item) => item.find(".todo-item__item--done").exists())
    ).toEqual([true, false]);
  });
});

describe("ToggleList", () => {
  const mountToggle = () =>
    mount(ToggleList, {
      props: { iconToOpen: Icons.arrowRightFilled },
      slots: { summaryContent: "Summary", detailsContent: "Hidden" },
    });

  it("opens and closes when the summary text is clicked", async () => {
    const wrapper = mountToggle();
    const details = wrapper.find("details").element as HTMLDetailsElement;

    expect(details.open).toBe(false);
    await wrapper.find(".details__summary--content").trigger("click");
    expect(details.open).toBe(true);
    await wrapper.find(".details__summary--content").trigger("click");
    expect(details.open).toBe(false);
  });

  it("uses a native summary, so Enter and Space toggle it from the keyboard", () => {
    const wrapper = mountToggle();
    const summary = wrapper.find("details > summary");

    expect(summary.exists()).toBe(true);
    expect(summary.text()).toBe("Summary");
    expect(wrapper.find("details > .details__content").text()).toBe("Hidden");
  });
});
