import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { PortalLayout } from "@/components/layout/portal-layout"
import { HomePage } from "@/pages/home"
import { ChatPage } from "@/pages/chat"
import { ContactPage } from "@/pages/contact"
import { PreviewPage } from "@/pages/preview"

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        {/* Layout-wrapped routes (sticky banner, container, etc. live here). */}
        <Route element={<PortalLayout />}>
          <Route index element={<HomePage />} />
          <Route path="work" element={<Navigate to="/" replace />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="contact" element={<ContactPage />} />
        </Route>

        {/* Full-bleed preview route — outside the portal layout container.
            Matches any unknown top-level path; PreviewPage falls back to
            <Navigate to="/" /> when the slug isn't registered. */}
        <Route path=":slug" element={<PreviewPage />} />

        {/* Catch-all (deeper paths). */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
