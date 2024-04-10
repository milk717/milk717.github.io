import {getAllPosts} from '@/lib/api';
import Card from '@/components/Card';
import Profile from '@/components/Profile';
import Image from 'next/image';

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
            {allPosts.slice(0, 4).map(post => (
              <Card key={post.slug} post={post} />
            ))}
          </div>
          <p className="flex items-center gap-1 text-neutral-500 text-lg mt-2 px-2 py-2 rounded-lg cursor-pointer w-fit hover:bg-slate-100">
            More
            <Image
              src="/arrow-right.svg"
              alt="see all posts"
              width={14}
              height={14}
            />
          </p>
        </section>
      </main>
    </>
  );
}
