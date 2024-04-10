import {notFound} from 'next/navigation';
import {getPostBySlug} from '@/lib/api';
import {Metadata} from 'next';
import {MDXRemote} from 'next-mdx-remote/rsc';
import MdxComponents from '@/components/MdxComponents';
import remarkGfm from 'remark-gfm';

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
    <main>
      <article>
        <MDXRemote
          components={MdxComponents}
          source={post.content}
          options={{mdxOptions: {remarkPlugins: [remarkGfm]}}}
        />
      </article>
    </main>
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

// export async function generateStaticParams() {
//   const posts = getAllPosts();
//
//   return posts.map(post => ({
//     slug: post.slug,
//   }));
// }
