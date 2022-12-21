import { Outlet } from 'react-router-dom';
import Disclaimer from './components/Disclaimer';

export default function Layout() {
  return (
    <>
      <Disclaimer />
      <Outlet />
      <div className="hidden">{import.meta.env.VITE_GIT_SHA}</div>
    </>
  );
}
