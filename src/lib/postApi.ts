import { allPosts } from '@/contentlayer/generated';
import { DEV_LOG_CATEGORY_NAME } from '@/utils/constants';

export const getPostBySlug = (slug: string) => {
  return allPosts.find((post) => post.slug === slug);
};

export const getAllPosts = () => {
  return allPosts.sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
};

export const getAllPostByCategory = (category: string) => {
  return allPosts
    .filter((post) => post.category === category)
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
};

export const getAllPostByTag = (tag?: string) => {
  return allPosts
    .filter((post) => (!tag ? true : post.tags?.includes(tag)))
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
};

export const getPopularTags = (length?: number) => {
  const tagMap = new Map<string, number>();

  for (const post of allPosts) {
    if (post.category === DEV_LOG_CATEGORY_NAME) {
      for (const tag of post.tags || []) {
        tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
      }
    }
  }

  return Array.from(tagMap)
    .sort((a, b) => {
      if (b[1] === a[1]) {
        return b[0] < a[0] ? 1 : -1;
      }
      return b[1] - a[1];
    })
    .slice(0, length);
};

export const getPostListByKeyword = (keyword: string) => {
  const regExp = new RegExp(keyword.replace('#', ''), 'i');
  return allPosts.filter(
    (post) =>
      post.title.match(regExp) ||
      post.tags.some((tag) => tag.match(regExp)) ||
      post.excerpt?.match(regExp) ||
      post.date.match(regExp),
  );
};
