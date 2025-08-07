import dayjs from 'dayjs';
import Link from 'next/link';
import { CATEGORY_PATH_MAP } from '@/utils/constants';
import { isValidCategory } from '@/utils/typeGuards';
import type { Post } from '@/contentlayer/generated';

type PostMetaAreaProps = {
  post: Post;
};

const PostMetaArea: React.FC<PostMetaAreaProps> = ({post}) => {
  return (
    <section className="mb-8">
      <Link
        href={`/${isValidCategory(post.category) ? CATEGORY_PATH_MAP[post.category].path : 'dev'}`}
        className="w-fit">
        <p className="px-3 py-2 rounded bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 text-sm w-fit text-neutral-700 cursor-pointer">
          📁 {post.category}
        </p>
      </Link>
      <h1 className="text-3xl font-bold text-neutral-800 my-6">{post.title}</h1>
      <div className="flex justify-between gap-y-3 flex-col sm:flex-row">
        <div className="flex gap-2 flex-wrap">
          {post.tags.map(tag => (
            <Link key={tag} href={`/post?tag=${tag}`}>
              <p className="bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 px-2 py-0.5 rounded text-sm text-indigo-800">
                # {tag}
              </p>
            </Link>
          ))}
        </div>
        <p className="text-neutral-600 text-sm">
          {dayjs(post.date).format('YYYY-MM-DD')}
        </p>
      </div>
      <hr className="mt-8" />
    </section>
  );
};

export default PostMetaArea;
