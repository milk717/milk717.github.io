import React from 'react';
import {Post} from '@/interfaces/post';
import Image from 'next/image';
import Link from 'next/link';

type CardProps = {
  post: Post;
};

const Card: React.FC<CardProps> = ({post}) => {
  return (
    <Link as={`/post/${post.slug}`} href="/post/[slug]" className="bg-white">
      <div className="flex gap-x-3 rounded-lg border p-4 cursor-pointer hover:bg-gradient-to-br hover:from-indigo-50 hover:via-purple-50 hover:to-blue-50">
        <Image
          className="rounded w-16 sm:w-24"
          width={128}
          height={128}
          src="https://www.milk717.com/static/8eecbbb84609a5a15f7af115014f5d14/36b38/img-1.webp"
          alt={`${post.title} 썸네일 이미지`}
        />
        <div className="flex flex-col justify-between flex-1">
          <div className="flex flex-col gap-y-1">
            <p className="font-semibold">{post.title}</p>
            <p className="text-sm text-gray-500">{post.excerpt}</p>
          </div>
          <div className="flex items-center justify-between gap-x-2">
            <p className="flex gap-2 text-xs text-neutral-400">
              {post.tags.map(tag => `#${tag} `)}
            </p>
            <p className="text-xs text-neutral-400 flex-shrink-0">
              {post.date}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Card;
