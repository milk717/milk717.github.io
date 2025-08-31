import { type ChangeEventHandler, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { getPostListByKeyword } from '@/lib/postApi';
import dayjs from 'dayjs';
import Link from 'next/link';

const highlightKeyword = (text: string, keyword: string) => {
  const regExp = new RegExp(`(${keyword})`, 'i');

  return text
			.split(regExp)
			.filter((v) => v)
			.map((word, index) => (
				<span
					key={`${word}-${
						// biome-ignore lint/suspicious/noArrayIndexKey: 리스트 순서 변하지 않음
						index
					}`}
					className={`${word.match(regExp)?.at(0) ? "bg-violet-100 py-1 rounded text-violet-800 ring-1 ring-violet-400" : ""}`}
				>
					{word}
				</span>
			));
};

export const Search = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [keyword, setKeyword] = useState('');

  const postList = getPostListByKeyword(keyword);

  const toggleModal = () => {
    setIsOpen(prev => !prev);
  };

  const handleKeywordChange: ChangeEventHandler<HTMLInputElement> = e => {
    setKeyword(e.target.value);
  };

  return (
    <div className="flex relative gap-x-2 px-4 py-2 w-full xs:w-1/4 rounded-lg primary-hover bg-muted">
      <svg
        className="w-4"
        fill="#737373"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="search icon"
        viewBox="0 0 512 512"
        aria-hidden="true">
        <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
      </svg>
      <button
        type="button"
        className="w-full bg-transparent text-neutral-500 text-sm outline-0 text-left"
        onClick={toggleModal}>
        Search...
      </button>
      <Dialog
        open={isOpen}
        onClose={toggleModal}
        className="fixed left-1/2 top-24">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <Dialog.Panel className="flex flex-col relative w-[90vw] sm:w-[500px] md:w-[600px] max-h-[70vh] overflow-y-scroll -translate-x-1/2 bg-neutral-50/95 rounded-lg">
          <Dialog.Title className="sticky top-0 bg-neutral-50">
            <input
              className="w-full bg-transparent p-4 rounded-t-lg text-neutral-600 outline-0 border-b"
              placeholder="Search..."
              value={keyword}
              onChange={handleKeywordChange}
            />
          </Dialog.Title>
          <div className="flex flex-col gap-y-3">
            {postList.map(post => (
              <Link
                key={post._id}
                as={`/post/${post._id}`}
                href="/post/[slug]"
                onClick={toggleModal}>
                <div className="flex flex-col gap-y-2 py-2 px-4 cursor-pointer hover:bg-black/5">
                  <p className="text-neutral-700">
                    {highlightKeyword(post.title, keyword)}
                  </p>
                  <div className="flex justify-between">
                    <p className="text-xs text-neutral-400">
                      {highlightKeyword(
                        post.tags.map(tag => `#${tag}`).join(' '),
                        keyword,
                      )}
                    </p>
                    <p className="text-xs text-neutral-400">
                      {highlightKeyword(
                        dayjs(post.date).format('YYYY-MM-DD'),
                        keyword,
                      )}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Dialog.Panel>
      </Dialog>
    </div>
  );
};