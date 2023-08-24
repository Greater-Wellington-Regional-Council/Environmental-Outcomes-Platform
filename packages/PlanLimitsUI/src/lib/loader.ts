import { type LoaderFunction, redirect } from 'react-router-dom';
import { atom, type Atom } from 'jotai';
import {
  createLocationString,
  createPinnedLocationString,
  parseLocationString,
  parsePinnedLocation,
} from './locationString';

import { Councils, DefaultCouncil } from './councilData';

export let councilAtom: Atom<Council>;

function defaultPathForCouncil(council: Council) {
  return viewLocationUrlPath(council.slug, council.defaultViewLocation);
}

export function viewLocationUrlPath(
  councilSlug: string,
  viewLocation: ViewLocation
) {
  return `/limits/${councilSlug}/${createLocationString(viewLocation)}`;
}

export function pinnedLocationUrlParam(pinnedLocation: PinnedLocation) {
  return `pinned=${createPinnedLocationString(pinnedLocation)}`;
}

export const defaultAppPath = defaultPathForCouncil(DefaultCouncil);

export const councilLoader: LoaderFunction = ({ params }) => {
  const council = Councils.find((c) => c.slug === params.council);
  if (!council) throw new Response('Council Not Found', { status: 404 });

  councilAtom = atom(council);

  return {
    council,
  };
};

export const loader: LoaderFunction = ({ params, request }) => {
  const council = Councils.find((c) => c.slug === params.council);
  if (!council) throw new Response('Council Not Found', { status: 404 });

  councilAtom = atom(council);

  if (!params.location) return redirect(defaultPathForCouncil(council));

  const locationString = parseLocationString(params.location);
  if (!locationString) throw new Response('Invalid location', { status: 500 });

  const url = new URL(request.url);
  const pinnedParam = url.searchParams.get('pinned');
  return {
    council,
    locationString,
    pinnedLocation: pinnedParam && parsePinnedLocation(pinnedParam),
  };
};
