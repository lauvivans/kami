import type { InjectionKey } from "vue";

// Provided by list items: an image there sits in the text line like an icon,
// so it never opens the full-screen viewer.
export const INLINE_IMAGE: InjectionKey<boolean> = Symbol("inlineImage");
