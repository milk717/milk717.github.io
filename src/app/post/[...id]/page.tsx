import {notFound} from 'next/navigation';
import {getPostById} from '@/lib/api';
import {Metadata} from 'next';
import PostMetaArea from '@/app/post/[...id]/_components/PostMetaArea';
import React from 'react';
import MdxComponents from '@/app/post/[...id]/_components/MdxComponents';
import UtterancesComments from '@/components/UtterancesComments';

type Params = {
  params: {
    id: string[];
  };
};

export default async function Post({params}: Params) {
  const post = getPostById(params.id);

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
  const post = getPostById(params.id);

  if (!post) {
    return notFound();
  }

  const title = `${post.title}`;

  return {
    title,
  };
};
