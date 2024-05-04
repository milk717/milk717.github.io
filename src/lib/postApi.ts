import {DEV_LOG_CATEGORY_NAME} from '@/meta';
import {allPosts} from '@/contentlayer/generated';

export const getPostBySlug = (slug: string) => {
  return allPosts.find(post => post.slug === slug);
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

export const getPostListByKeyword = (keyword: string) => {
  const regExp = new RegExp(keyword.replace('#', ''), 'i');
  return allPosts.filter(
    post =>
      post.title.match(regExp) ||
      post.tags.some(tag => tag.match(regExp)) ||
      post.excerpt?.match(regExp) ||
      post.date.match(regExp),
  );
};
