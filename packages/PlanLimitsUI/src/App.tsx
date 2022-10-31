import { Outlet } from "react-router-dom";

export default function App() {
  return (
    <>
      <div className="flex flex-1 items-stretch overflow-hidden">
        <Outlet />
      </div>
    </>
  );
}
