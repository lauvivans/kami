import { afterEach, describe, expect, it, vi } from "vitest";
import { effectScope } from "vue";
import { useIsMobile } from "@core/hooks";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("useIsMobile", () => {
  it("uses the $screen-small breakpoint from _var.scss", () => {
    const matchMedia = vi.spyOn(window, "matchMedia");
    useIsMobile();
    expect(matchMedia).toHaveBeenCalledWith("(max-width: 767px)");
  });

  it("follows the media query and stops listening when the scope ends", () => {
    const query = new EventTarget() as MediaQueryList;
    Object.defineProperty(query, "matches", { value: false });
    vi.spyOn(window, "matchMedia").mockReturnValue(query);
    const removeListener = vi.spyOn(query, "removeEventListener");

    const scope = effectScope();
    const isMobile = scope.run(() => useIsMobile())!;
    expect(isMobile.value).toBe(false);

    query.dispatchEvent(Object.assign(new Event("change"), { matches: true }));
    expect(isMobile.value).toBe(true);

    scope.stop();
    expect(removeListener).toHaveBeenCalled();
  });
});
