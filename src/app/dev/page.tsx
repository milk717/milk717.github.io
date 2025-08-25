import { getAllPosts, getPopularTags } from '@/lib/postApi';
import Card from '@/components/Card';
import TagItem from '@/components/TagItem';
import MoreButton from '@/components/MoreButton';

const DevPage = () => {
  const posts = getAllPosts();
  const tags = getPopularTags(4);

  return (
    <main>
      <div className="mb-8">
        <h2 className="mb-2.5 text-3xl font-bold text-neutral-800">Dev Posts</h2>
        <p className="text-neutral-600">
          개발과 관련된 게시글입니다.
        </p>
      </div>
      <section className="mb-8">
        <h3 className="mb-2.5 text-xl font-bold text-neutral-800">Tags</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
          {tags.map(([tagName, tagCnt]) => (
            <TagItem key={tagName} tagName={tagName} tagCnt={tagCnt} />
          ))}
        </div>
        <MoreButton text="More Tags" href="/tags" />
      </section>
      <section>
        <h3 className="mb-2.5 text-xl font-bold text-neutral-800">
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
