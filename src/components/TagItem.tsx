import { Image } from "@/components/ui/image";
import Link from "next/link";
import BlogInfo from "@/BlogInfo.json";
import { AspectRatio } from "./ui/aspect-ratio";

type TagItemProps = {
	tagName: string;
	tagCnt: number;
};

//FIXME 타입 고치기
const TagItem: React.FC<TagItemProps> = ({ tagName, tagCnt }) => {
	return (
		<Link
			key={tagName}
			href={`/post?tag=${tagName}`}
			className="flex flex-col items-center gap-y-2 rounded-lg bg-white border p-4 cursor-pointer hover:bg-gradient-to-br hover:from-indigo-50 hover:via-purple-50 hover:to-blue-50"
		>
			<AspectRatio ratio={1}>
				<Image
					className="object-cover rounded-lg"
					// @ts-ignore
					src={BlogInfo.tagImages[tagName]}
					alt={`${tagName}의 썸네일`}
					fill
				/>
			</AspectRatio>

			<p className="font-semibold px-2 py-0.5 text-neutral-800">
				{tagName} ({tagCnt})
			</p>
		</Link>
	);
};

export default TagItem;
