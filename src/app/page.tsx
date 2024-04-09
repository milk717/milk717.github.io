import {getAllPosts} from '@/lib/api';
import Card from '@/components/Card';

export default function Home() {
  const allPosts = getAllPosts();

  return (
    <main>
      {allPosts.map(post => (
        <Card key={post.slug} post={post} />
      ))}
    </main>
  );
}
