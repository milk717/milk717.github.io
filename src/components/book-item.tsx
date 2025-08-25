import Image from 'next/image';
import type { Book } from '@/contentlayer/generated';
import Link from 'next/link';

type BookProps = {
  book: Book;
};

const BookItem: React.FC<BookProps> = ({book}) => {
  return (
    <Link as={`/book/${book.slug}`} href="/book/[slug]">
      <div className="flex flex-col items-center gap-y-2 rounded-lg border p-4 cursor-pointer hover:bg-gradient-to-br hover:from-indigo-50 hover:via-purple-50 hover:to-blue-50">
        <Image
          className="rounded h-60"
          height={400}
          width={200}
          src={book.cover_url}
          alt={`${book.title} 썸네일 이미지`}
        />
        <p className="font-semibold">{book.title}</p>
      </div>
    </Link>
  );
};

export default BookItem;
