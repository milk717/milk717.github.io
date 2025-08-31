import { getPopularTags } from "@/lib/postApi";
import Link from "next/link";

const TagPage = () => {
	const tags = getPopularTags();

	return (
		<main>
			<div className="mb-8">
				<h2 className="mb-2.5 text-3xl font-bold text-foreground">All tags</h2>
				<p className="text-muted-foreground">게시글의 모든 태그목록 입니다.</p>
			</div>
			<div className="grid xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
				{tags.map(([tagName, tagCnt]) => (
					<Link
						key={tagName}
						href={`/post?tag=${tagName}`}
						className="flex justify-between items-center primary-hover bg-background px-4 py-3 border rounded-lg">
						<p className="font-medium text-foreground"># {tagName}</p>
						<p className="text-sm text-muted-foreground">{tagCnt}</p>
					</Link>
				))}
			</div>
		</main>
	);
};

export default TagPage;
