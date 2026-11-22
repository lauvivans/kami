export interface PageInfo {
  id: string;
  path: string;
  title: string;
  pages?: string[];
  parentPage?: string;
  isHomepage?: boolean;
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
