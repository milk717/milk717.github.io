import {CATEGORY_PATH_MAP} from '@/utils/constants';

export const isValidCategory = (
  category: string,
): category is keyof typeof CATEGORY_PATH_MAP => {
  return Object.keys(CATEGORY_PATH_MAP).includes(category);
};
