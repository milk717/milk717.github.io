import type { Metadata } from "next";
import { notFound } from 'next/navigation';
import { getPostBySlug } from "@/lib/postApi";
import PostMetaArea from '@/app/[slug]/_components/PostMetaArea';
import MdxComponents from '@/components/MdxComponents';
import UtterancesComments from '@/components/UtterancesComments';
import BlogInfo from '@/BlogInfo.json';

type Params = {
	params: Promise<{
		slug: string;
	}>;
};

export default async function Post({params}: Params) {
  const { slug } = await params;
		const post = getPostBySlug(slug);

		if (!post) {
			return notFound();
		}

		return (
			<>
				<PostMetaArea post={post} />
				<article className="mx-auto">
					<MdxComponents code={post.body.code} />
				</article>
				<UtterancesComments />
			</>
		);
}
export const generateMetadata = async ({
	params,
}: Params): Promise<Metadata> => {
	const { slug } = await params;
	const post = getPostBySlug(slug);

	if (!post) {
		return notFound();
	}

	return {
		title: post.title,
		description: post.excerpt,
		authors: { name: BlogInfo.profile.name, url: BlogInfo.profile.link.github },
		keywords: post.tags,
		category: post.category,
		openGraph: {
			type: "article",
			title: post.title,
			images: [{ url: post.thumbnail }],
			description: post.excerpt,
			locale: "ko",
		},
	};
};
