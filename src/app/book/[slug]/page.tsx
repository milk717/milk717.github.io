import { notFound } from "next/navigation";
import type { Metadata } from "next";
import MdxComponents from "@/components/mdx-component";
import UtterancesComments from "@/components/utterances-comments";
import { getBookBySlug } from "@/lib/bookApi";
import BookMetaArea from "@/app/book/[slug]/_components/BookMetaArea";
import BlogInfo from "@/BlogInfo.json";

type Params = {
	params: Promise<{
		slug: string;
	}>;
};

export default async function Post({ params }: Params) {
	const { slug } = await params;
	const book = getBookBySlug(slug);

	if (!book) {
		return notFound();
	}

	return (
		<>
			<BookMetaArea book={book} />
			<article className="mx-auto">
				<MdxComponents code={book.body.code} />
			</article>
			<UtterancesComments />
		</>
	);
}
export const generateMetadata = async ({ params }: Params): Promise<Metadata> => {
	const { slug } = await params;
	const book = getBookBySlug(slug);

	if (!book) {
		return notFound();
	}

	return {
		title: book.title,
		authors: { name: BlogInfo.profile.name, url: BlogInfo.profile.link.github },
		keywords: book.tags,
		category: book.category,
		openGraph: {
			type: "article",
			title: book.title,
			images: [{ url: book.cover_url }],
			locale: "ko",
		},
	};
};
