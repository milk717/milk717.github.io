import fs from 'fs';
import matter from 'gray-matter';
import {join} from 'path';
import {Post} from '@/interfaces/post';

const postsDirectory = join(process.cwd(), '_posts');

export function getPostSlugs() {
  return fs.readdirSync(postsDirectory);
}

export function getPostBySlug(slug: string) {
  const realSlug = slug.replace(/\.md$/, '');
  const fullPath = join(postsDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const {data, content} = matter(fileContents);

  return {...data, slug: realSlug, content} as Post;
}

export function getAllPosts(): Post[] {
  const slugs = getPostSlugs();
  return slugs
    .map(slug => getPostBySlug(slug))
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
}

export const getAllPostByCategory = (category: string) => {
  const slugs = getPostSlugs();
  return slugs
    .map(slug => getPostBySlug(slug))
    .filter(post => post.category === category)
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
};

export const getAllPostByTag = (tag?: string) => {
  const slugs = getPostSlugs();
  return slugs
    .map(slug => getPostBySlug(slug))
    .filter(post => (!tag ? true : post.tags.includes(tag)))
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
};

export const getPopularTags = (length: number = 4) => {
  const slugs = getPostSlugs();
  const tagMap = new Map<string, number>();

  slugs.forEach(slug => {
    const post = getPostBySlug(slug);
    post.tags.forEach(tag => {
      tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
    });
  });

  return Array.from(tagMap).slice(0, length);
};
