export type Post = {
  slug: string;
  title: string;
  date: string;
  thumbnail: string;
  tags: string[];
  excerpt: string;
  ogImage: {
    url: string;
  };
  content: string;
  preview?: boolean;
};
