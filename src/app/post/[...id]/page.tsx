import {notFound} from 'next/navigation';
import {getPostById} from '@/lib/api';
import {Metadata} from 'next';
import PostMetaArea from '@/app/post/[...id]/_components/PostMetaArea';
import React from 'react';
import {useMDXComponent} from 'next-contentlayer/hooks';
import MdxComponents from '@/app/post/[...id]/_components/MdxComponents';

type Params = {
  params: {
    id: string;
  };
};

export default async function Post({params}: Params) {
  const post = getPostById(params.id);

  if (!post) {
    return notFound();
  }

  const MDX = useMDXComponent(post.body.code);

  return (
    <>
      <PostMetaArea post={post} />
      <article className="mx-auto">
        <MDX components={MdxComponents} />
      </article>
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
