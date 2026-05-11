import { Outlet } from "react-router-dom"

export function PortalLayout() {
  return (
    <div className="dark min-h-svh bg-background text-foreground">
      <main className="mx-auto w-full max-w-[1200px] px-4 py-10 sm:px-6 sm:py-14">
        <Outlet />
      </main>
    </div>
  )
}
