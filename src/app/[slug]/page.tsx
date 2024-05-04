import {notFound} from 'next/navigation';
import {getPostBySlug} from '@/lib/api';
import {Metadata} from 'next';
import PostMetaArea from '@/app/[slug]/_components/PostMetaArea';
import React from 'react';
import MdxComponents from '@/app/[slug]/_components/MdxComponents';
import UtterancesComments from '@/components/UtterancesComments';

type Params = {
  params: {
    slug: string;
  };
};

export default async function Post({params}: Params) {
  const post = getPostBySlug(params.slug);

  console.log(post);

  if (!post) {
    return notFound();
  }

  return (
    <>
      <PostMetaArea post={post} />
      <article className="mx-auto">
        <MdxComponents code={post.body.code} />
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

  const title = `${post.title}`;

  return {
    title,
  };
};
