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
  it("rotates the open icon while the content is shown", async () => {
    const wrapper = mount(ToggleList, {
      props: { iconToOpen: Icons.arrowRightFilled },
      slots: { summaryContent: "Summary", detailsContent: "Hidden" },
    });
    const icon = () => wrapper.find(".details__summary--icon .icon");

    expect(icon().classes()).not.toContain("details__chevron--open");
    await icon().trigger("click");
    expect(icon().classes()).toContain("details__chevron--open");
    await icon().trigger("click");
    expect(icon().classes()).not.toContain("details__chevron--open");
  });
});
