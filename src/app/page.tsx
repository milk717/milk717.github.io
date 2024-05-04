import Card from '@/components/Card';
import Profile from '@/components/Profile';
import MoreButton from '@/components/MoreButton';
import {getAllPostByTag} from '@/lib/api';

export default function Home() {
  return (
    <>
      <main className="flex flex-col gap-y-8">
        <Profile />
        <section>
          <h2 className="mb-2.5 text-3xl font-bold text-neutral-800">
            Recent Posts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
            {getAllPostByTag()
              .slice(0, 4)
              .map(post => (
                <Card key={post._id} post={post} />
              ))}
          </div>
          <MoreButton />
        </section>
      </main>
    </>
  );
}
