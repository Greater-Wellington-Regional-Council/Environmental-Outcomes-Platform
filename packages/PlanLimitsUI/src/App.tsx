import { Outlet } from 'react-router-dom';

export default function App() {
  return (
    <>
      <div className="flex flex-1 items-stretch overflow-hidden">
        <Outlet />
      </div>
      <div className="hidden">{import.meta.env.VITE_GIT_SHA}</div>
    </>
  );
}
