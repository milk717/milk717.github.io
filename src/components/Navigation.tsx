'use client';
import Link from 'next/link';
import Search from '@/components/Search';
import { usePathname } from 'next/navigation';
import {cn} from '@/lib/utils';

const navigationItem = [
  {name: 'Dev', path: '/dev'},
  {name: 'Tags', path: '/tags'},
  // {name: '독서', path: '/book'},
];
const Navigation = () => {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col xs:flex-row justify-between pb-8 gap-2">
      <div className="flex items-center justify-between gap-x-8">
        <Link className="py-2 rounded-lg font-semibold text-xl" href="/">
          Sumin's Blog
        </Link>
        <div className="block sm:block space-x-4">
          {navigationItem.map(({name, path}) => (
            <Link
              key={path}
              className={cn(
                `space-x-2 rounded-lg text-muted-foreground`,
                pathname === path
                  ? 'font-semibold text-foreground'
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
