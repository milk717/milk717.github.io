import {DEV_LOG_CATEGORY_NAME} from '@/meta';
import {allPosts} from '@/contentlayer/generated';

export const getPostById = (id: string[]) => {
  return allPosts.find(post => post._id === id.join('/'));
};

export const getAllPostByCategory = (category: string) => {
  return allPosts
    .filter(post => post.category === category)
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
};

export const getAllPostByTag = (tag?: string) => {
  return allPosts
    .filter(post => (!tag ? true : post.tags?.includes(tag)))
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
};

export const getPopularTags = (length?: number) => {
  const tagMap = new Map<string, number>();

  allPosts.forEach(
    post =>
      post.category === DEV_LOG_CATEGORY_NAME &&
      post.tags?.forEach(tag => {
        tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
      }),
  );

  return Array.from(tagMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, length);
};
