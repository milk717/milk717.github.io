import Image from 'next/image';
import Link from 'next/link';
import dayjs from 'dayjs';
import type { Post } from '@/contentlayer/generated';
import {cn} from '@/lib/utils';

type CardProps = {post: Post};

const Card: React.FC<CardProps> = ({post}) => {
  return (
    <Link
      as={`/${post.slug}`}
      href="/[slug]"
      className={cn(
        'flex flex-col sm:flex-row gap-x-5 gap-y-4 rounded-lg p-2 cursor-pointer border',
        'hover:ring-1 hover:ring-indigo-200 primary-hover bg-card',
      )}>
      <Image
        className="w-32 h-32 rounded aspect-auto sm:aspect-square sm:w-auto object-contain self-center sm:self-auto"
        width={128}
        height={128}
        src={post.thumbnail}
        alt={`${post.title} 썸네일 이미지`}
      />
      <div className="flex flex-col gap-y-2 justify-between flex-1">
        <div className="flex flex-col gap-y-2">
          <p className="font-semibold text-foreground">{post.title}</p>
          <p className="text-xs text-muted-foreground">{post.excerpt}</p>
        </div>
        <div className="flex items-end justify-between gap-x-2">
          <p className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            {post.tags.map(tag => `#${tag} `)}
          </p>
          <p className="text-xs text-muted-foreground flex-shrink-0">
            {dayjs(post.date).format('YY.MM.DD')}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default Card;
