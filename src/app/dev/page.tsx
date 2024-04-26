import {getAllPostByCategory, getPopularTags} from '@/lib/api';
import Card from '@/components/Card';
import TagItem from '@/components/TagItem';
import MoreButton from '@/components/MoreButton';
import {DEV_LOG_CATEGORY_NAME} from '@/meta';

const DevPage = () => {
  const posts = getAllPostByCategory(DEV_LOG_CATEGORY_NAME);
  const tags = getPopularTags(4);

  return (
    <main>
      <div className="mb-8">
        <h2 className="mb-2.5 text-3xl font-bold text-neutral-800">Dev logs</h2>
        <p className="text-neutral-600">
          개발하면서 직접 경험했던 것을 기록하고 있습니다.
        </p>
      </div>
      <section className="mb-8">
        <h3 className="mb-2.5 text-xl font-bold text-neutral-800">
          Popular tags
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
          {tags.map(([tagName, tagCnt]) => (
            <TagItem key={tagName} tagName={tagName} tagCnt={tagCnt} />
          ))}
        </div>
        <MoreButton text="More Tags" href="/tags" />
      </section>
      <section>
        <h3 className="mb-2.5 text-xl font-bold text-neutral-800">
          All posts ({posts.length})
        </h3>
        <div className="flex flex-col gap-4">
          {posts.map(post => (
            <Card key={post.slug} post={post} />
          ))}
        </div>
      </section>
    </main>
  );
};

export default DevPage;
