import Link from 'next/link';
import { ArrowRightIcon } from 'lucide-react';

type MoreButtonProps = {
  text?: string;
  href?: string;
};

export const MoreButton: React.FC<MoreButtonProps> = ({ text = 'More Post', href = 'post' }) => {
  return (
    <Link
      className="flex items-center gap-1 text-muted-foreground text-base px-2 py-2 rounded-lg cursor-pointer w-fit hover:underline hover:text-foreground"
      href={href}
    >
      {text}
      <ArrowRightIcon className="w-4 h-4" />
    </Link>
  );
};
