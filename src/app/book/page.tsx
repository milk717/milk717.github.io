import {getAllPostByCategory, getAllRecommendedBookPost} from '@/lib/api';
import BookItem from '@/components/BookItem';
import {BOOK_LOG_CATEGORY_NAME} from '@/meta';

const BookPage = () => {
  const posts = getAllPostByCategory(BOOK_LOG_CATEGORY_NAME);
  const recommendedBookPost = getAllRecommendedBookPost();

  return (
    <main>
      <div className="mb-8">
        <h2 className="mb-2.5 text-3xl font-bold text-neutral-800">
          Book logs
        </h2>
        <p className="text-neutral-600">
          책을 읽으며 작성했던 독서 노트를 정리하고 있습니다.
        </p>
      </div>
      <section className="mb-8">
        <h3 className="mb-2.5 text-xl font-bold text-neutral-800">
          Recommended books ({recommendedBookPost.length})
        </h3>
        <div className="grid grid-cols-4 gap-4">
          {recommendedBookPost.map(post => (
            <BookItem key={post.slug} post={post} />
          ))}
        </div>
      </section>
      <section>
        <h3 className="mb-2.5 text-xl font-bold text-neutral-800">
          All books ({posts.length})
        </h3>
        <div className="grid grid-cols-4 gap-4">
          {posts.map(post => (
            <BookItem key={post.slug} post={post} />
          ))}
        </div>
      </section>
    </main>
  );
};

export default BookPage;
