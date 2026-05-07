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
        {/* Full-bleed preview route — outside the portal layout container. */}
        <Route path="preview/:slug" element={<PreviewPage />} />

        <Route element={<PortalLayout />}>
          <Route index element={<HomePage />} />
          <Route path="work" element={<Navigate to="/" replace />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
