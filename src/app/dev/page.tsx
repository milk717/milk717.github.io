import { getAllPosts, getPopularTags } from '@/lib/postApi';
import {Card} from '@/components/card';
import {TagItem} from '@/components/tag-item';
import {MoreButton} from '@/components/more-button';

const DevPage = () => {
  const posts = getAllPosts();
  const tags = getPopularTags(4);

  return (
    <main>
      <div className="mb-8">
        <h2 className="mb-2.5 text-3xl font-bold text-foreground">Dev Posts</h2>
        <p className="text-muted-foreground">개발과 관련된 게시글입니다.</p>
      </div>
      <section className="mb-8">
        <h3 className="mb-2.5 text-xl font-bold text-foreground">Tags</h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
          {tags.map(([tagName, tagCnt]) => (
            <TagItem key={tagName} tagName={tagName} tagCnt={tagCnt} />
          ))}
        </div>
        <MoreButton text="More Tags" href="/tags" />
      </section>
      <section>
        <h3 className="mb-2.5 text-xl font-bold text-foreground">
          Posts ({posts.length})
        </h3>
        <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
          {posts.map(post => (
            <Card key={post._id} post={post} />
          ))}
        </div>
      </section>
    </main>
  );
};

export default DevPage;
