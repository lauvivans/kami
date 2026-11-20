import { describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { ToDoList } from "@core/index.ts";

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
});
