import fs from 'fs';
import matter from 'gray-matter';
import {join} from 'path';
import {Post} from '@/interfaces/post';
import {BOOK_LOG_CATEGORY_NAME, DEV_LOG_CATEGORY_NAME} from '@/meta';
import {glob} from 'glob';

const postsDirectory = join(process.cwd(), '_posts');

export const getPostSlugs = () => {
  return glob.sync('**/*.md', {
    cwd: postsDirectory,
    ignore: '**/.obsidian/**/*',
  });
};

export function getPostBySlug(slug: string | string[]) {
  const slugs = Array.isArray(slug) ? slug : [slug];
  const filePath = slugs.join('/');
  const fullPath = join(postsDirectory, filePath);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const {data, content} = matter(fileContents);
  return {...data, slug: filePath, content} as Post;
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

export const getAllRecommendedBookPost = () => {
  const slugs = getPostSlugs();
  return slugs
    .map(slug => getPostBySlug(slug))
    .filter(
      post =>
        post.category === BOOK_LOG_CATEGORY_NAME &&
        post.rating &&
        post.rating >= 4.5,
    );
};

export const getAllPostByTag = (tag?: string) => {
  const slugs = getPostSlugs();
  return slugs
    .map(slug => getPostBySlug(slug))
    .filter(post => (!tag ? true : post.tags.includes(tag)))
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
};

export const getPopularTags = (length?: number) => {
  const slugs = getPostSlugs();
  const tagMap = new Map<string, number>();

  slugs.forEach(slug => {
    const post = getPostBySlug(slug);
    post.category === DEV_LOG_CATEGORY_NAME &&
      post.tags.forEach(tag => {
        tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
      });
  });

  return Array.from(tagMap).slice(0, length);
};
