import { Card } from '@/components/card';
import { getAllPostByTag } from '@/lib/postApi';

type PostProps = { searchParams: Promise<{ tag: string }> };

const Post: React.FC<PostProps> = async ({ searchParams }) => {
  const { tag } = await searchParams;
  const allPosts = getAllPostByTag(tag);

  return (
    <main>
      <h2 className="mb-2.5 text-3xl font-bold text-neutral-800">{tag ? `# ${tag}` : 'All Posts'}</h2>
      <div className="flex flex-col gap-4">
        {allPosts.map((post) => (
          <Card key={post._id} post={post} />
        ))}
      </div>
    </main>
  );
};

export default Post;
