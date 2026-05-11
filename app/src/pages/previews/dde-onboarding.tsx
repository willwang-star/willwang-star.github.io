import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Callout } from "@/components/preview/callout"
import { LabeledList } from "@/components/preview/labeled-list"
import { Category, PageHeader, Section } from "@/components/preview/section"
import { PreviewShell } from "@/components/preview/preview-shell"
import { StatCard, StatGrid } from "@/components/preview/stat-card"

export function DdeOnboardingPage() {
  return (
    <PreviewShell platform="DDE" title="Onboarding">
      <div className="space-y-12">
        <PageHeader
          title="Search, understand, and access data assets from your IDE"
          subtitle="DDE exposes data tables, schemas, columns, and lineage through MCP-powered agentic tools — turning a 45-minute search into a 4-minute conversation."
        />

        <StatGrid cols={4}>
          <StatCard value="45→4" label="Min. from question to insight" />
          <StatCard value="14" label="MCP tools available" />
          <StatCard value="80%+" label="Accuracy on discovery queries" />
          <StatCard value="3" label="MCPs (discover, access, explore)" />
        </StatGrid>

        <Category title="Overview">
          <Section title="What is DDE?">
            <LabeledList
              cols={3}
              items={[
                {
                  label: "Data Discovery",
                  description:
                    "Think of it as Google for Intuit's internal data lake.",
                },
                {
                  label: "Data Access",
                  description:
                    "Handles access requests to DLAP and DACM without leaving Cursor or Claude Code.",
                },
                {
                  label: "Data Exploration",
                  description:
                    "Run queries and explore data interactively on Databricks. The Databricks MCP bridges your conversational AI workflow with actual compute.",
                },
              ]}
            />
          </Section>

          <Section title="How DDE fits in the Intuit stack">
            <Card>
              <CardContent className="p-6">
                <ul className="space-y-3 text-sm">
                  {[
                    ["Dev Portal", "Service registry, asset management"],
                    ["DDE", "Data Discovery & Exploration"],
                    ["Data Lake (ADAPT / Iceberg)", "Raw data tables"],
                    ["DACM / DLAP", "Data access control & management"],
                    ["Databricks", "Interactive compute for exploration"],
                    [
                      "CDC (Customer Data Cloud)",
                      "User & tax attribute data",
                    ],
                  ].map(([name, desc]) => (
                    <li
                      key={name}
                      className="flex items-baseline gap-3"
                    >
                      <Badge variant="outline" className="rounded-full">
                        {name}
                      </Badge>
                      <span className="text-muted-foreground">{desc}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </Section>

          <Section title="What DDE MCPs give you">
            <Card>
              <CardContent className="p-6">
                <ul className="grid gap-2 text-sm sm:grid-cols-2">
                  {[
                    "Natural language search across the entire data catalog",
                    "Table schema inspection and column-level detail",
                    "Data lineage tracing (upstream/downstream)",
                    "Access request submission and status tracking",
                    "Databricks query execution and result analysis",
                    "Collection management for bounded search contexts",
                    "Table ownership and endorsement information",
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

          <Section title="The problem DDE solves">
            <div className="grid gap-3 sm:grid-cols-2">
              <Callout tone="critical" title="Before DDE MCPs">
                Total: ~45 minutes per data question across multiple
                unconnected tools.
              </Callout>
              <Callout tone="positive" title="After DDE MCPs">
                All in one conversation, inside the IDE the developer is
                already in.
              </Callout>
            </div>
          </Section>

          <Section title="Key terminology">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-wrap gap-2">
                  {[
                    "DDE",
                    "data-discovery-mcp",
                    "dde-access-mcp",
                    "Databricks MCP",
                    "ADAPT",
                    "DACM",
                    "DLAP",
                    "IRN",
                    "codegen CLI",
                    "intuit-remote-mcp-proxy",
                    "INTUIT_API_KEY",
                    "eiamcli",
                    "Collections",
                    "HCAP",
                  ].map((term) => (
                    <Badge
                      key={term}
                      variant="secondary"
                      className="rounded-full font-mono text-xs"
                    >
                      {term}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Section>
        </Category>

        <Category title="MCP Tools">
          <Section
            title="DAST plugin available"
            description="The fastest path: intuit-data-discovery-access-exploration-capability-plugin bundles every DDE MCP and dependency in one shot."
          />

          <Section title="Data Discovery MCP">
            <Card>
              <CardHeader>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <CardTitle className="text-lg">
                    MCP 1 — Data Discovery
                  </CardTitle>
                  <Badge variant="outline" className="font-mono text-xs">
                    data-discovery-mcp
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
                <p>
                  Search Intuit's entire data catalog using natural language.
                  Find tables by business concept, inspect schemas, explore
                  column metadata and data lineage — all without leaving your
                  IDE.
                </p>
                <div className="space-y-1.5 font-mono text-xs">
                  <p>
                    Install:{" "}
                    <code className="rounded bg-muted px-1.5 py-0.5">
                      codegen mcp install data-discovery-mcp:latest
                    </code>
                  </p>
                  <p>
                    Proxy:{" "}
                    <code className="rounded bg-muted px-1.5 py-0.5">
                      localhost:8098
                    </code>
                  </p>
                </div>
              </CardContent>
            </Card>
          </Section>

          <Section title="Data Access MCP">
            <Card>
              <CardHeader>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <CardTitle className="text-lg">
                    MCP 2 — Data Access
                  </CardTitle>
                  <Badge variant="outline" className="font-mono text-xs">
                    dde-access-mcp
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
                <p>
                  Request, check, and manage access to data tables — directly
                  from your IDE. Interfaces with DACM (Data Access Control
                  Management) and DLAP. Requires Dev Portal service onboarding
                  and a separate INTUIT_API_KEY.
                </p>
                <Callout tone="warning">
                  Feature request from users: Currently doesn't return the
                  approver's name. Community has requested this be surfaced in
                  the API response.
                </Callout>
              </CardContent>
            </Card>
          </Section>

          <Section title="Databricks Exploration MCP">
            <Card>
              <CardHeader>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <CardTitle className="text-lg">
                    MCP 3 — Databricks Exploration
                  </CardTitle>
                  <Badge variant="outline" className="font-mono text-xs">
                    databricks-mcp
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="text-sm leading-relaxed text-muted-foreground">
                Run SQL queries, analyze data, and interact with Databricks
                clusters from your IDE. Pairs with data-discovery-mcp for a
                complete discover → access → explore workflow. Best used after
                you have table access confirmed.
              </CardContent>
            </Card>
          </Section>

          <Section title="Authentication MCP">
            <Card>
              <CardHeader>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <CardTitle className="text-lg">
                    MCP 4 — Authentication
                  </CardTitle>
                  <Badge variant="outline" className="font-mono text-xs">
                    auth-mcp
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
                <p>
                  Handles authentication and token management for DDE
                  services. Required as a companion server alongside
                  data-discovery-mcp and dde-access-mcp to keep your IAM
                  session alive and refresh tokens automatically.
                </p>
                <p className="font-mono text-xs">
                  Install:{" "}
                  <code className="rounded bg-muted px-1.5 py-0.5">
                    codegen mcp install auth-mcp:latest
                  </code>
                </p>
              </CardContent>
            </Card>
          </Section>

          <Section
            title="Also available: CDC Capability Plugin"
            description="A specialized skill plugin covering user attributes, tax attributes, and CG marketing data from the Customer Data Cloud. Part of the 3X Productivity initiative."
          >
            <LabeledList
              cols={2}
              items={[
                {
                  label: "data-cdc-attribute-discovery skill",
                  description:
                    "Discovers CDC attributes across User and Tax attribute domains. V1 scope covers the most important attributes used in CG marketing, agentic, and critical use cases.",
                },
                {
                  label: "CDC Capability Plugin",
                  description:
                    "Install via DAST to get CDC discovery integrated into your agent workflow. Connects to the broader DDE ecosystem.",
                },
              ]}
            />
            <Callout tone="positive">
              <strong className="text-foreground">Launched.</strong> CDC
              Capability Plugin & Skills V1 shipped in April 2026. Announced
              in #pdx-launched. More attribute domains coming in V2.
            </Callout>
          </Section>
        </Category>

        <Category title="Getting Started">
          <Section title="Fastest path">
            <Callout title="DAST plugin">
              The DAST plugin bundles data-discovery-mcp, dde-access-mcp and
              all dependencies in one shot. Enable once, works in Cursor and
              Claude Code (CLI).
            </Callout>
          </Section>

          <Section title="Setup — data-discovery-mcp">
            <Card>
              <CardContent className="p-6">
                <ol className="space-y-4 text-sm">
                  {[
                    {
                      step: "Prerequisites",
                      body: "eiam, codegen, node, yarn. Check versions first. Install from Dev Portal if missing.",
                    },
                    {
                      step: "Log in with eiamcli",
                      body: "IAM authentication is required before the proxy can communicate with DDE services. Refresh your ticket if you see 401 errors later.",
                    },
                    {
                      step: "Install and start Podman",
                      body: "DDE MCPs require a container runtime. Podman is the recommended option (Docker also works). You must initialise and start the Podman machine before running codegen installs — otherwise the setup fails silently.",
                    },
                    {
                      step: "Install MCPs via codegen",
                      body: "Run codegen mcp install for each MCP you need, or use the DAST plugin to bundle them.",
                    },
                  ].map((item, idx) => (
                    <li
                      key={item.step}
                      className="grid grid-cols-[auto_1fr] gap-3"
                    >
                      <span className="font-mono text-xs text-muted-foreground">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <div className="space-y-1">
                        <p className="font-medium">{item.step}</p>
                        <p className="text-muted-foreground">{item.body}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </Section>
        </Category>
      </div>
    </PreviewShell>
  )
}
