// Proof of concept for spike #174: a Vite plugin that turns each .md file into
// a Vue component built from Kami blocks, at build time. The page ships as
// plain render functions, so no Markdown parser reaches the browser.
import { Lexer, type Token, type Tokens } from "marked";
import { parse as parseYaml } from "yaml";
import type { Plugin } from "vite";

export interface MarkdownOptions {
  // Where the generated pages import the blocks from.
  from?: string;
}

// The languages Code highlights (CodeLanguage in util/highlight.ts).
const CODE_LANGUAGES = new Set([
  "bash",
  "html",
  "js",
  "json",
  "scss",
  "ts",
  "vue",
]);

const FRONT_MATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

const ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  "#39": "'",
};

// marked keeps character references in text; the page renders plain strings,
// so they are decoded here.
function decode(text: string): string {
  return text.replace(/&(#x[\da-f]+|#\d+|\w+);/gi, (match, ref: string) => {
    if (ref in ENTITIES) return ENTITIES[ref]!;
    if (ref[0] !== "#") return match;
    const code =
      ref[1] === "x" || ref[1] === "X"
        ? parseInt(ref.slice(2), 16)
        : parseInt(ref.slice(1), 10);
    return String.fromCodePoint(code);
  });
}

const str = (value: string) => JSON.stringify(value);

class Page {
  blocks = new Set<string>();
  imports: string[] = [];
  warnings: string[] = [];

  block(name: string): string {
    this.blocks.add(name);
    return name;
  }

  // A relative image path becomes an import, so Vite bundles the file.
  src(href: string): string {
    if (/^(\/|[a-z]+:)/i.test(href)) return str(href);
    const name = `__img${this.imports.length}`;
    this.imports.push(`import ${name} from ${str(href)};`);
    return name;
  }

  children(nodes: string[]): string {
    return `() => [${nodes.join(", ")}]`;
  }

  inline(tokens: Token[] = []): string[] {
    return tokens.flatMap((token): string[] => {
      const t = token as Tokens.Generic;
      switch (t.type) {
        case "text":
          return t.tokens ? this.inline(t.tokens) : [str(decode(t.text))];
        case "escape":
          return [str(t.text)];
        case "strong":
        case "em":
        case "del": {
          const tag = { strong: "strong", em: "em", del: "s" }[t.type];
          return [`h("${tag}", null, [${this.inline(t.tokens).join(", ")}])`];
        }
        case "codespan":
          return [
            `h(${this.block("Code")}, { inline: true }, () => ${str(decode(t.text))})`,
          ];
        case "link":
          return [
            `h(${this.block("Link")}, { href: ${str(t.href)} }, ${this.children(this.inline(t.tokens))})`,
          ];
        case "image":
          return [
            `h(${this.block("Image")}, { src: ${this.src(t.href)}, alt: ${str(t.text)} })`,
          ];
        case "br":
          return [`h("br")`];
        default:
          this.warnings.push(`inline "${t.type}" is not supported`);
          return [];
      }
    });
  }

  blocksOf(tokens: Token[]): string[] {
    return tokens.flatMap((token): string[] => {
      const t = token as Tokens.Generic;
      switch (t.type) {
        case "space":
          return [];
        case "heading":
          return [
            `h(${this.block("Heading")}, { level: ${Math.min(t.depth, 4)} }, ${this.children(this.inline(t.tokens))})`,
          ];
        case "paragraph": {
          // An image alone on its line is an image block, as in Notion.
          const only = t.tokens?.length === 1 ? t.tokens[0] : undefined;
          if (only?.type === "image") return this.inline(t.tokens);
          return [
            `h(${this.block("Text")}, null, ${this.children(this.inline(t.tokens))})`,
          ];
        }
        case "code": {
          const lang = CODE_LANGUAGES.has(t.lang)
            ? `{ lang: ${str(t.lang)} }`
            : "null";
          return [`h(${this.block("Code")}, ${lang}, () => ${str(t.text)})`];
        }
        case "blockquote":
          return [
            `h(${this.block("Quote")}, null, ${this.children(this.blocksOf(t.tokens ?? []))})`,
          ];
        case "hr":
          return [`h(${this.block("Divider")})`];
        case "list":
          return [this.list(t as Tokens.List)];
        default:
          this.warnings.push(`block "${t.type}" is not supported`);
          return [];
      }
    });
  }

  list(list: Tokens.List): string {
    const todo = list.items.every((item) => item.task);
    if (list.ordered) this.warnings.push("numbered lists render as bullets");
    const [listBlock, itemBlock] = todo
      ? ["ToDoList", "ToDoItem"]
      : ["BulletList", "BulletItem"];
    const items = list.items.map((item) => {
      const content = item.tokens.filter((t) => t.type !== "checkbox");
      // A tight item holds text tokens, a loose one holds paragraphs.
      const nodes = content.flatMap((t) =>
        t.type === "text"
          ? this.inline([t])
          : t.type === "paragraph"
            ? this.inline((t as Tokens.Paragraph).tokens)
            : this.blocksOf([t])
      );
      const props = todo ? `{ isChecked: ${Boolean(item.checked)} }` : "null";
      return `h(${this.block(itemBlock)}, ${props}, ${this.children(nodes)})`;
    });
    return `h(${this.block(listBlock)}, null, ${this.children(items)})`;
  }
}

export function toModule(source: string, from: string) {
  const match = FRONT_MATTER.exec(source);
  const frontmatter = match ? (parseYaml(match[1]!) ?? {}) : {};
  const body = match ? source.slice(match[0].length) : source;

  const page = new Page();
  const nodes = page.blocksOf(new Lexer({ gfm: true }).lex(body));
  const code = [
    `import { h, defineComponent } from "vue";`,
    `import { ${[...page.blocks].join(", ")} } from ${str(from)};`,
    ...page.imports,
    `export const frontmatter = ${JSON.stringify(frontmatter)};`,
    `export default defineComponent({ name: "MarkdownPage", render: () => [${nodes.join(", ")}] });`,
  ].join("\n");
  return { code, warnings: page.warnings };
}

export function markdown(options: MarkdownOptions = {}): Plugin {
  const from = options.from ?? "@lauvivans/kami";
  return {
    name: "kami-markdown",
    enforce: "pre",
    transform(source, id) {
      if (!id.endsWith(".md")) return;
      const { code, warnings } = toModule(source, from);
      for (const warning of new Set(warnings)) this.warn(`${id}: ${warning}`);
      return { code, map: null };
    },
  };
}
