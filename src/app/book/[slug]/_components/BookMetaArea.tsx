import dayjs from "dayjs";
import Link from "next/link";
import type { Book } from "@/contentlayer/generated";
import Image from "next/image";

type PostMetaAreaProps = {
	book: Book;
};

const getBookPeriod = (book: Book) => {
	const startReadDate = dayjs(book.start_read_date);
	const finishReadDate = dayjs(book.finish_read_date);
	const diff = finishReadDate.diff(startReadDate, "day");

	return `${startReadDate.format("YY.MM.DD")} ~ ${finishReadDate.format("YY.MM.DD")} ${diff}일 동안 읽음`;
};

const BookMetaArea: React.FC<PostMetaAreaProps> = ({ book }) => {
	return (
		<>
			<section className="flex gap-x-6 mb-8">
				<div className="hidden sm:block">
					<Image className="rounded mb-2" height={400} width={200} src={book.cover_url} alt={`${book.title} 썸네일 이미지`} />
					<p className="text-center text-xs text-neutral-400">{book.author}</p>
				</div>
				<div className="flex flex-col justify-between gap-y-4">
					<div className="flex flex-col gap-y-2">
						<p className="px-3 py-2 rounded bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 text-sm w-fit text-neutral-700 cursor-pointer">
							📁 {book.category}
						</p>
						<h1 className="text-3xl font-bold text-neutral-800 my-2">{book.title}</h1>
						<div className="flex gap-2 flex-wrap">
							{book.tags.map((tag) => (
								<Link key={tag} href={`/book?tag=${tag}`}>
									<p className="bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 px-2 py-0.5 rounded text-sm text-indigo-800"># {tag}</p>
								</Link>
							))}
						</div>
					</div>
					<div className="flex flex-col gap-y-2">
						<p className="text-neutral-500 text-xs">독서 기간: {getBookPeriod(book)}</p>
						<p className="text-neutral-500 text-xs">페이지 수: {book.total_page}p</p>
						<p className="text-neutral-500 text-xs">내 평점: {"⭐".repeat(book.my_rate)}</p>
					</div>
				</div>
			</section>
			<hr />
		</>
	);
};

export default BookMetaArea;
