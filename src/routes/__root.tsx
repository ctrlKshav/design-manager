import * as React from 'react'
import { Link, Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import Navbar from '@/components/Navbar'
// import Navbar from '@/components/navbar'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {``
  return (
    <>
      {/* <Navbar /> */}
      <Outlet />
      {process.env.NODE_ENV === "development" && (
        <TanStackRouterDevtools position="bottom-right" />
      )}
    </>
  )
}
