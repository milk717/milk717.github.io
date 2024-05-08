import Image from 'next/image';
import Link from 'next/link';
import BlogInfo from '@/BlogInfo.json';

type TagItemProps = {
  tagName: string;
  tagCnt: number;
};

//FIXME 타입 고치기
const TagItem: React.FC<TagItemProps> = ({tagName, tagCnt}) => {
  return (
    <Link
      key={tagName}
      href={`/post?tag=${tagName}`}
      className="flex flex-col items-center gap-y-2 rounded-lg bg-white border py-2 cursor-pointer hover:bg-gradient-to-br hover:from-indigo-50 hover:via-purple-50 hover:to-blue-50">
      <Image
        className="object-cover"
        // @ts-ignore
        src={BlogInfo.tagImages[tagName]}
        alt={`${tagName}의 썸네일`}
        width={80}
        height={100}
      />
      <p className="font-semibold px-2 py-0.5 text-neutral-800">
        {tagName} ({tagCnt})
      </p>
    </Link>
  );
};

export default TagItem;
