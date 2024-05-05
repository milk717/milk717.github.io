import {notFound} from 'next/navigation';
import {Metadata} from 'next';
import React from 'react';
import MdxComponents from '@/components/MdxComponents';
import UtterancesComments from '@/components/UtterancesComments';
import {getBookBySlug} from '@/lib/bookApi';
import BookMetaArea from '@/app/book/[slug]/_components/BookMetaArea';
import {getPostBySlug} from '@/lib/postApi';
import BlogInfo from '@/BlogInfo.json';

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
  const post = getPostBySlug(params.slug);

  if (!post) {
    return notFound();
  }

  return {
    title: post.title,
    description: post.excerpt,
    authors: {name: BlogInfo.profile.name, url: BlogInfo.profile.link.github},
    keywords: post.tags,
    category: post.category,
    openGraph: {
      type: 'article',
      title: post.title,
      images: [{url: post.thumbnail}],
      description: post.excerpt,
      locale: 'ko',
    },
  };
};
