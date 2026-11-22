import { h } from "vue";
import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { Table } from "@core/index.ts";

describe("Table", () => {
  it("renders the header row and the rows from props", () => {
    const wrapper = mount(Table, {
      props: {
        head: ["Drink", "Dose"],
        rows: [
          ["Espresso", "18 g"],
          ["Lungo", "18 g"],
        ],
        align: [null, "right"],
      },
    });

    const head = wrapper.findAll("thead th");
    expect(head.map((th) => th.text())).toEqual(["Drink", "Dose"]);
    expect(head[0]!.attributes("scope")).toBe("col");
    expect(wrapper.findAll("tbody tr")).toHaveLength(2);
    const [name, dose] = wrapper.findAll("tbody tr")[0]!.findAll("td");
    expect(name!.text()).toBe("Espresso");
    expect(name!.attributes("style")).toBeUndefined();
    expect(dose!.attributes("style")).toContain("text-align: right");
    expect(head[1]!.attributes("style")).toContain("text-align: right");
  });

  it("scrolls inside a focusable box", () => {
    const wrapper = mount(Table, { props: { head: ["a"] } });
    expect(wrapper.classes()).toContain("table");
    expect(wrapper.attributes("tabindex")).toBe("0");
    expect(wrapper.find("tbody").exists()).toBe(false);
  });

  it("takes rows written by hand in its slot", () => {
    const wrapper = mount(Table, {
      slots: {
        default: () =>
          h("tbody", [h("tr", [h("td", "a"), h("td", [h("strong", "b")])])]),
      },
    });
    expect(wrapper.findAll("td")).toHaveLength(2);
    expect(wrapper.find("td strong").text()).toBe("b");
  });
});
