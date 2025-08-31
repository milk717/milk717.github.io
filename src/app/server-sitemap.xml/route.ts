import { getServerSideSitemap } from "next-sitemap";
import { allBooks, allPosts } from "@/contentlayer/generated";
import BlogInfo from "@/BlogInfo.json";

export async function GET() {
	const bookSitemap = allBooks.map((book) => ({
		loc: `${BlogInfo.siteUrl}/${book.slug}`,
		lastmod: book.updated,
		priority: 0.7,
	}));
	const postSitemap = allPosts.map((post) => ({
		loc: `${BlogInfo.siteUrl}/${post.slug}`,
		lastmod: post.updated,
		priority: 1,
	}));

	return getServerSideSitemap([...bookSitemap, ...postSitemap]);
}
