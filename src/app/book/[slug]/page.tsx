import {notFound} from 'next/navigation';
import {Metadata} from 'next';
import React from 'react';
import MdxComponents from '@/app/[slug]/_components/MdxComponents';
import UtterancesComments from '@/components/UtterancesComments';
import {getBookBySlug} from '@/lib/bookApi';
import BookMetaArea from '@/app/book/[slug]/_components/BookMetaArea';

type Params = {
  params: {
    slug: string;
  };
};

export default async function Post({params}: Params) {
  const book = getBookBySlug(params.slug);

  if (!book) {
    return notFound();
  }

  return (
    <>
      <BookMetaArea book={book} />
      <article className="mx-auto">
        <MdxComponents code={book.body.code} />
      </article>
      <UtterancesComments />
    </>
  );
}
export const generateMetadata = ({params}: Params): Metadata => {
  const post = getBookBySlug(params.slug);

  if (!post) {
    return notFound();
  }

  const title = `${post.title}`;

  return {
    title,
  };
};
