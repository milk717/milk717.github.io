import BookItem from "@/components/book-item";
import { allBooks } from "@/contentlayer/generated";

const BookPage = () => {
	return (
		<main>
			<div className="mb-8">
				<h2 className="mb-2.5 text-3xl font-bold text-neutral-800">Book logs</h2>
				<p className="text-neutral-600">책을 읽으며 작성했던 독서 노트를 정리하고 있습니다.</p>
			</div>
			<section>
				{/*<div className="flex gap-2 mb-4">*/}
				{/*  {new Array(5).fill('⭐').map((v, i) => (*/}
				{/*    <button key={i} className="px-1.5 py-0.5 rounded bg-white border">*/}
				{/*      {v.repeat(5 - i)}*/}
				{/*    </button>*/}
				{/*  ))}*/}
				{/*</div>*/}
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
					{allBooks.map((book) => (
						<BookItem key={book.slug} book={book} />
					))}
				</div>
			</section>
		</main>
	);
};

export default BookPage;
