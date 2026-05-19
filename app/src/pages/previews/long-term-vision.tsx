import { useEffect } from "react"

// The Long-term Vision prototype is a standalone HTML sandbox living at
// `app/public/ltv-dev-portal.html` — a full duplicate of Short-term Vision
// to iterate on separately.
export function LongTermVisionPage() {
  useEffect(() => {
    const baseUrl = import.meta.env.BASE_URL
    window.location.replace(`${baseUrl}ltv-dev-portal.html`)
  }, [])

  return <></>
}
