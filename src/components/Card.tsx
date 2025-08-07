import Image from 'next/image';
import Link from 'next/link';
import dayjs from 'dayjs';
import type { Post } from '@/contentlayer/generated';

type CardProps = {
  post: Post;
};

const Card: React.FC<CardProps> = ({post}) => {
  return (
    <Link
      as={`/${post.slug}`}
      href="/[slug]"
      className="flex flex-col sm:flex-row gap-x-5 gap-y-4 rounded-lg border p-4 bg-white cursor-pointer hover:bg-gradient-to-br hover:from-indigo-50 hover:via-purple-50 hover:to-blue-50">
      <Image
        className="rounded aspect-auto sm:aspect-square sm:w-auto object-contain self-center sm:self-auto"
        width={128}
        height={128}
        src={post.thumbnail}
        alt={`${post.title} 썸네일 이미지`}
      />
      <div className="flex flex-col gap-y-2 justify-between flex-1">
        <div className="flex flex-col gap-y-2">
          <p className="font-semibold text-neutral-800">{post.title}</p>
          <p className="text-xs text-neutral-500">{post.excerpt}</p>
        </div>
        <div className="flex items-center justify-between gap-x-2">
          <p className="flex gap-2 text-xs text-neutral-400">
            {post.tags.map(tag => `#${tag} `)}
          </p>
          <p className="text-xs text-neutral-400 flex-shrink-0">
            {dayjs(post.date).format('YY.MM.DD')}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default Card;
