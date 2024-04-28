import Card from '@/components/Card';
import {getAllPostByCategory} from '@/lib/api';
import {STUDY_LOG_CATEGORY_NAME} from '@/meta';

const LearningPage = () => {
  const posts = getAllPostByCategory(STUDY_LOG_CATEGORY_NAME);

  return (
    <main>
      <div className="mb-8">
        <h2 className="mb-2.5 text-3xl font-bold text-neutral-800">
          Study logs
        </h2>
        <p className="text-neutral-600">학습한 내용을 기록하고 있습니다.</p>
      </div>
      <section>
        <h3 className="mb-2.5 text-xl font-bold text-neutral-800">
          All posts ({posts.length})
        </h3>
        <div className="flex flex-col gap-4">
          {posts.map(post => (
            <Card key={post._id} post={post} />
          ))}
        </div>
      </section>
    </main>
  );
};

export default LearningPage;
