import { CATEGORY_PATH_MAP } from "@/utils/constants";

export const isValidCategory = (category: unknown): category is keyof typeof CATEGORY_PATH_MAP => {
	return typeof category === "string" && Object.keys(CATEGORY_PATH_MAP).includes(category);
};
