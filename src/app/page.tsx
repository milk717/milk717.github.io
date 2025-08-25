import {Card} from '@/components/card';
import {Profile} from '@/components/profile';
import {MoreButton} from '@/components/more-button';
import {getAllPostByTag} from '@/lib/postApi';

export default function Home() {
  return (
    <>
      <main className="flex flex-col gap-y-8">
        <Profile />
        <section>
          <h2 className="mb-2.5 text-2xl font-bold text-foreground">
            최근 게시글
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
