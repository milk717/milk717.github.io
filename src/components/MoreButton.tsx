import Link from 'next/link';
import Image from 'next/image';

type MoreButtonProps = {
  text?: string;
  href?: string;
};

const MoreButton: React.FC<MoreButtonProps> = ({
  text = 'More Post',
  href = 'post',
}) => {
  return (
    <Link
      className="flex items-center gap-1 text-neutral-500 text-base px-2 py-2 rounded-lg cursor-pointer w-fit hover:bg-slate-100"
      href={href}>
      {text}
      <Image
        src="/arrow-right.svg"
        alt="see all posts"
        width={14}
        height={14}
      />
    </Link>
  );
};

export default MoreButton;
