import {notFound} from 'next/navigation';
import {getPostBySlug} from '@/lib/api';
import {Metadata} from 'next';
import {MDXRemote} from 'next-mdx-remote/rsc';
import MdxComponents from '@/app/post/[...slug]/_components/MdxComponents';
import remarkGfm from 'remark-gfm';
import PostMetaArea from '@/app/post/[...slug]/_components/PostMetaArea';
import React from 'react';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

type Params = {
  params: {
    slug: string;
  };
};

export default async function Post({params}: Params) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    return notFound();
  }

  return (
    <>
      <PostMetaArea post={post} />
      <article className="mx-auto">
        <MDXRemote
          components={MdxComponents}
          source={post.content}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [
                rehypeSlug,
                [rehypePrettyCode, {theme: 'one-dark-pro', defaultLang: 'ts'}],
                [
                  rehypeAutolinkHeadings,
                  {
                    properties: {
                      className: ['anchor'],
                    },
                    behavior: 'wrap',
                  },
                ],
              ],
            },
          }}
        />
      </article>
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
