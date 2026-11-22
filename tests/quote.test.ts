import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { Quote } from "@core/index.ts";

describe("Quote", () => {
  it("renders its slot content inside a blockquote", () => {
    const wrapper = mount(Quote, {
      slots: {
        default: 'A quote with <a href="https://vuejs.org/">a link</a>.',
      },
    });

    expect(wrapper.element.tagName).toBe("BLOCKQUOTE");
    expect(wrapper.find("a").text()).toBe("a link");
    expect(wrapper.text()).toBe("A quote with a link.");
  });
});
