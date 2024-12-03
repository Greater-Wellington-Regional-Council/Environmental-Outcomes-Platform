import { Link, useLoaderData } from 'react-router-dom';
import { useAtom } from 'jotai/index';
import { councilAtom } from '@lib/loader';
import { ViewLocation } from '@src/shared/lib/types/global';
import { createLocationString } from '@lib/locationString';

const Navigation = () => {
  const [council] = useAtom(councilAtom);

  const {
    locationString: initialViewLocation,
  } = useLoaderData() as { locationString: ViewLocation; pinnedLocation: ViewLocation };

  const pages = [
    {
      title: "Allocations and usage map",
      link: initialViewLocation ? `/limits/${council.slug}/${createLocationString(initialViewLocation)}` : `/limits/${council.slug}`,
    },
    {
      title: "Allocations",
      link: `/limits/${council.slug}/usage`,
    },
    {
      title: "Water allocations",
      link: `/limits/${council.slug}/allocation`,
    }
  ];

  return (
    <div className="flex space-x-4 h-[100px] border-solid border-b-2-kapiti h-[1.25rem]">
      <p className="text-xl font-bold m-2">View:</p>
      <ul className="flex space-x-4 list-none m-0">
        {pages.map((page, index) => (
          <li key={index} className="mb-2 list-none text-lg font-bold m-2">
            <Link className="hover:underline hover:decoration-color:kapiti hover:text-decoration-[3px]" to={page.link}>
              {page.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Navigation;
