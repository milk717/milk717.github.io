import BlogInfo from "@/BlogInfo.json";

export const DEV_LOG_CATEGORY_NAME = BlogInfo.category.dev;
export const MEMOIR_LOG_CATEGORY_NAME = BlogInfo.category.memoir;
export const STUDY_LOG_CATEGORY_NAME = BlogInfo.category.learning;
export const BOOK_LOG_CATEGORY_NAME = BlogInfo.category.book;

export const CATEGORY_PATH_MAP = {
	[DEV_LOG_CATEGORY_NAME]: {
		path: "dev",
		name: DEV_LOG_CATEGORY_NAME,
	},
	[MEMOIR_LOG_CATEGORY_NAME]: {
		path: "memoir",
		name: MEMOIR_LOG_CATEGORY_NAME,
	},
	[STUDY_LOG_CATEGORY_NAME]: {
		path: "learning",
		name: STUDY_LOG_CATEGORY_NAME,
	},
	[BOOK_LOG_CATEGORY_NAME]: {
		path: "book",
		name: BOOK_LOG_CATEGORY_NAME,
	},
} as const;
