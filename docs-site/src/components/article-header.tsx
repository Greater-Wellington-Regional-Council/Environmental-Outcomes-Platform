import * as React from 'react';

type Props = {
  section: string;
  title: string;
};

export default function Template({ section, title }: Props) {
  return (
    <header className="mb-9 space-y-1">
      <p className="font-display text-sm font-medium text-sky-500">{section}</p>
      <h1 className="font-display text-3xl tracking-tight text-slate-900">
        {title}
      </h1>
    </header>
  );
}
