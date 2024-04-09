import {Author} from '@/interfaces/author';

export type Post = {
  slug: string;
  title: string;
  date: string;
  thumbnail: string;
  tags: string[];
  author: Author;
  excerpt: string;
  ogImage: {
    url: string;
  };
  content: string;
  preview?: boolean;
};
