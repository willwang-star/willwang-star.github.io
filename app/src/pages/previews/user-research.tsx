import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Callout } from "@/components/preview/callout"
import { LabeledList } from "@/components/preview/labeled-list"
import { PageHeader, Section } from "@/components/preview/section"
import { PreviewShell } from "@/components/preview/preview-shell"
import { Quote } from "@/components/preview/quote"
import { StatCard, StatGrid } from "@/components/preview/stat-card"

type Severity = "critical" | "warning" | "positive"

interface Finding {
  source: string
  date: string
  severity: Severity
  quote: string
  status: string
  synthesis: string
}

function FindingCard({ finding }: { finding: Finding }) {
  return (
    <Card>
      <CardContent className="space-y-3 p-5">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <Badge
            variant={
              finding.severity === "critical"
                ? "destructive"
                : finding.severity === "warning"
                  ? "secondary"
                  : "default"
            }
            className="rounded-full"
          >
            {finding.severity}
          </Badge>
          <span>{finding.source}</span>
          <span>·</span>
          <span>{finding.date}</span>
        </div>
        <Quote>{finding.quote}</Quote>
        <div className="space-y-1.5 text-sm">
          <p>
            <span className="font-medium">Status:</span>{" "}
            <span className="text-muted-foreground">{finding.status}</span>
          </p>
          <p className="text-muted-foreground leading-relaxed">
            {finding.synthesis}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export function UserResearchPage() {
  const findings: Finding[] = [
    {
      source: "Arun Avanathan, #devportal-support",
      date: "May 2024",
      severity: "critical",
      quote:
        "Is devportal search broken. Try this: 1. Search for 'etag' or 'resource caching' 2. Click on the first result — Autura documentation — 'Resource Caching - Governance and Standards' 3. Takes you to a 404 page. … Right, that is 404. But who will fix it?",
      status: "Partial fix — alternate link provided",
      synthesis:
        "Pattern: Search indexes a URL that becomes invalid. The result still appears in search, but navigating to it fails. No automated link-rot detection exists to catch these before users report them.",
    },
    {
      source: "Anunay Amar, #devportal-support",
      date: "Nov 2025",
      severity: "critical",
      quote:
        "Since last few weeks the devportal search for documentation is broken. Could you please have a look?",
      status: "Resolved — duplicate GitHub repo removed",
      synthesis:
        "Root cause: Two GitHub repos were linked to the documentation asset, causing a conflict in the search index. Fix: remove the repo without documentation. Key signal: 'last few weeks' — the breakage went undetected for an extended period before a user reported it.",
    },
    {
      source: "Vinay Bhat, #devportal-support",
      date: "Sep 2024",
      severity: "critical",
      quote:
        "We are not able to search specific topics on devportal autura documentation. This is causing problems for our customers. Can you please fix this? Example: When I try to search 'Retry letter topic & Dead letter topics' it shows no result although it exists...",
      status: "Bug filed PRTL-12452 · no resolution confirmed",
      synthesis:
        "Impact radius: 'problems for our customers' — this wasn't a single developer blocked; it was a team blocked from helping external partners. Search failures have a downstream customer impact.",
    },
    {
      source: "Akshay Kamal, #codeassist-support",
      date: "Sep 2025",
      severity: "critical",
      quote:
        "I'm having trouble accessing any documentation regarding Codegen CLI or the MCP service on DevPortal — I keep getting redirected to a 404. I'm attempting to troubleshoot installing an existing MCP, which continuously prompts me for my GitHub user/pass instead of using my valid GitHub SSH key/personal access token. However, I can't even begin troubleshooting as any and all documentation links in this channel are inaccessible.",
      status: "No resolution found",
      synthesis:
        "Double failure: Not only is search broken, but the support channel's own pinned links were also 404. This means the failure propagated from search → shared support resources → user completely blocked with no fallback.",
    },
    {
      source: "Malina Fong, #devportal-support",
      date: "Jul 2025",
      severity: "warning",
      quote:
        "How does the search work in devportal specifically around autura documentation? What dictates order of the results that shows up?",
      status: "Ticket SPS-22500 · no resolution confirmed",
      synthesis:
        "Ranking opacity: Even when search technically works, the ranking logic is opaque — exact-match queries don't surface the exact-match result first. Users lose trust in search and fall back to Slack/SME.",
    },
  ]

  return (
    <PreviewShell platform="Dev Portal" title="User Research">
      <div className="space-y-12">
        <PageHeader
          eyebrow="Research Overview · Internal Sources Only"
          title="What Intuit Developers Actually Say About DevPortal"
          subtitle="Synthesized from #devportal-support, public Slack channels, Google Drive research docs, and platform vision documents. Verbatim quotes wherever possible — no invented feedback."
        />

        <StatGrid cols={4}>
          <StatCard value="20+" label="distinct user voices from Slack" />
          <StatCard
            value="7"
            label="separate search/404 failure reports (2024–2026)"
          />
          <StatCard
            value="32–48"
            label="/100 satisfaction across all 5 personas"
          />
          <StatCard value="~200" label="devs used one-click access in week 1" />
        </StatGrid>

        <Card>
          <CardContent className="p-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Sources
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                "#devportal-support",
                "#codeassist-support",
                "#pdx-launched",
                "#gateway-support",
                "#3x-ai-native-builder-team",
                "#cmty-asterias + others",
                "Platform Vision Doc (Bhavana Gajjala)",
                "Unified DevPortal Project Plan",
                "Developer Personas (Muyi Tao)",
              ].map((s) => (
                <Badge
                  key={s}
                  variant="secondary"
                  className="rounded-full font-mono text-xs"
                >
                  {s}
                </Badge>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Timeframe: 2024–May 2026 · Method: Keyword + semantic Slack
              search, Drive full-text search, verbatim extraction.
            </p>
          </CardContent>
        </Card>

        <Section title="Overall signal: what the data says at a glance">
          <div className="grid gap-3">
            {[
              {
                tone: "critical" as const,
                title: "Search is the most-reported failure",
                body: "7 separate users, different channels, spanning 2 years — all reporting the same problem: search returns 404s, ranks irrelevant results, or stops working entirely for weeks at a time.",
              },
              {
                tone: "critical" as const,
                title: "Documentation rot is systemic",
                body: "Docs go stale, changes don't propagate to Autura, UI controls disappear without notice. Users read the docs and still get blocked.",
              },
              {
                tone: "warning" as const,
                title: "Onboarding is manual and opaque",
                body: "Users hit disabled buttons, wait on DMs to admins, and get sent to support channels for instructions that should be in the flow itself.",
              },
              {
                tone: "warning" as const,
                title: "AI agents can't use DevPortal",
                body: "As teams adopt Claude/Cursor, DevPortal becomes a ceiling — agents 'fail horribly' and the MCP is alpha-only with no docs support.",
              },
              {
                tone: "warning" as const,
                title: "The portal breaks during incidents",
                body: "Engineers reach for DevPortal exactly when stakes are highest — and find it erroring, credentials missing, or links broken.",
              },
              {
                tone: "positive" as const,
                title: "Self-serve features get real traction",
                body: "When DevPortal removes a manual step (GWS integration, one-click project access), adoption is fast and praise is genuine.",
              },
            ].map((sig) => (
              <Callout key={sig.title} tone={sig.tone} title={sig.title}>
                {sig.body}
              </Callout>
            ))}
          </div>
        </Section>

        <Section
          title="Search & Discovery"
          description="The single most-reported failure. Broken search, stale index links returning 404, confusing result ordering, and months of unfixed bugs. Directly impacts the #1 blocker developers cite: the 'broken first mile.'"
        >
          <Accordion type="multiple" className="rounded-lg border border-border">
            {findings.map((finding, i) => (
              <AccordionItem
                key={`${finding.source}-${i}`}
                value={`finding-${i}`}
                className="px-4"
              >
                <AccordionTrigger>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      variant={
                        finding.severity === "critical"
                          ? "destructive"
                          : finding.severity === "warning"
                            ? "secondary"
                            : "default"
                      }
                      className="rounded-full text-[10px]"
                    >
                      {finding.severity}
                    </Badge>
                    <span className="text-sm">{finding.source}</span>
                    <span className="text-xs text-muted-foreground">
                      · {finding.date}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <FindingCard finding={finding} />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Section>

        <Section
          title="Design implications"
          description="6 callout boxes linking research to Silver-phase actions."
        >
          <LabeledList
            cols={1}
            items={[
              {
                label: "1. Search is non-negotiable for Silver",
                description:
                  "It's the most-reported failure and the most-cited blocker in persona research (61%). A functional, trustworthy global search — not just present, but accurate and fast — is the single highest-leverage delivery.",
              },
              {
                label:
                  "2. Documentation needs a publish-confirmation loop",
                description:
                  "Users can't tell if their docs are live. Build a visible signal — a 'published' state, a timestamp, a diff view — so teams stop flooding #devportal-support with 'is this showing up?' tickets.",
              },
              {
                label: "3. Every disabled button needs a reason and a next step",
                description:
                  "'Disabled' with no tooltip is a dead end. The GWS and one-click access examples show what works: remove the human intermediary, and adoption follows instantly (~200 devs in a week).",
              },
              {
                label: "4. AI-readiness is a first-class Silver concern",
                description:
                  "The DevPortal MCP must graduate from alpha. Documentation needs to be MCP-accessible. The AI Newcomer persona (32/100 satisfaction) is the fastest-growing developer segment — and they're currently bouncing off the platform entirely.",
              },
              {
                label: "5. Incident-time reliability is a trust issue",
                description:
                  "If DevPortal fails when engineers need it most, they stop trusting it as a source of truth and route around it permanently. Silent state corruption (credentials missing, repos not attached) is the hardest pattern to recover trust from.",
              },
              {
                label: "6. The formula for positive feedback is consistent",
                description:
                  "Self-serve + paved road + immediate visible outcome + no human in the critical path = genuine adoption and praise. Replicate this pattern across the highest-friction onboarding flows in Silver.",
              },
            ]}
          />
        </Section>

        <Section title="Methodology & limitations">
          <Card>
            <CardContent className="p-5 text-sm leading-relaxed text-muted-foreground">
              <p>
                Sources searched: public Slack channels via keyword + semantic
                search, plus Google Drive full-text search for DevPortal
                feedback and research documents. Timeframe: 2024–May 2026.
              </p>
              <p className="mt-3">
                Limitations: Private DMs and private channels not included.
                Positive feedback is likely underrepresented — developers rarely
                post unprompted praise publicly. The #devportal-support channel
                is by definition a complaint surface; positive experiences are
                not routed there. Survey/NPS data for DevPortal specifically was
                not found in accessible sources. All quotes are verbatim from
                original Slack messages or documents.
              </p>
            </CardContent>
          </Card>
        </Section>
      </div>
    </PreviewShell>
  )
}

