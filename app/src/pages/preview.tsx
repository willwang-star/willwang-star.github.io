import { Navigate, useParams } from "react-router-dom"
import { findPreviewBySlug } from "@/lib/previews"
import { AiwOnboardingPage } from "@/pages/previews/aiw-onboarding"
import { DdeOnboardingPage } from "@/pages/previews/dde-onboarding"
import { DevPortalOnboardingPage } from "@/pages/previews/dev-portal-onboarding"
import { UserResearchPage } from "@/pages/previews/user-research"
import { WorkshopPrepPage } from "@/pages/previews/workshop-prep"
import { PdlcToolsResearchPage } from "@/pages/previews/pdlc-tools-research"

const previewComponents: Record<string, () => React.JSX.Element> = {
  "ai-workbench-onboarding": AiwOnboardingPage,
  "data-discovery-onboarding": DdeOnboardingPage,
  "dev-portal-onboarding": DevPortalOnboardingPage,
  "user-research": UserResearchPage,
  "workshop-prep": WorkshopPrepPage,
  "prior-research": PdlcToolsResearchPage,
}

export function PreviewPage() {
  const { slug } = useParams<{ slug: string }>()
  const preview = slug ? findPreviewBySlug(slug) : undefined

  if (!preview || !slug) {
    return <Navigate to="/" replace />
  }

  const Component = previewComponents[slug]
  if (!Component) {
    return <Navigate to="/" replace />
  }

  return <Component />
}
