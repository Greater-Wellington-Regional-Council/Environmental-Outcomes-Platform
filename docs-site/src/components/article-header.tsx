import React from 'react';

type Props = {
  title: string;
};

function ArticleHeader({ title }: Props) {
  return (
    <header className="mb-9 space-y-1">
      <h1 className="font-display text-3xl tracking-tight text-slate-900">
        {title}
      </h1>
    </header>
  );
}

export default ArticleHeader;
