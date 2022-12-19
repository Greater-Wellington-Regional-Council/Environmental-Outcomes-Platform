import { Outlet } from 'react-router-dom';
import Disclaimer from './components/Disclaimer';

export default function Layout() {
  return (
    <>
      <Disclaimer />
      <div className="flex flex-1 items-stretch overflow-hidden">
        <Outlet />
      </div>
      <div className="hidden">{import.meta.env.VITE_GIT_SHA}</div>
    </>
  );
}
