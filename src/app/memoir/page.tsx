import {getAllPostByCategory} from '@/lib/postApi';
import Card from '@/components/Card';
import {MEMOIR_LOG_CATEGORY_NAME} from '@/utils/constants';

const MemoirPage = () => {
  const posts = getAllPostByCategory(MEMOIR_LOG_CATEGORY_NAME);

  return (
    <main>
      <div className="mb-8">
        <h2 className="mb-2.5 text-3xl font-bold text-neutral-800">회고록</h2>
        <p className="text-neutral-600">경험한 것을 회고하고 있습니다.</p>
      </div>
      <section>
        <div className="flex flex-col gap-4">
          {posts.map(post => (
            <Card key={post._id} post={post} />
          ))}
        </div>
      </section>
    </main>
  );
};

export default MemoirPage;
