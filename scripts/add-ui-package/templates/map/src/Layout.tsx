import { Outlet } from 'react-router-dom'
// import Disclaimer from './components/Disclaimer/MapPage.tsx'

export default function Layout() {
  return (
    <>
      {/*<Disclaimer />*/}
      <Outlet />
    </>
  )
}
