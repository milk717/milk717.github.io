import Image from 'next/image';
import Link from 'next/link';

type TagItemProps = {
  tagName: string;
  tagCnt: number;
};
const TagItem: React.FC<TagItemProps> = ({tagName, tagCnt}) => {
  return (
    <Link
      key={tagName}
      href={`/post?tag=${tagName}`}
      className="flex flex-col items-center rounded-lg bg-white border cursor-pointer hover:bg-gradient-to-br hover:from-indigo-50 hover:via-purple-50 hover:to-blue-50">
      <Image
        className="object-cover"
        src="https://www.milk717.com/static/8eecbbb84609a5a15f7af115014f5d14/36b38/img-1.webp"
        alt="깃허브 프로필 이미지"
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
