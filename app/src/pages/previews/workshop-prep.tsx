import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Callout } from "@/components/preview/callout"
import { LabeledList } from "@/components/preview/labeled-list"
import { PageHeader, Section } from "@/components/preview/section"
import { PreviewShell } from "@/components/preview/preview-shell"
import { Quote } from "@/components/preview/quote"
import { StatCard, StatGrid } from "@/components/preview/stat-card"

export function WorkshopPrepPage() {
  return (
    <PreviewShell platform="Dev Portal" title="Workshop Prep">
      <div className="space-y-12">
        <PageHeader
          title="Vision, Research & the Path Forward"
          subtitle="A synthesis of two years of platform strategy, user research, and stakeholder alignment — prepared for the DevPortal workshop team."
        />

        <StatGrid cols={4}>
          <StatCard value="20+" label="developer voices" />
          <StatCard value="32–48" label="satisfaction out of 100" />
          <StatCard value="17" label="verticals to integrate" />
          <StatCard value="2-yr" label="committed horizon" />
        </StatGrid>

        <Tabs defaultValue="vision" className="space-y-8">
          <TabsList pin>
            <TabsTrigger value="vision">01 Vision</TabsTrigger>
            <TabsTrigger value="research">02 Research</TabsTrigger>
            <TabsTrigger value="stakeholders">03 Stakeholders</TabsTrigger>
            <TabsTrigger value="future">04 Future</TabsTrigger>
          </TabsList>

          <TabsContent value="vision" className="space-y-10">
            <Section title="Vision Arc — the journey so far">
              <div className="grid gap-3">
                {[
                  {
                    when: "2024 · Early",
                    title: "Unified Portal Concept",
                    body: "Fragmented tools (Scout, AIW, GED) surface a shared pain: no coherent home. Design sprint launches to define a unified Developer Portal.",
                  },
                  {
                    when: "2024 · Late",
                    title: "Bronze / Silver / Gold",
                    body: "PDX Design formalises phased unification. Bronze = shared nav & SSO. Silver = lift-and-shift AIW. Gold = native workbench integration. JTBD personas defined.",
                  },
                  {
                    when: "2025",
                    title:
                      "Platform Architecture + Experience Principles",
                    body: "Platform-as-a-platform doc defines horizontal kernel + vertical workbenches. Delivery Team becomes the ownership unit. March 2025 design research crystallises the core UX principles: 80/20 paved paths, intent-based tasks, proactive anticipation, and explicit guardrails.",
                  },
                  {
                    when: "2026 · Now",
                    title: "Agentic & Federated",
                    body: "Agentic Chat (multi-agent orchestration), MCP server in alpha, federated microfrontend shell (Context SDK), and 4 DDE production MCPs. Portal is reframing as ambient intelligence, not a destination.",
                  },
                ].map((step) => (
                  <Card key={step.when}>
                    <CardContent className="space-y-1.5 p-5">
                      <p className="text-xs font-medium text-muted-foreground">
                        {step.when}
                      </p>
                      <p className="text-base font-medium">{step.title}</p>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {step.body}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </Section>

            <Section title="What changed · stayed · shipped · still ahead">
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  {
                    title: "What Changed",
                    items: [
                      "Destination → Ambient intelligence",
                      "Workbench = lift-and-shift, not native",
                      "Search → Discovery + Intelligence",
                      "Portal governance → Plugin governance",
                    ],
                  },
                  {
                    title: "What Stayed",
                    items: [
                      "Single source of truth",
                      "Delivery Team as ownership unit",
                      "80/20 paved paths",
                      "JTBD persona framework",
                      "Federated, not monolithic",
                    ],
                  },
                  {
                    title: "What Shipped",
                    items: [
                      "Scout integration",
                      "DDE 4 production MCPs",
                      "CDC Capability Plugin",
                      "Agentic Chat alpha",
                      "Knowledge Graph (Neo4j)",
                    ],
                  },
                  {
                    title: "Still Ahead",
                    items: [
                      "16 of 17 verticals",
                      "GenUX / GenOS clarification",
                      "A2A (Agent-to-Agent) protocol",
                      "Persona-driven IA at Gold",
                      "Day 0 Plugin",
                    ],
                  },
                ].map((col) => (
                  <Card key={col.title}>
                    <CardContent className="space-y-2 p-5">
                      <p className="text-base font-medium">{col.title}</p>
                      <ul className="space-y-1.5 text-sm text-muted-foreground">
                        {col.items.map((it) => (
                          <li
                            key={it}
                            className="before:mr-2 before:text-foreground/50 before:content-['—']"
                          >
                            {it}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </Section>
          </TabsContent>

          <TabsContent value="research" className="space-y-10">
            <Section title="Research signal">
              <div className="grid gap-3">
                {[
                  {
                    cat: "Search & Discovery",
                    severity: "Critical · 7 reports",
                    tone: "critical" as const,
                    quote:
                      "I have to search five different places before I find what I need — search results are full of outdated docs.",
                    note:
                      "The Knowledge Graph + Glean layer is the direct architectural response. Not yet production-wide.",
                  },
                  {
                    cat: "Documentation Quality",
                    severity: "Critical · 6 reports",
                    tone: "critical" as const,
                    quote:
                      "Documentation is either missing or so out of date it's misleading. You end up asking colleagues instead.",
                    note:
                      "Autura / GitHub→Autura pipeline is the intended fix. Adoption and maintenance culture remains unsolved.",
                  },
                  {
                    cat: "Onboarding",
                    severity: "Critical · 6 reports",
                    tone: "critical" as const,
                    quote:
                      "Setting up my first GenAI agent required reading 8 different documents. There was no single start-here path.",
                    note:
                      "AI Newcomer JTBD satisfaction: 32/100 — lowest of all personas. Day 0 Plugin concept is the proposed answer.",
                  },
                  {
                    cat: "AI Tooling Friction",
                    severity: "High · 4 reports",
                    tone: "warning" as const,
                    quote:
                      "30% of support threads are auth/access errors. You're blocked for 1–7 days before you can even run code.",
                    note:
                      "Only 26% of GenAI use cases have done evaluations — a UX guidance gap, not a capability gap. Median 3 days to first working agent via GenUX.",
                  },
                  {
                    cat: "Reliability & Trust",
                    severity: "High · 5 reports",
                    tone: "warning" as const,
                    quote:
                      "When the portal goes down, I don't even know where to look. There's no status, no fallback.",
                    note:
                      "DDE MCPs have known silent auth failures. 100-result hard cap with no pagination. Trust gaps undermine adoption even when capability exists.",
                  },
                  {
                    cat: "Positive Signal",
                    severity: "Noted · 3 reports",
                    tone: "positive" as const,
                    quote:
                      "The DDE MCP cut my data discovery time from 45 minutes to under 5. That's the kind of thing that makes me actually use a tool.",
                    note:
                      "Speed improvements and proactive surfacing are praised when they work. The 45→4 min example is the strongest product proof point available.",
                  },
                ].map((s) => (
                  <Card key={s.cat}>
                    <CardContent className="space-y-3 p-5">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-base font-medium">{s.cat}</p>
                        <Badge
                          variant={
                            s.tone === "critical"
                              ? "destructive"
                              : s.tone === "warning"
                                ? "secondary"
                                : "default"
                          }
                          className="rounded-full text-xs"
                        >
                          {s.severity}
                        </Badge>
                      </div>
                      <Quote>{s.quote}</Quote>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {s.note}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </Section>

            <Section title="Unsolved challenges">
              <LabeledList
                cols={2}
                items={[
                  {
                    label: "Documentation Maintenance Culture",
                    description:
                      "Tooling (Autura pipeline) exists, but there's no incentive structure or ownership model ensuring teams keep docs fresh. Research shows stale docs are as damaging as missing ones.",
                  },
                  {
                    label: "Auth / Access Friction at Day 0",
                    description:
                      "30% of AIW support threads are auth errors; 1–7 day unblocking times. Silver-phase portal integration doesn't address access provisioning — it only moves the iframe.",
                  },
                  {
                    label: "Evaluation Culture for GenAI",
                    description:
                      "Only 26% of GenAI use cases have run evaluations. This is a UX guidance gap — developers don't know how or why to evaluate.",
                  },
                  {
                    label: "Cross-Vertical Navigation (JTBD → IA)",
                    description:
                      "Satisfaction is 32–48/100 across all personas. Persona-driven IA is a Gold-phase goal, but research shows the pain is Silver-phase urgent. There's a phasing mismatch.",
                  },
                  {
                    label: "Reliability & Silent Failures",
                    description:
                      "DDE MCPs have a 100-result hard cap with no pagination and silent auth failures. Production gaps in today's shipped tooling erode trust even as the vision accelerates forward.",
                  },
                  {
                    label: "Silver / Gold Reset",
                    description:
                      "Amit Soni flagged: 'The Silver/Gold breakdown needs a reset.' The FY26 targets ($4M observability savings, >80% CES) require a clearer path than current phase definitions provide.",
                  },
                ]}
              />
            </Section>

            <Section title="Design guardrails">
              <LabeledList
                cols={1}
                items={[
                  {
                    label: "Don't try to do everything",
                    description:
                      "DevPortal should not include every possible tool a developer might need. Feature sprawl creates navigation complexity and erodes the value of what's actually curated. Scope discipline is a product decision, not a gap.",
                  },
                  {
                    label: "Don't clone what external tools already do well",
                    description:
                      "It should not hide the tools it builds or replicate features already covered by GitHub, Jira, VS Code, or other external tools. Wrapping external tools in portal chrome adds a login step without adding value.",
                  },
                  {
                    label: "Don't create more context switching",
                    description:
                      "Avoid causing more tab-switching or platform-hopping. If a DevPortal feature requires a developer to leave their current workflow to use the portal, the integration model needs rethinking — not the developer's habits.",
                  },
                  {
                    label: "Don't create documentation for documentation's sake",
                    description:
                      "Documentation that nobody reads is worse than no documentation — it creates false confidence and clutters search results. Documentation must be discoverable, maintained, and tied to a real user task.",
                  },
                  {
                    label: "Don't force users into a single way of working",
                    description:
                      "The 80/20 rule applies: paved paths for the common case, flexibility for edge cases. The portal should guide without mandating — one workflow fits all is an anti-pattern for a platform serving 5 distinct JTBD personas.",
                  },
                ]}
              />
            </Section>
          </TabsContent>

          <TabsContent value="stakeholders" className="space-y-10">
            <div className="grid gap-6 md:grid-cols-2">
              <Section title="Well supported">
                <div className="grid gap-3">
                  {[
                    {
                      label: "Unified Portal as the Home Base",
                      description:
                        "Broad alignment that developer tools need a common home. Bronze/Silver/Gold phasing is accepted as the practical path, even if timelines are debated.",
                      voices:
                        "Praneet, Bhavana, April, PDX Design",
                    },
                    {
                      label: "Delivery Team as the Ownership Unit",
                      description:
                        "The DevPortal-as-a-Platform doc decision log shows no objection. Referenced consistently across architecture and research docs.",
                      voices: "Praneet, Hemant, Elnaz",
                    },
                    {
                      label: "Knowledge Graph as Intelligence Foundation",
                      description:
                        "Neo4j + Glean semantic layer is treated as assumed infrastructure across vision, agentic, and experience-layer documents. No contested signal.",
                      voices: "Praneet, Bhavana, Agentic Vision doc",
                    },
                    {
                      label: "Persona-Driven IA & Self-Serve",
                      description:
                        "All stakeholder groups cite the JTBD framework as valid. The 5-persona matrix and role-based surfaces are referenced without challenge.",
                      voices: "Will Wang, Jacque, Natasha, Muyi",
                    },
                    {
                      label: "Agentic Chat as Next Interaction Layer",
                      description:
                        "The multi-agent orchestration vision (Gateway + domain agents) has leadership buy-in. CJ's 2-year quote signals ambition alignment, not skepticism.",
                      voices:
                        "CJ (leadership), Agentic doc authors, Landon",
                    },
                  ].map((s) => (
                    <Card key={s.label}>
                      <CardContent className="space-y-2 p-5">
                        <p className="text-base font-medium">{s.label}</p>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {s.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Voices: {s.voices}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </Section>

              <Section title="Contested or unresolved">
                <div className="grid gap-3">
                  {[
                    {
                      label: "Silver / Gold Phase Definitions",
                      description:
                        "Amit Soni explicitly flagged the phase breakdown as needing a reset. Feb 2026 decision log shows workbench = lift-and-shift is a pragmatic retreat from the original Gold integration aspiration.",
                      voices: "Amit, Bhavana, PDX Design",
                    },
                    {
                      label: "AppFabric Plugin Governance",
                      description:
                        "Top-down (platform team owns the plugin API surface) vs. bottom-up (vertical teams contribute freely). No decision recorded.",
                      voices:
                        "Bhavana, Vertical teams, Platform team",
                    },
                    {
                      label: "DevPortal vs. GenOS — Agent Ownership",
                      description:
                        "Whether DevPortal builds its own GenUX or defers to GenOS is unresolved and architecturally significant.",
                      voices: "Agentic doc (open), Amit, CJ",
                    },
                    {
                      label: "Deprecation & Sunset Decisions",
                      description:
                        "Multiple Slack verbatims reference confusion about which old tools are going away and when. No published deprecation plan.",
                      voices: "Developers (Slack), Onboarding team",
                    },
                    {
                      label: "Jira & GitHub Ingest — Agent or Webhook?",
                      description:
                        "Whether context is pulled on-demand by agents or pre-ingested into the Knowledge Graph affects cost, latency, and freshness.",
                      voices: "Agentic doc (blank), Hemant, DDE team",
                    },
                  ].map((s) => (
                    <Card
                      key={s.label}
                      className="border-l-4 border-l-amber-500/70"
                    >
                      <CardContent className="space-y-2 p-5">
                        <p className="text-base font-medium">{s.label}</p>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {s.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Voices: {s.voices}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </Section>
            </div>
          </TabsContent>

          <TabsContent value="future" className="space-y-10">
            <Section title="Future state">
              <div className="grid gap-3">
                {[
                  {
                    label: "The Portal Becomes a Knowledge API",
                    description:
                      "DevPortal's web UI recedes. Its true product is a high-fidelity, always-current knowledge graph that any IDE plugin, CLI tool, or AI agent can query. Developers never navigate to it — their tools do.",
                    timeline: "1-yr",
                  },
                  {
                    label: "IDE as the Primary Interface",
                    description:
                      "The Day 0 Plugin becomes the canonical first experience. VS Code / Cursor sidebar surfaces onboarding flows, compliance checks (HCAP warnings), and discovery — without leaving the editor.",
                    timeline: "6-mo",
                  },
                  {
                    label: "Agents as First-Class Platform Citizens",
                    description:
                      "A2A (Agent-to-Agent) protocol enables DevPortal to dispatch specialized agents (SRE, M&A, onboarding) that coordinate without human handoffs. Developer intent → outcome.",
                    timeline: "1-yr",
                  },
                  {
                    label: "Intent-Based Task Flows",
                    description:
                      "Developers declare intent ('I want to build a GenAI agent') and the portal assembles the right sequence of steps, tools, and docs for that specific goal — rather than navigating a feature tree.",
                    timeline: "6-mo",
                  },
                  {
                    label: "Ambient Intelligence in the Developer Flow",
                    description:
                      "Instead of developers pulling information, the platform pushes relevant context proactively — PDLC stage warnings in the PR, compliance nudges in the pipeline, cost anomaly alerts in Slack.",
                    timeline: "1-yr",
                  },
                  {
                    label: "Self-Healing Documentation",
                    description:
                      "Agents monitor code merges and API changes, then auto-propose doc updates via Autura. Human review becomes the exception, not the rule. Stale docs become structurally impossible.",
                    timeline: "1-yr",
                  },
                  {
                    label: "Composable Workbench for Any Vertical",
                    description:
                      "Any vertical team publishes a plugin via AppFabric that composes into the portal shell with zero custom integration work. The portal becomes a runtime, not a destination.",
                    timeline: "1-yr+",
                  },
                  {
                    label: "Persona-Adaptive Surfaces",
                    description:
                      "When a developer does open DevPortal, the experience is fully role-aware: AI Newcomer sees onboarding paths and evaluation guides; SRE sees reliability dashboards; EM sees team health. One URL, five different products.",
                    timeline: "6-mo",
                  },
                ].map((f) => (
                  <Card key={f.label}>
                    <CardContent className="space-y-2 p-5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-base font-medium">{f.label}</p>
                        <Badge variant="outline" className="text-xs">
                          {f.timeline}
                        </Badge>
                      </div>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {f.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </Section>

            <Callout title="The core design tension" tone="warning">
              The portal needs to be excellent enough that developers choose to
              use it — while also being invisible enough that developers don't
              need to. These aren't contradictory: the portal is the
              orchestration brain; the IDE and CLI are the hands.
            </Callout>

            <Callout title="The design question for this workshop">
              If most tasks move to IDE and CLI in 12 months, which portal
              surfaces justify investment? What is irreducibly valuable about
              the web UI — and what should we consciously let go of?
            </Callout>
          </TabsContent>
        </Tabs>
      </div>
    </PreviewShell>
  )
}
