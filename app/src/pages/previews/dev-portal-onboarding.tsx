import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Callout } from "@/components/preview/callout"
import { LabeledList } from "@/components/preview/labeled-list"
import { Category, PageHeader, Section } from "@/components/preview/section"
import { PreviewShell } from "@/components/preview/preview-shell"
import { Quote } from "@/components/preview/quote"

export function DevPortalOnboardingPage() {
  return (
    <PreviewShell platform="Dev Portal" title="Onboarding">
      <div className="space-y-12">
        <PageHeader
          eyebrow="Dev Portal — Onboarding"
          title="The Core Problem: Tool Sprawl & Fragmentation"
          subtitle="Builders must hop across 10+ scattered, unfamiliar tools to complete a single PDLC task. This is the central problem the Unified Development Portal is solving."
        />

        <Category title="The Problem">
          <Section title="The fragmented ecosystem today">
            <p className="text-sm text-muted-foreground">
              Each is a separate tool, separate URL, separate mental model —
              all siloed.
            </p>
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-wrap gap-2">
                  {[
                    "DevPortal",
                    "AI Workbench (GenStudio)",
                    "Data Discovery (DDE)",
                    "IXP (Experiments)",
                    "Autura",
                    "IDX Studio",
                    "Databricks",
                    "Starburst",
                    "Splunk",
                    "Wavefront",
                    "ADAPT Sandbox",
                    "DACM",
                    "ADU Portal",
                    "ServiceNow",
                    "Data Map Studio",
                    "Jenkins / Argo",
                    "JIRA",
                    "PagerDuty",
                    "Postman / Dash",
                    "+ many more…",
                  ].map((tool) => (
                    <Badge
                      key={tool}
                      variant="secondary"
                      className="rounded-full"
                    >
                      {tool}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Section>

          <Section title="Key stats">
            <div className="grid gap-3 sm:grid-cols-3">
              <Callout tone="critical" title="8+ documents">
                AI Agent onboarding alone requires 8+ separate documents.
              </Callout>
              <Callout tone="warning" title="60–70%">
                Testing consumes 60–70% of developer time.
              </Callout>
              <Callout tone="warning" title="1.5 hrs">
                P1 incident triage averages 1.5 hrs per investigation.
              </Callout>
            </div>
          </Section>

          <Section title="What builders actually say">
            <div className="grid gap-3">
              <Quote attribution="Contributors / Platform Owners">
                I want to utilize DevPortal to serve my users but I do not
                know how. I want to showcase my platform's new features but
                don't know where.
              </Quote>
              <Quote attribution="Creators & Consumers">
                I want to leverage DevPortal for day-to-day dev but can't
                find things. I want to know what my platform provides but
                don't know how to access it.
              </Quote>
              <Quote attribution="All Builders">
                The paved roads have to evolve. They are no longer paved.
              </Quote>
            </div>
          </Section>

          <Section title="GED customer validation">
            <Callout tone="positive">
              From 6 developers tested:{" "}
              <em className="text-foreground">
                "I like having a consolidated single place where you can build
                it how you want."
              </em>
            </Callout>
          </Section>
        </Category>

        <Category title="FROM → TO">
          <Section
            title="Strategic transformation"
            description="Mapping today's pain to the target state."
          >
            <Card>
              <CardContent className="p-0">
                <div className="grid grid-cols-1 divide-y divide-border md:grid-cols-2 md:divide-y-0 md:divide-x">
                  <div className="space-y-3 p-6">
                    <h4
                      data-toc-skip
                      className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                    >
                      Current state
                    </h4>
                    <ul className="space-y-3 text-sm text-muted-foreground">
                      {[
                        "Disconnected end-to-end workflows",
                        "Tool sprawl",
                        "Lack of self-serve capability maturity",
                        "Serving only a handful of personas",
                        "Lack of governance",
                        "No visibility across work",
                        "No product/business insights for builders",
                        "Restricted IA not meeting personas",
                        "Fragmented access management per portal",
                        "Duplicate investment in shared concerns",
                      ].map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-3 p-6">
                    <h4
                      data-toc-skip
                      className="text-xs font-semibold uppercase tracking-wider text-foreground"
                    >
                      Target state
                    </h4>
                    <ul className="space-y-3 text-sm">
                      {[
                        "Single connected hub for end-to-end development",
                        "Connected, integrated workflows within one platform",
                        "Mature self-serve capabilities",
                        "Persona-agnostic — serves ALL builders in PDLC",
                        "Central governance across all tools",
                        "Full visibility to all builders on customer impact",
                        "Insights available to product & business",
                        "Persona-based IA with flexible + common elements",
                        "Unified access management",
                        "Single shared infrastructure",
                      ].map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Section>
        </Category>

        <Category
          title="5 Consequences of Fragmentation"
          description="Downstream impact from the Platform Vision doc — Rishav Mittal. Each maps to a design principle you'll be solving for."
        >
          <Section title="Inconsistent UX">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Different design patterns, auth flows, and IA across each
              portal. IDS tokens not universally adopted — compounding
              cognitive load with every cross-tool workflow.
            </p>
          </Section>
          <Section title="Duplication of effort">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Search, login, auditing, and notifications are independently
              rebuilt in each portal. Maintenance overhead compounds at scale
              as each vertical evolves separately.
            </p>
          </Section>
          <Section title="Hindrance to cross-domain innovation">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Combining AI Workbench + DDE + IXP in a single workflow has no
              native integration path. Everything is bespoke, slowing the
              pace and scope of innovation.
            </p>
          </Section>
          <Section title="Inefficient discovery">
            <p className="text-sm leading-relaxed text-muted-foreground">
              No unified search spanning all portals. Developers hunt for
              APIs, datasets, and tooling across separate systems — "The
              Treasure Hunt" is step #1 in almost every persona journey.
            </p>
          </Section>
          <Section title="No single pane of glass">
            <p className="text-sm leading-relaxed text-muted-foreground">
              No consolidated view of projects, metrics, or compliance.
              Developers toggle between 10+ interfaces for a complete picture.
              Accountability is fragmented — no single ownership view.
            </p>
          </Section>
        </Category>

        <Category
          title="8 Core Systemic Problems"
          description="Fresh-eyes checklist — each is a load-bearing symptom of the broader fragmentation."
        >
          <Section>
            <LabeledList
              cols={2}
              items={[
                {
                  label: "Context Switching Tax",
                  description:
                    "Moving DevPortal → AIW → DDE → IXP → Databricks for a single workflow. Each tool has its own mental model. Average workflow spans 3–5 tools.",
                },
                {
                  label: "Discovery Friction",
                  description:
                    'Docs scattered across Confluence, Slack, Autura, DevPortal. "The Treasure Hunt" is step #1 in almost every JTBD workflow across all personas.',
                },
                {
                  label: "Access & Approval Latency",
                  description:
                    "FY23 SLA: 5-day wait for data access. Manual credential/permission flows via DACM stall momentum for every new project.",
                },
                {
                  label: "Fragmented Access Management",
                  description:
                    "Each portal manages its own permissions independently. No unified layer for granting, auditing, or revoking access — creating compliance risk and operational overhead.",
                },
                {
                  label: "UX Inconsistency",
                  description:
                    "Same pages (homepage, search, create) built differently across tools. IDS tokens not adopted everywhere. 10+ component unification opportunities found in audit.",
                },
                {
                  label: "No Unified Monitoring",
                  description:
                    '10+ dashboards to answer "Are we compliant?" Splunk, Wavefront, Data Pulse, ServiceNow all siloed. 1.5 hrs avg per P1 investigation.',
                },
                {
                  label: "No Customer Impact Visibility",
                  description:
                    'Builders can\'t trace a microservice → customer-facing feature → business outcome. "Show the why behind the what" is aspirational, not yet real.',
                },
                {
                  label: "Duplicate Effort on Shared Concerns",
                  description:
                    "Each portal independently builds search, login, auditing, and notifications. A unified platform should solve these once and share across all tools.",
                },
              ]}
            />
          </Section>
        </Category>

        <Category
          title="Personas"
          description="JTBD-based personas. The original framework focused on individual contributors. Three additional personas — Product Manager, Engineering Manager, and Technical Leader — are now included."
        >
          <Section title="Primary personas">
            <div className="grid gap-3">
              {[
                {
                  name: "The Service Builder",
                  desc: "SWE integrating a new capability",
                  score: 48,
                },
                {
                  name: "The Data Pipeline Builder",
                  desc: "Data Engineer building & scaling pipelines",
                  score: 42,
                },
                {
                  name: "The AI Specialist",
                  desc: "Data Scientist / ML Engineer experimenting with models",
                  score: 38,
                },
                {
                  name: "The AI Newcomer",
                  desc: "SWE transitioning to building AI features",
                  score: 32,
                  note: "lowest",
                },
                {
                  name: "The Integration Engineer",
                  desc: "Integrating new financial data providers",
                  score: 35,
                },
              ].map((p) => (
                <Card key={p.name}>
                  <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
                    <div className="space-y-1">
                      <CardTitle className="text-base font-medium">
                        {p.name}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {p.desc}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge variant="secondary" className="font-mono">
                        {p.score}/100
                      </Badge>
                      {p.note && (
                        <span className="text-xs text-muted-foreground">
                          {p.note}
                        </span>
                      )}
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </Section>

          <Section title="Cross-domain archetypes & additional personas">
            <LabeledList
              cols={2}
              items={[
                {
                  label: "The Producer",
                  description:
                    "Building & publishing reusable assets / AI agents.",
                },
                {
                  label: "The Maintainer",
                  description: "On-call SRE resolving P1 incidents fast.",
                },
                {
                  label: "The Analyst",
                  description:
                    "Exploring complex metrics via conversational AI.",
                },
                {
                  label: "The Steward",
                  description: "Auditing data maturity & compliance.",
                },
                {
                  label: "Product Manager",
                  description:
                    "Steering product direction & customer outcomes.",
                },
                {
                  label: "Eng. Manager",
                  description:
                    "Managing team health, delivery & quality.",
                },
                {
                  label: "Technical Leader",
                  description:
                    "Senior leadership role in technical strategy.",
                },
              ]}
            />
          </Section>
        </Category>
      </div>
    </PreviewShell>
  )
}
