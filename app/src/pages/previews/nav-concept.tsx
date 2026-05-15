import { useEffect } from "react"

// The Nav Concept prototype is a standalone HTML sandbox now living at
// `app/public/dev-portal.html`. When users hit /nav-concept, redirect
// straight to it instead of rendering the React placeholder we used
// while the sandbox was being designed.
export function NavConceptPage() {
  useEffect(() => {
    const baseUrl = import.meta.env.BASE_URL
    window.location.replace(`${baseUrl}dev-portal.html`)
  }, [])

  return <></>
}
