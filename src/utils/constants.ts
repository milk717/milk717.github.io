import {
  BOOK_LOG_CATEGORY_NAME,
  DEV_LOG_CATEGORY_NAME,
  MEMOIR_LOG_CATEGORY_NAME,
  STUDY_LOG_CATEGORY_NAME,
} from '@/meta';

export const CATEGORY_PATH_MAP = {
  [DEV_LOG_CATEGORY_NAME]: {
    path: 'dev',
    name: DEV_LOG_CATEGORY_NAME,
  },
  [MEMOIR_LOG_CATEGORY_NAME]: {
    path: 'memoir',
    name: MEMOIR_LOG_CATEGORY_NAME,
  },
  [STUDY_LOG_CATEGORY_NAME]: {
    path: 'learning',
    name: STUDY_LOG_CATEGORY_NAME,
  },
  [BOOK_LOG_CATEGORY_NAME]: {
    path: 'book',
    name: BOOK_LOG_CATEGORY_NAME,
  },
} as const;
