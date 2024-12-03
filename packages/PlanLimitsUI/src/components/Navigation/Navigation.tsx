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
      title: "Allocations table",
      link: `/limits/${council.slug}/allocation`,
    }
  ];

  return (
    <div className="flex space-x-4 border-b-2 border-nui-2 display-block h-10 mb-4">
      <p className="text-xl font-bold m-2">View:</p>
      <ul className="flex space-x-4 list-none m-0">
        {pages.map((page, index) => (
          <li key={index} className="h-8 list-none text-lg font-bold mt-2 ml-2 mr-2 mb-0 pb-0 hover:border-b-4 hover:border-kapiti">
            <Link className="" to={page.link}>
              {page.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Navigation;
