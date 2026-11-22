import PageExample from "../pages/index.vue";
import Posts from "../pages/posts.vue";
import {
  markdownPages,
  type IMetadata,
  type MarkdownModule,
} from "@lauvivans/kami";

// Each Markdown file in src/pages/posts becomes a page under Posts.
const posts = markdownPages(
  import.meta.glob<MarkdownModule>("../pages/posts/*.md", { eager: true }),
  { parentPage: "posts", path: "/posts" }
);

const metadata: IMetadata = {
  user: {
    author: `My Portfolio`,
    socialMedia: "@user",
  },
  pages: {
    "page-example": {
      id: "page-example",
      title: "Hello 😊",
      isHomepage: true,
      banner: {
        author: "Danis Lou",
        link: "https://unsplash.com/photos/restaurant-with-people-dining-in-jfZfdQtcH6k?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash",
        path: "/banners/page-example.webp",
      },
      icon: {
        author: "Paula Lee",
        link: "https://www.flaticon.com/free-sticker/drink_7465398?related_id=7465398",
        path: "/icons/page-example.png",
      },
      component: PageExample,
    },
    posts: {
      id: "posts",
      path: "/posts",
      title: "Posts",
      component: Posts,
      pages: Object.keys(posts),
    },
    ...posts,
  },
  favorites: ["page-example"],
};

export default metadata;
