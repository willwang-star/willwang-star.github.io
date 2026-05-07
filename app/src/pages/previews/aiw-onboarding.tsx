import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Callout } from "@/components/preview/callout"
import { LabeledList } from "@/components/preview/labeled-list"
import { PageHeader, Section } from "@/components/preview/section"
import { PreviewShell } from "@/components/preview/preview-shell"
import { Quote } from "@/components/preview/quote"
import { StatCard, StatGrid } from "@/components/preview/stat-card"

export function AiwOnboardingPage() {
  return (
    <PreviewShell platform="AI Workbench" title="Onboarding">
      <div className="space-y-12">
        <PageHeader
          eyebrow="AI Workbench (AIW) — Onboarding"
          title="Intuit's internal developer platform for AI and ML"
          subtitle="Lives inside Dev Portal. Your entry point for building, testing, and shipping AI agents at Intuit. This brief covers everything — from current state to where the platform is heading and who's driving it."
        />

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="flex flex-wrap h-auto p-1">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="workflow">Agent Workflow</TabsTrigger>
            <TabsTrigger value="vision">Design Vision</TabsTrigger>
            <TabsTrigger value="research">User Research</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-10">
            <Section title="What is AI Workbench?">
              <LabeledList
                items={[
                  {
                    label: "GenAI / Agent Development",
                    description:
                      "The primary development surface for building LLM-powered agents. Model Discovery, Skills Registry, Prompt Registry, and Langfuse eval integration all live here. Evolving toward local-IDE-first workflows.",
                  },
                  {
                    label: "MDLC — Classical ML",
                    description:
                      "Machine Learning Development Life Cycle tooling. Experiments, AutoML, Endpoints, Batch Inference, Model Registry, and Pipelines. Currently project-scoped; migrating to asset-scoped routing.",
                  },
                  {
                    label: "Model Discovery",
                    description:
                      "Live leaderboard for LLM comparison and selection. Browse available models, compare performance, and understand which LXS models are available for your use case. Currently sparsely populated but the foundational piece.",
                  },
                ]}
                cols={3}
              />
            </Section>

            <Section title="Where AIW fits in the Intuit stack">
              <Card>
                <CardContent className="p-6">
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-baseline gap-3">
                      <Badge variant="outline" className="rounded-full">
                        DevPortal
                      </Badge>
                      <span className="text-muted-foreground">
                        Service registry, team, asset management
                      </span>
                    </li>
                    <li className="flex items-baseline gap-3">
                      <Badge variant="outline" className="rounded-full">
                        AI Workbench
                      </Badge>
                      <span className="text-muted-foreground">
                        AI/ML development workspace
                      </span>
                    </li>
                    <li className="flex items-baseline gap-3">
                      <Badge variant="outline" className="rounded-full">
                        GenOS
                      </Badge>
                      <span className="text-muted-foreground">
                        GenAI platform (underlying service)
                      </span>
                    </li>
                    <li className="flex items-baseline gap-3">
                      <Badge variant="outline" className="rounded-full">
                        LXS
                      </Badge>
                      <span className="text-muted-foreground">
                        LLM Execution Service
                      </span>
                    </li>
                    <li className="flex items-baseline gap-3">
                      <Badge variant="outline" className="rounded-full">
                        Langfuse
                      </Badge>
                      <span className="text-muted-foreground">
                        Tracing & eval
                      </span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </Section>

            <Section title="What AIW directly manages">
              <Card>
                <CardContent className="p-6">
                  <ul className="grid gap-2 text-sm sm:grid-cols-2">
                    {[
                      "Model Discovery leaderboard",
                      "GenAI use case onboarding + LXS config",
                      "Skills Registry (reusable agent skills)",
                      "Prompt Registry (versioned prompts)",
                      "MDLC project workflow (experiments, AutoML, etc.)",
                      "Langfuse integration for tracing",
                      "AI Hub (in design — replaces scattered Confluence docs)",
                    ].map((item) => (
                      <li
                        key={item}
                        className="text-muted-foreground before:mr-2 before:text-foreground/50 before:content-['—']"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </Section>

            <Section title="Strategic context: why AIW needs an overhaul">
              <Quote attribution="CJ, Jan 2026">
                This needs a lot more serious commitment and co-ordination. We
                need to do a lot more user research. All PMs need a common
                developer experience mindset. This will be at least a 2-year
                plan.
              </Quote>

              <h3 className="text-lg font-medium">5 strategic priorities</h3>
              <LabeledList
                cols={2}
                items={[
                  {
                    label: "Agent Development",
                    description:
                      "Move toward local IDE with platform hooks. Improve velocity with coding assistants.",
                  },
                  {
                    label: "Data / Context Ingestion",
                    description:
                      "Centralize RAG, labels, eval datasets, CDC attributes, agent memory.",
                  },
                  {
                    label: "Discovery",
                    description:
                      "Tool & agent catalogs with well-defined, highly functional entries.",
                  },
                  {
                    label: "Agent Optimization",
                    description:
                      "Help users optimize prompts, run faster tests, switch models quickly.",
                  },
                  {
                    label: "Eval & Monitoring",
                    description:
                      "Continuous evals, drift detection, alerts. Use logs/traces as enriched metadata.",
                  },
                ]}
              />

              <Callout title="Two open questions from CJ">
                <ol className="list-decimal space-y-1 pl-5">
                  <li>
                    Is this the right strategic direction for PDX in terms of
                    build vs. buy?
                  </li>
                  <li>
                    This is at least a 2-year plan — are we staffed to build
                    this outside of current commitments?
                  </li>
                </ol>
              </Callout>
            </Section>
          </TabsContent>

          <TabsContent value="workflow" className="space-y-10">
            <Section
              title="The 8-document problem"
              description="A developer building their first agent must navigate 8+ documents just to set up local environment, then 2 more pages for their first LLM call, then 2 more for tracing & eval. Building an agent UI? No clear path exists."
            >
              <h3 className="text-lg font-medium">
                The developer journey — step by step
              </h3>
              <Card>
                <CardContent className="p-6">
                  <ol className="space-y-3 text-sm">
                    {[
                      ["Learn about AI at Intuit", "Confluence / Slack / AIW"],
                      ["Discover Models", "AIW — Model Discovery"],
                      ["Register Service", "Dev Portal"],
                      ["Set Up Local Env", "8 documents"],
                      ["Configure IDPS & Auth", "Manual copy-paste"],
                      ["Configure Headers", "Community doc / Slack"],
                      ["First LLM Call", "IDE"],
                    ].map(([step, where], idx) => (
                      <li
                        key={step}
                        className="flex items-baseline gap-3 border-b border-border/40 pb-3 last:border-b-0 last:pb-0"
                      >
                        <span className="font-mono text-xs text-muted-foreground">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <span className="font-medium">{step}</span>
                        <span className="ml-auto text-xs text-muted-foreground">
                          {where}
                        </span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            </Section>

            <Section title="The actual 8 documents">
              <Card>
                <CardContent className="p-6">
                  <ul className="grid gap-2 text-sm sm:grid-cols-2">
                    {[
                      ["Agent Starter Kit docs", "DevPortal"],
                      ["Register Use Case docs", "DevPortal"],
                      ["Python Agent Starter Kit", "GitHub"],
                      ["StackOverflow Intuit Q&A", "Internal SO"],
                      ["Python Poetry installation", "External docs"],
                      ["DevPortal resource page", "DevPortal"],
                      ["IDPS onboarding docs", "DevPortal"],
                      ["Rancher Desktop installation", "DevPortal"],
                    ].map(([doc, where]) => (
                      <li
                        key={doc}
                        className="flex items-baseline justify-between gap-3 border-b border-border/40 py-2 last:border-b-0"
                      >
                        <span>{doc}</span>
                        <span className="text-xs text-muted-foreground">
                          {where}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <p className="text-sm text-muted-foreground">
                Then: 2 more DevPortal pages for the first LLM call, plus a
                community doc just to configure the right headers.
              </p>
            </Section>

            <Section title="More friction after the first LLM call">
              <LabeledList
                cols={2}
                items={[
                  {
                    label: "Tracing & Eval Setup",
                    description:
                      "2 more AIW pages. Then navigate to Langfuse — a completely separate tool — to view results.",
                  },
                  {
                    label: "Building an Agent UI",
                    description:
                      'Completely unclear and undocumented. Literally "Who knows!" from the Design Vision doc.',
                  },
                  {
                    label: "IDPS Config",
                    description:
                      "Setting up IDPS requires copying various values that the system already knows. Pure toil.",
                  },
                  {
                    label: "Local Testing",
                    description:
                      "Calling the service locally requires copying values that the system already knows. Same problem.",
                  },
                ]}
              />
            </Section>

            <Callout
              tone="warning"
              title="Why only 26% of GenAI use cases have done evaluations"
            >
              From the Design Vision doc: users feel the evaluation process
              doesn't add value to their work. Teams run evals to check a box
              in the RAI process, not because the process is genuinely helpful.
              This is a UX and onboarding problem, not a capability gap. The
              plugin-first approach embeds a fast eval loop inside the IDE —
              pulling Langfuse traces and surfacing results without the
              developer ever leaving their coding environment.
            </Callout>

            <Callout title="The frontend integration gap — GenUX / Intuit Agent Chat">
              Median time to first working agent through GenUX:{" "}
              <strong className="text-foreground">~3 days</strong>.
            </Callout>
          </TabsContent>

          <TabsContent value="vision" className="space-y-10">
            <Section
              eyebrow="Sooji Son & Elmer Kim · Dec 5, 2025"
              title="The AI Development Design Vision"
            >
              <h3 className="text-lg font-medium">
                The argument against a single IDE
              </h3>
              <Card>
                <CardContent className="space-y-3 p-6 text-sm leading-relaxed text-muted-foreground">
                  <p>
                    Each platform (Databricks, SageMaker, Langfuse) is deeply
                    specialized — no IDE can match that depth.
                  </p>
                  <p>
                    Developers already have a working ecosystem. These are
                    already their dev environment.
                  </p>
                  <p>
                    What users need is a cohesive experience across
                    environments, not a new environment that replaces them.
                  </p>
                </CardContent>
              </Card>
            </Section>

            <Section title="What to build instead">
              <Card>
                <CardContent className="p-6">
                  <ul className="space-y-2 text-sm">
                    {[
                      "Step-by-step onboarding flows connecting existing tools and APIs",
                      "An AI assistant integrated with Intuit's docs corpus to answer 'how do I…' with Intuit-specific context",
                      "Contextual guidance that adapts based on the user's current task or tool",
                      "Example workflows that auto-generate starter notebooks and API calls",
                      "A lightweight desktop agent providing contextual suggestions (long-term)",
                    ].map((item) => (
                      <li
                        key={item}
                        className="text-muted-foreground before:mr-2 before:text-foreground/50 before:content-['—']"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </Section>

            <Section title="The four-part framework">
              <LabeledList
                cols={2}
                items={[
                  {
                    label: "Query Knowledge",
                    description:
                      'Leverage agents to search, chat, and start tasks & workflows. Ask "how do I…" and get an answer with Intuit-specific context.',
                  },
                  {
                    label: "Learn Through AI Hub",
                    description:
                      "A structured knowledge repository with models, patterns, guides, and examples. The single source of truth for AI development at Intuit.",
                  },
                  {
                    label: "Workflow-Centered Design",
                    description:
                      "Center the experience on workflows and tasks, not on assets or features. Reduce context-switching and cognitive overhead.",
                  },
                ]}
              />
            </Section>

            <Section title="Four pillars">
              <LabeledList
                cols={2}
                items={[
                  {
                    label: "HOME",
                    description:
                      "Example projects & agents. Browse guided experiences by job-to-be-done. Quick-start paths. Browse models, prompts, RAG knowledge bases.",
                  },
                  {
                    label: "LEARN",
                    description:
                      "For any guided experience: get a preview, video, and execution plan. Structured onboarding paths per JTBD. Searchable, AI-friendly documentation.",
                  },
                  {
                    label: "EXPERIMENT",
                    description:
                      "Automatic setup — no manual copy-paste. Preconfigured env, service tokens, variables, Databricks integration. RAI guardrails built in.",
                  },
                  {
                    label: "MEASURE",
                    description:
                      'Evaluation (Langfuse integration). Create datasets, performance dashboards. Proactive recommendations: "Your agent is hallucinating on X."',
                  },
                ]}
              />
            </Section>

            <Section
              title="Benchmarks"
              description="Reference tools that set the bar for what a great experience looks like."
            >
              <LabeledList
                cols={2}
                items={[
                  {
                    label: "LangSmith",
                    description:
                      "Tracing, eval, and debugging for LLM apps. Sets the bar for what a great eval experience looks like.",
                  },
                  {
                    label: "Galileo",
                    description:
                      "LLM evaluation and observability. Referenced alongside LangSmith as best-in-class.",
                  },
                  {
                    label: "SageMaker Bedrock",
                    description:
                      "AWS managed AI service. Reference for model discovery and managed infrastructure UX.",
                  },
                  {
                    label: "Dify.ai",
                    description:
                      "Open-source LLM app dev platform. Simple, visual, accessible — a key UX reference.",
                  },
                  {
                    label: "Vertex AI",
                    description:
                      "Google's AI platform. Referenced for experiment tracking and model management UX.",
                  },
                  {
                    label: "Cursor",
                    description:
                      "AI-native code editor. The bar Intuit developers compare everything to. The tool they're already in.",
                  },
                ]}
              />
            </Section>
          </TabsContent>

          <TabsContent value="research" className="space-y-10">
            <Section
              eyebrow="Sooji Son, Melani Armstrong, Claire Zheng · Dec 2025 → Jan 2026"
              title="User Research Findings"
            >
              <StatGrid cols={4}>
                <StatCard value="1,474" label="Total users analyzed" />
                <StatCard value="77" label="Power Users" />
                <StatCard value="717" label="Lapsed Users" />
                <StatCard value="32" label="AI Newcomer satisfaction (/100)" />
              </StatGrid>
            </Section>

            <Section title="User segmentation">
              <div className="grid gap-3">
                {[
                  {
                    name: "Power Users",
                    n: "N=77",
                    desc: "High breadth AND high frequency. ≥5 core features + ≥5 sessions in 30 days. AIW's most valuable users — and even they report friction.",
                  },
                  {
                    name: "Veteran Users",
                    n: "N=275",
                    desc: "Meaningful, repeated usage. ≥3 features + ≥3 sessions. They work around the friction but are at risk of sliding into lapsed.",
                  },
                  {
                    name: "Burst Users",
                    n: "N=405",
                    desc: "Sampled heavily but didn't return. ≥3 features but ≤1 session. Tried AIW once, couldn't find value fast enough, moved on.",
                  },
                  {
                    name: "Lapsed Users",
                    n: "N=717",
                    desc: 'Previously active, haven\'t come back. The largest segment. Many just "forgot about it."',
                  },
                  {
                    name: "Should-Use-But-Don't",
                    n: "Untapped",
                    desc: "Developers/technical roles with zero recent AIW usage. The untapped audience — would benefit from AIW but have never engaged. Key target for the Day 0 plugin.",
                  },
                ].map((seg) => (
                  <Card key={seg.name}>
                    <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
                      <div className="space-y-1">
                        <CardTitle className="text-base font-medium">
                          {seg.name}
                        </CardTitle>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {seg.desc}
                        </p>
                      </div>
                      <Badge variant="secondary">{seg.n}</Badge>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </Section>

            <Section title="Research interview principles">
              <Card>
                <CardContent className="p-6">
                  <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
                    {[
                      "Why aren't users using Feature X?",
                      "Why is the number dropping?",
                      "Why aren't you using our product?",
                      "How are you currently accomplishing the jobs to be done?",
                      "What tools and workflows are you actually using day to day?",
                      "Walk me through how you currently get [job] done.",
                    ].map((q) => (
                      <li
                        key={q}
                        className="border-l-2 border-foreground/20 pl-3 italic"
                      >
                        {q}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </Section>
          </TabsContent>
        </Tabs>
      </div>
    </PreviewShell>
  )
}
