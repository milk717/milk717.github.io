'use client';
import Link from 'next/link';
import Search from '@/components/Search';
import { usePathname } from 'next/navigation';
import {cn} from '@/lib/utils';

const navigationItem = [
  {name: '개발', path: '/dev'},
  {name: '회고', path: '/memoir'},
  {name: '학습', path: '/learning'},
  {name: '독서', path: '/book'},
];
const Navigation = () => {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col xs:flex-row justify-between pb-8 gap-2">
      <div className="flex items-center justify-between">
        <Link
          className="py-2 px-3 rounded-lg font-bold text-xl hover:bg-gradient-to-br hover:from-indigo-50 hover:via-purple-50 hover:to-blue-50"
          href="/">
          🦄
        </Link>
        <div className="block sm:block">
          {navigationItem.map(({name, path}) => (
            <Link
              key={path}
              className={cn(
                `space-x-2 py-3 px-6 rounded-lg text-neutral-800 hover:bg-gradient-to-br hover:from-indigo-50 hover:via-purple-50 hover:to-blue-50`,
                pathname === path
                  ? 'font-semibold text-neutral-950'
                  : 'font-normal',
              )}
              href={path}>
              <span className="inline">{name}</span>
            </Link>
          ))}
        </div>
      </div>
      <Search />
    </nav>
  );
};

export default Navigation;
