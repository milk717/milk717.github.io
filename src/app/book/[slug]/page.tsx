import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import MdxComponents from '@/components/MdxComponents';
import UtterancesComments from '@/components/UtterancesComments';
import { getBookBySlug } from '@/lib/bookApi';
import BookMetaArea from '@/app/book/[slug]/_components/BookMetaArea';
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
  const book = getBookBySlug(params.slug);

  if (!book) {
    return notFound();
  }

  return {
    title: book.title,
    authors: {name: BlogInfo.profile.name, url: BlogInfo.profile.link.github},
    keywords: book.tags,
    category: book.category,
    openGraph: {
      type: 'article',
      title: book.title,
      images: [{url: book.cover_url}],
      locale: 'ko',
    },
  };
};
