import React from 'react';
import {Post} from '@/interfaces/post';
import Image from 'next/image';

type CardProps = {
  post: Post;
};

const Card: React.FC<CardProps> = ({post}) => {
  return (
    <div className="flex gap-x-3 rounded-xl border p-4 cursor-pointer hover:bg-gradient-to-br hover:from-indigo-50 hover:via-purple-50 hover:to-blue-50">
      <Image
        className="rounded h-32"
        width={128}
        height={128}
        src="https://www.milk717.com/static/8eecbbb84609a5a15f7af115014f5d14/36b38/img-1.webp"
        alt={`${post.title} 썸네일 이미지`}
      />
      <div className="flex flex-col justify-between flex-1">
        <div className="flex flex-col gap-y-1 ps-2">
          <p className="font-semibold">{post.title}</p>
          <p className="text-sm text-gray-500">{post.excerpt}</p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {post.tags.map(tag => (
              <p
                key={tag}
                className="px-2 py-1 bg-violet-50 rounded-2xl text-xs text-violet-900">
                {tag}
              </p>
            ))}
          </div>
          <p className="text-xs text-gray-500">{post.date}</p>
        </div>
      </div>
    </div>
  );
};

export default Card;
