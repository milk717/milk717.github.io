import {getAllPosts} from '@/lib/api';
import Card from '@/components/Card';

export default function Home() {
  const allPosts = getAllPosts();

  return (
    <main className="flex flex-col gap-y-4">
      {allPosts.map(post => (
        <Card key={post.slug} post={post} />
      ))}
    </main>
  );
}
