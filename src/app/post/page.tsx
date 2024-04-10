import {getAllPosts} from '@/lib/api';
import Card from '@/components/Card';

const Post = () => {
  const allPosts = getAllPosts();
  return (
    <main>
      <h2 className="mb-2.5 text-3xl font-bold text-neutral-800">All Posts</h2>
      <div className="flex flex-col gap-4">
        {allPosts.map(post => (
          <Card key={post.slug} post={post} />
        ))}
      </div>
    </main>
  );
};

export default Post;
