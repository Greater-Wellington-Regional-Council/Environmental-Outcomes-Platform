import navigation from '../navigation';
import { Link } from 'gatsby';
import clsx from 'clsx';
import * as React from 'react';

type Props = {
  currentPath: string;
};

export default ({ currentPath }: Props) => (
  <nav className="w-64 pr-8 text-base lg:text-sm xl:w-72 xl:pr-16">
    <ul
      role="list"
      className="mt-2 space-y-2 border-l-2 border-slate-100 lg:mt-4 lg:space-y-4 lg:border-slate-200"
    >
      {navigation.map(({ href, title: linkTitle }) => (
        <li className="relative" key={linkTitle}>
          <Link
            to={href}
            className={clsx(
              'block w-full pl-3.5 before:pointer-events-none before:absolute before:-left-1 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full',
              href === currentPath
                ? 'font-semibold text-sky-500 before:bg-sky-500'
                : 'text-slate-500 before:hidden before:bg-slate-300 hover:text-slate-600 hover:before:block'
            )}
          >
            {linkTitle}
          </Link>
        </li>
      ))}
    </ul>
  </nav>
);
