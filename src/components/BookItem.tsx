import React from 'react';
import Image from 'next/image';
import {Post} from '@/contentlayer/generated';

type BookProps = {
  post: Post;
};

const BookItem: React.FC<BookProps> = ({post}) => {
  return (
    <div className="flex flex-col gap-y-2 rounded-lg border p-4 cursor-pointer hover:bg-gradient-to-br hover:from-indigo-50 hover:via-purple-50 hover:to-blue-50">
      <Image
        className="rounded"
        height={400}
        width={200}
        src="https://www.milk717.com/static/8eecbbb84609a5a15f7af115014f5d14/36b38/img-1.webp"
        alt={`${post.title} 썸네일 이미지`}
      />
      <p className="font-semibold">{post.title}</p>
    </div>
  );
};

export default BookItem;
