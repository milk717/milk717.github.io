import Link from "next/link";
import BlogInfo from "@/BlogInfo.json";
import { Image } from "@/components/ui/image";

type TagItemProps = { tagName: string; tagCnt: number };

//FIXME 타입 고치기
export const TagItem: React.FC<TagItemProps> = ({ tagName, tagCnt }) => {
	return (
		<Link
			key={tagName}
			href={`/post?tag=${tagName}`}
			className="flex flex-col items-center gap-y-2 rounded-lg bg-card border p-4 cursor-pointer primary-hover">
			<Image
				className="object-cover rounded-lg w-20 h-20"
				// @ts-expect-error
				src={BlogInfo.tagImages[tagName]}
				alt={`${tagName}의 썸네일`}
				width={100}
				height={100}
			/>

			<p className="font-semibold px-2 py-0.5 text-foreground">
				{tagName} ({tagCnt})
			</p>
		</Link>
	);
};
