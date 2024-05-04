import React from 'react';
import Image from 'next/image';
import {Book} from '@/contentlayer/generated';
import Link from 'next/link';

type BookProps = {
  post: Book;
};

const BookItem: React.FC<BookProps> = ({post}) => {
  return (
    <Link as={`/book/${post.slug}`} href="/book/[slug]">
      <div className="flex flex-col gap-y-2 rounded-lg border p-4 cursor-pointer hover:bg-gradient-to-br hover:from-indigo-50 hover:via-purple-50 hover:to-blue-50">
        <Image
          className="rounded"
          height={400}
          width={200}
          src={post.cover_url}
          alt={`${post.title} 썸네일 이미지`}
        />
        <p className="font-semibold">{post.title}</p>
      </div>
    </Link>
  );
};

export default BookItem;
