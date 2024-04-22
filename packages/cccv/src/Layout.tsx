import { Outlet } from 'react-router-dom'
import ErrorContext from "@components/ErrorContext/ErrorContext.ts";
import { useContext } from 'react';

export default function Layout() {
  const error = useContext(ErrorContext)?.error;
  console.log('error', error)
  return (
    <>
      {error ? <div id="error-message" className="bg-red-600 w-full text-center">{error.message}</div> : null}
      {/*<Disclaimer />*/}
      <Outlet />
    </>
  )
}