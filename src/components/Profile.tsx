import Image from 'next/image';
import Link from 'next/link';
import BlogInfo from '@/BlogInfo.json';

const profileInfo = [
  {
    name: 'Email',
    image: '/gmail.svg',
    link: `mailto:${BlogInfo.profile.link.email}`,
  },
  {
    name: 'Github',
    image: '/github.svg',
    link: BlogInfo.profile.link.github,
  },
  {
    name: 'LinkedIn',
    image: '/linkedin.svg',
    link: BlogInfo.profile.link.linkedIn,
  },
  {
    name: 'Resume',
    image: '/figma.svg',
    link: BlogInfo.profile.link.resume,
  },
];

const Profile = () => {
  return (
    <section className="flex flex-col gap-y-4">
      <div className="flex items-center gap-6">
        <Image
          className="rounded-full"
          src={BlogInfo.profile.profileImage}
          alt={`${BlogInfo.profile.name}의 프로필 이미지`}
          width={100}
          height={100}
        />
        <div>
          <h1 className="text-xl font-bold text-neutral-800">
            {BlogInfo.profile.name}
          </h1>
          <p className="text-sm text-neutral-800">
            {BlogInfo.profile.introduce}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-x-6 gap-y-1">
        {profileInfo.map(({name, image, link}) => (
          <Link
            key={link}
            className="flex items-center gap-1.5 h-fit cursor-pointer hover:underline"
            href={link}>
            <Image src={image} alt={`${name} Logo`} width={16} height={16} />
            {name}
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Profile;
