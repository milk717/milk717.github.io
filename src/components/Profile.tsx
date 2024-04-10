import Image from 'next/image';
import Link from 'next/link';

//TODO: 링크 정보 별도의 상수로 관리하기
const Profile = () => {
  return (
    <section className="flex flex-col gap-y-4">
      <div className="flex items-center gap-6">
        <Image
          className="rounded-full"
          src="https://avatars.githubusercontent.com/u/57657868?v=4"
          alt="깃허브 프로필 이미지"
          width={100}
          height={100}
        />
        <div>
          <h1 className="text-xl font-bold text-neutral-800">Sumin</h1>
          <p className="text-sm text-neutral-800">
            여기에 나를 소개하는 문구 한줄 작성하기
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-x-6 gap-y-1">
        <Link
          className="flex items-center gap-1.5 h-fit cursor-pointer hover:underline"
          href="mailto:robolindasoo@gmail.com">
          <Image src="/gmail.svg" alt="Gmail Logo" width={16} height={16} />
          Email
        </Link>
        <Link
          className="flex items-center gap-1.5 h-fit cursor-pointer hover:underline"
          href="https://github.com/milk717">
          <Image src="/github.svg" alt="Github Logo" width={16} height={16} />
          Github
        </Link>
        <Link
          className="flex items-center gap-1.5 h-fit cursor-pointer hover:underline"
          href="https://www.linkedin.com/in/%EC%88%98%EB%AF%BC-%EA%B9%80-975393287/">
          <Image
            src="/linkedin.svg"
            alt="LinkedIn Logo"
            width={16}
            height={16}
          />
          LinkedIn
        </Link>
        <Link
          className="flex items-center gap-1.5 h-fit cursor-pointer hover:underline"
          href="https://www.figma.com/proto/BlOYZmqpFey7maVypdLDi8/%EA%B9%80%EC%88%98%EB%AF%BC-%EC%9D%B4%EB%A0%A5%EC%84%9C?page-id=0%3A1&node-id=1-3&mode=design&t=SgrcB0PDeCYNHGwZ-1">
          <Image src="/figma.svg" alt="Figma Logo" width={16} height={16} />
          Resume
        </Link>
      </div>
    </section>
  );
};

export default Profile;
