import { allBooks, allPosts } from "@/contentlayer/generated";

export const getAllContent = () => {
	return [...allPosts, ...allBooks];
};
