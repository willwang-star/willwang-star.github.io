import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Callout } from "@/components/preview/callout"
import { LabeledList } from "@/components/preview/labeled-list"
import { PageHeader, Section } from "@/components/preview/section"
import { PreviewShell } from "@/components/preview/preview-shell"
import { Quote } from "@/components/preview/quote"
import { StatCard, StatGrid } from "@/components/preview/stat-card"

const stages = [
  "Architect",
  "Code",
  "Build",
  "Test",
  "Release & Deploy",
  "Monitor",
  "Operate",
] as const

type Stage = (typeof stages)[number]
type Row = { label: string; cells: Partial<Record<Stage, string[]>> }

const matrix: Row[] = [
  {
    label: "DevPortal",
    cells: {
      Architect: [
        "Documentation / Autura",
        "API Explorer",
        "Tech Maturity",
        "Lifecycle",
        "API Stewardship guidelines",
        "Security and compliance",
        "Intuit Assist",
      ],
      Code: ["Paved roads (Create)", "Projects / assets"],
      Build: ["Tools (community hub)"],
      Monitor: ["Metrics and insights"],
      Operate: ["Observability", "Operations", "Metrics and insights"],
    },
  },
  {
    label: "DevX / PAG / PDX",
    cells: {
      Architect: [
        "City Map",
        "Intuit API client",
        "Data bricks / data map",
        "Operational Data Lake (ODL)",
      ],
      Code: [
        "AI Workbench",
        "GenStudio",
        "API Gateway",
        "Configuration management",
      ],
      Build: [
        "Intuit Kubernetes Services (IKS)",
        "IKS AIR",
        "Modern SaaS",
        "App Insights",
        "Cloud accounts",
        "Cloud workspaces",
        "Data bricks / data map",
      ],
      Test: ["Argo (CD tools)", "Argo CD (CD tools)"],
      Monitor: [
        "Golden signals",
        "Alert2Incident",
        "Data bricks / data map",
      ],
      Operate: ["Dev 360"],
    },
  },
  {
    label: "Outside DevX, Intuit-owned",
    cells: {
      Architect: ["Insight", "Degreed"],
      Code: [
        "AI Sandbox",
        "Intuit API client (Postman)",
        "Intuit Data Protection Service (IDPS)",
      ],
      Build: [
        "Ecosystem Wide Orchestrator Kit (EWOK)",
        "Intuit Build Platform (IBP)",
        "quickETL",
        "ADAPT",
        "Gatling",
        "Automated Compliance Platform (ACP)",
      ],
      Monitor: [
        "Essential Notice Dashboard of Readiness (ENDOR)",
        "Intuit Build Platform (IBP)",
      ],
      Operate: ["One Intuit Portal"],
    },
  },
  {
    label: "3rd party",
    cells: {
      Architect: [
        "Stack Overflow",
        "Slack",
        "GitHub",
        "Wiki / Confluence",
        "Google Workspace",
        "Zoom / email",
        "Jira",
        "ETL / data integration tools",
        "AWS",
        "Lucidchart",
        "Storybook",
        "Drawing tools / Mermaid",
        "Splunk",
      ],
      Code: ["GitHub", "Cursor"],
      Build: [
        "IDEs (IntelliJ, VS Code)",
        "Code gen tools (Qodo)",
        "GitHub",
        "Kubernetes",
        "AWS",
        "Other cloud servers",
        "Postman",
        "Kiki",
        "JFrog Artifactory",
        "Lucid Charts",
        "Jira",
      ],
      Test: ["GitHub", "Jenkins (CI tools)", "GitHub Actions (CI tools)"],
      Monitor: [
        "Splunk",
        "Wavefront",
        "Service Now",
        "PagerDuty",
        "Slack",
        "Amplitude",
        "BPP",
        "EMR logs",
        "Wiki",
        "DQM",
      ],
      Operate: [
        "Jira",
        "Google Workspace",
        "LeanIX",
        "Airtable",
        "GitHub",
        "Slack",
        "Dynatrace",
      ],
    },
  },
]

export function PdlcToolsResearchPage() {
  return (
    <PreviewShell platform="Dev Portal" title="Prior Research">
      <div className="space-y-12">
        <PageHeader
          title="Prior Research: Mapping the developer environment"
          subtitle="What developers actually use across the Product Development Lifecycle — DevPortal, DevX/PAG/PDX paved roads, Intuit-internal tools, and 3rd-party services. Synthesized from the Horizons UX Developer Tools board and the FY25 AI-Native Modern Dev Environment strategy."
        />

        <StatGrid cols={4}>
          <StatCard value="7" label="PDLC stages mapped end-to-end" />
          <StatCard value="5" label="Tool ownership tiers" />
          <StatCard value="60+" label="Distinct tools and services" />
          <StatCard value="FY25" label="Strategy horizon" />
        </StatGrid>

        <Callout tone="warning" title="Read this as foundation, not gospel">
          The source artifacts are from July 2024. Per April Jernberg
          (Horizons UX, May 6, 2026):{" "}
          <em className="text-foreground">
            "We have a lot of work on future DP states — that said, it could
            all be different given the current state of AI tools. These are
            months old. But there has been work on dev environment workflows,
            etc. … The blueprint work is on the research page. These are old,
            but the foundational parts are still there."
          </em>
          <br />
          <br />
          <strong className="text-foreground">
            What's still trustworthy:
          </strong>{" "}
          the framing — PDLC stages, ownership tiers, inner/outer-loop
          concept, "tooling isn't the problem" thesis, and DevAssist as the
          AI-native bridge.{" "}
          <strong className="text-foreground">What may have shifted:</strong>{" "}
          specific tool names, vendors, and what each platform owns today.
          Validate against current DevX inventory before treating any cell as
          authoritative.
        </Callout>

        <Section title="Strategic frame" eyebrow="FY25 horizon">
          <p className="text-sm leading-relaxed text-muted-foreground">
            The DevX/Horizons FY25 strategy reframes the developer environment
            as one continuous AI-native surface. DevAssist (DP info in the IDE)
            is the first concrete step. The research below maps the existing
            surface this strategy has to absorb — every tool a developer
            touches across the lifecycle.
          </p>
          <Quote attribution="Horizons UX research synthesis · Developer Tools board">
            Tooling isn't the problem — it's the lack of connection between
            them.
          </Quote>
        </Section>

        <Section
          title="Mapping framework: dev environment tools across the PDLC"
          description="Two axes: lifecycle stage horizontally, ownership tier vertically. Each cell is the tooling a developer reaches for in that stage, grouped by who owns it."
        >
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px] sticky left-0 bg-background">
                      Owner
                    </TableHead>
                    {stages.map((s) => (
                      <TableHead key={s} className="min-w-[140px] text-xs">
                        {s}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {matrix.map((row) => (
                    <TableRow key={row.label}>
                      <TableCell className="sticky left-0 bg-background font-medium">
                        {row.label}
                      </TableCell>
                      {stages.map((s) => (
                        <TableCell key={s} className="text-xs">
                          {row.cells[s] ? (
                            <ul className="space-y-1 text-muted-foreground">
                              {row.cells[s]!.map((tool) => (
                                <li key={tool}>{tool}</li>
                              ))}
                            </ul>
                          ) : (
                            <span className="text-muted-foreground/50">—</span>
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <p className="text-xs text-muted-foreground">
            Loop legend: Pre-production covers Architect → Build & Test (the
            inner loop, what a single developer iterates on locally).
            Post-production covers Release/Deploy → Monitor → Operate (the
            outer loop, post-merge).
          </p>
        </Section>

        <Section title="What makes DevPortal unique">
          <Card>
            <CardContent className="p-5 text-sm leading-relaxed text-muted-foreground">
              <p>
                <strong className="text-foreground">Architect:</strong>{" "}
                Resource ownership names / contact info, Up-to-date current
                information, Adheres to guidelines, Easy user consumability.
              </p>
              <p className="mt-3">
                <strong className="text-foreground">Code:</strong> Known place
                to track requirements, Connecting to a service.
              </p>
              <p className="mt-3">
                Differentiators concentrate in Architect (discover) and Code
                (setup) — the upstream "front door" of the lifecycle.
              </p>
            </CardContent>
          </Card>
        </Section>

        <Section title="Headline insights">
          <LabeledList
            cols={2}
            items={[
              {
                label: "01 · Tools aren't missing — connections are",
                description:
                  "Across 7 stages and 5 ownership tiers, developers already have 60+ tools available. The friction is context-switching and discovery between them, not lack of capability. This is the central thesis behind DevAssist.",
              },
              {
                label: "02 · DevPortal owns the front door",
                description:
                  "DevPortal's differentiated value concentrates in Architect (discover, docs, API explorer) and Code (paved roads). It's how a developer starts a task — and the key place AI can intercept and accelerate.",
              },
              {
                label: "03 · Inner-to-outer loop is the danger zone",
                description:
                  "The transition from Build/Test → Release is where individual code becomes team-shared. Tooling here is dense and duplicated (Jenkins, GitHub Actions, Argo, Argo CD all overlap). It's the highest-value seam to simplify.",
              },
              {
                label: "04 · Operate sprawls across vendors",
                description:
                  "Monitor & Operate stages pull in the most heterogeneous vendor tools (Splunk, PagerDuty, Service Now, Wavefront, Dynatrace, Amplitude, Airtable, LeanIX). Consolidating signal here is a downstream win.",
              },
              {
                label: "05 · 3rd-party tools dominate Architect",
                description:
                  "Stack Overflow, Slack, GitHub, Confluence, Google, Zoom, Jira, Lucidchart — discovery happens largely outside Intuit's surface. DP can win only by being the most up-to-date, contact-aware, and consumable place to start.",
              },
              {
                label: "06 · DevAssist = DP info in the IDE",
                description:
                  "The FY25 strategy bet: instead of pulling developers to a portal, push the portal's authoritative info (ownership, lifecycle, guidelines, paved roads) into the IDE where Code happens. It's the AI-native bridge.",
              },
            ]}
          />
        </Section>

        <Section
          title="Adjacent artifacts"
          description="Other research outputs from the Horizons UX board."
        >
          <LabeledList
            cols={2}
            items={[
              {
                label: "PDX Developer Blueprint",
                description:
                  "Service-blueprint-style table mapping the PDX developer journey across lifecycle stages — actions, channels, supporting systems, pain points.",
              },
              {
                label: "DevPortal FE/BE Developer Blueprint",
                description:
                  "Companion blueprint focused specifically on DevPortal's frontend and backend engineers — what they touch, what's broken, where dependencies lie.",
              },
              {
                label: "System & Product Development diagram",
                description:
                  "Conceptual visualization showing how systems and products develop — concentric loops with team and individual scope.",
              },
              {
                label: "Onboarding tool stack",
                description:
                  "What new developers reach for in their first weeks: Documentation, Onboarding deck, Slack, Onboarding buddy, Dev Portal, Trainings, Dev @ Intuit, Google.",
              },
            ]}
          />
        </Section>

        <Section title="How to use this">
          <LabeledList
            cols={3}
            items={[
              {
                label: "Designers",
                description:
                  "Use the matrix to scope where a journey actually starts and ends. If the work touches Architect or Code stages, DevPortal is in the critical path.",
              },
              {
                label: "PMs",
                description:
                  "Use the ownership tiers to know who you need to align with. Anything that crosses into DevX or 3rd-party rows is a coordination effort, not a unilateral one.",
              },
              {
                label: "Engineers",
                description:
                  "Use the 'What makes DP unique' note as the working spec for what DP must guarantee in Architect/Code stages: ownership, freshness, conformance, consumability.",
              },
            ]}
          />
        </Section>

        <Card>
          <CardContent className="space-y-3 p-5 text-sm leading-relaxed text-muted-foreground">
            <p>
              <strong className="text-foreground">Provenance.</strong> April
              Jernberg shared the source links via Slack on May 6, 2026 (group
              DM with Natasha Girotra, Muyi Tao, Jacque Roby, Elnaz Amiri, and
              Will Wang). The original Service Blueprint Figma file is missing;
              this page reconstructs the framework from the screenshots and
              the strategy deck cover. The foundational structure remains
              relevant; specific tools may have shifted since July 2024.
            </p>
            <p>
              <strong className="text-foreground">Next steps.</strong> (1)
              Validate tool list with current DevX inventory. (2) Layer in
              DevAssist's actual coverage map. (3) Add quantitative usage data
              from Intuit Assist / DevPortal analytics where available.
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {[
                "Pre-production",
                "Post-production",
                "Inner loop",
                "Outer loop",
              ].map((tag) => (
                <Badge key={tag} variant="outline" className="rounded-full">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PreviewShell>
  )
}
