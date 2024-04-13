import {getPopularTags} from '@/lib/api';
import Link from 'next/link';

const TagPage = () => {
  const tags = getPopularTags();

  return (
    <main>
      <div className="mb-8">
        <h2 className="mb-2.5 text-3xl font-bold text-neutral-800">All tags</h2>
        <p className="text-neutral-600">
          개발 관련 게시글의 모든 태그목록 입니다.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {tags.map(([tagName, tagCnt]) => (
          <Link
            key={tagName}
            href={`/post?tag=${tagName}`}
            className="flex justify-between items-center bg-violet-50 px-4 py-3 rounded-lg cursor-pointer hover:bg-violet-100">
            <p className="font-medium text-neutral-800"># {tagName}</p>
            <p className="text-sm text-neutral-700">{tagCnt}</p>
          </Link>
        ))}
      </div>
    </main>
  );
};

export default TagPage;
