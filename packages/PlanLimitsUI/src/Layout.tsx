import { Outlet } from 'react-router-dom';
import Disclosure from './components/Disclosure';

export default function Layout() {
  return (
    <>
      <Disclosure />
      <div className="flex flex-1 items-stretch overflow-hidden">
        <Outlet />
      </div>
      <div className="hidden">{import.meta.env.VITE_GIT_SHA}</div>
    </>
  );
}
