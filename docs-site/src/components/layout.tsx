import * as React from 'react';

import Header from './header';
import Navigation from './navigation';

type Props = {
  currentPath: string;
  children: React.ReactElement | React.ReactElement[];
};

export default ({ children, currentPath }: Props) => {
  return (
    <>
      <Header />
      <div className="relative mx-auto flex max-w-8xl justify-center sm:px-2 lg:px-8 xl:px-12">
        <div className="hidden lg:relative lg:block lg:flex-none">
          <div className="absolute inset-y-0 right-0 w-[50vw] bg-slate-50" />
          <div className="sticky top-[4.5rem] -ml-0.5 h-[calc(100vh-4.5rem)] overflow-y-auto py-16 pl-0.5">
            <Navigation currentPath={currentPath} />
          </div>
        </div>
        <div className="min-w-0 max-w-2xl flex-auto px-4 py-16 lg:max-w-none lg:pr-0 lg:pl-8 xl:px-16">
          <article>{children}</article>
        </div>
      </div>
    </>
  );
};
