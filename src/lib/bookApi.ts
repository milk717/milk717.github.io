import { allBooks } from "@/contentlayer/generated";

export const getBookBySlug = (slug: string) => {
	return allBooks.find((book) => book.slug === slug);
};

export const getAllBooksByRate = (rate: number) => {
	return allBooks.filter((book) => book.my_rate === rate);
};
