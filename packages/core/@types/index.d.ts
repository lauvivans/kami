export interface PageInfo {
  id: string;
  path: string;
  title: string;
  pages?: string[];
  parentPage?: string;
  isHomepage?: boolean;
  // A post's date, as YYYY-MM-DD; markdownPages sorts by it.
  date?: string;
  component: Component;
  banner?: {
    path: string; //local image path
    author?: string;
    link?: string; // link to access image in cloud
  };
  icon?: {
    path: string;
    author?: string;
    link?: string;
  };
  databaseInfo?: {
    [key: string]: {
      icon: "clock" | "check" | "code";
      // an array is a multi-select: each item is a tag
      value: string | DatabaseTag[];
    };
  };
}

// A Table column's alignment; null keeps the default (left).
export type TableAlign = "left" | "center" | "right" | null;

// The colors of $tag-colors in _var.scss.
export type TagColor =
  | "purple"
  | "blue"
  | "yellow"
  | "brown"
  | "green"
  | "orange"
  | "gray"
  | "pink"
  | "red";

// A tag is its text, or its text and a color. Without a color, the tag gets
// one from its text, the same on every page.
export type DatabaseTag = string | { name: string; color: TagColor };

// The front matter of a Markdown page, read by markdownPages.
export interface MarkdownFrontmatter {
  title?: string;
  date?: string;
  banner?: PageInfo["banner"];
  icon?: PageInfo["icon"];
  [key: string]: unknown;
}

// A .md file as the kami-markdown plugin builds it.
export interface MarkdownModule {
  default: Component;
  frontmatter: MarkdownFrontmatter;
}

export interface PagesInfo {
  [id: string]: PageInfo;
}

export interface IMetadata {
  user: {
    author: string;
    socialMedia: string;
  };
  pages: PagesInfo;
  favorites: string[];
}
