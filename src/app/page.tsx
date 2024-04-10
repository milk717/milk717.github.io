import {getAllPosts} from '@/lib/api';
import Card from '@/components/Card';
import Profile from '@/components/Profile';

export default function Home() {
  const allPosts = getAllPosts();

  return (
    <>
      <main className="flex flex-col gap-y-8">
        <Profile />
        <section>
          <h2 className="mb-2.5 text-3xl font-bold text-neutral-800">
            Recent Posts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allPosts.map(post => (
              <Card key={post.slug} post={post} />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
