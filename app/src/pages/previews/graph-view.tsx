import { useEffect, useMemo, useRef, useState } from "react"
import { Link } from "react-router-dom"
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  FileText,
  Folder,
  FolderOpen,
  Settings2,
  Wand2,
} from "lucide-react"

/* ──────────────────────────────────────────────────────────────────────────
   Data — modeled on the Obsidian vault in the reference screenshot.
   Each node lists which other nodes it links to; the graph is rendered
   as an undirected graph (we union forward + back links).
   ────────────────────────────────────────────────────────────────────── */

type RawNode = {
  id: string
  label: string
  folder: string
  links: string[]
}

const RAW_NODES: RawNode[] = [
  {
    id: "dev-portal-unification",
    label: "Dev Portal Unification",
    folder: "Dev Portal",
    links: [
      "personas-jtbd",
      "information-architecture",
      "phases-bsg",
      "guiding-principles",
      "design-system",
      "user-journeys",
      "resources-links",
      "tech-arch",
      "data-discovery",
    ],
  },
  {
    id: "ai-workbench",
    label: "AI Workbench (AIW)",
    folder: "Dev Portal",
    links: ["personas-jtbd", "tech-arch", "phases-bsg", "information-architecture"],
  },
  {
    id: "data-discovery",
    label: "Data Discovery (DDE)",
    folder: "Dev Portal",
    links: ["personas-jtbd", "tech-arch", "phases-bsg", "ai-workbench"],
  },
  {
    id: "design-system",
    label: "Design System & Components",
    folder: "Dev Portal",
    links: ["guiding-principles", "information-architecture"],
  },
  {
    id: "guiding-principles",
    label: "Guiding Principles",
    folder: "Dev Portal",
    links: ["personas-jtbd", "information-architecture"],
  },
  {
    id: "information-architecture",
    label: "Information Architecture",
    folder: "Dev Portal",
    links: ["personas-jtbd", "phases-bsg", "guiding-principles"],
  },
  {
    id: "personas-jtbd",
    label: "Personas & JTBD",
    folder: "Dev Portal",
    links: ["user-journeys", "guiding-principles"],
  },
  {
    id: "phases-bsg",
    label: "Phases – Bronze Silver Gold",
    folder: "Dev Portal",
    links: ["information-architecture", "tech-arch"],
  },
  {
    id: "resources-links",
    label: "Resources & Links",
    folder: "Dev Portal",
    links: ["will-onboarding"],
  },
  {
    id: "tech-arch",
    label: "Technical Architecture – Experience Layer",
    folder: "Dev Portal",
    links: ["phases-bsg", "will-onboarding"],
  },
  {
    id: "user-journeys",
    label: "User Journeys",
    folder: "Dev Portal",
    links: ["personas-jtbd"],
  },
  {
    id: "will-onboarding",
    label: "Will Onboarding – DevX Design",
    folder: "Sources",
    links: ["tech-arch", "resources-links"],
  },
]

type GraphNode = {
  id: string
  label: string
  folder: string
  // simulation state
  x: number
  y: number
  vx: number
  vy: number
  // visual
  radius: number
}

type GraphEdge = { source: string; target: string }

function buildGraph(raw: RawNode[]) {
  // Build undirected edge set (dedupe by sorted pair).
  const edgeSet = new Set<string>()
  for (const n of raw) {
    for (const other of n.links) {
      const a = n.id
      const b = other
      const key = a < b ? `${a}|${b}` : `${b}|${a}`
      edgeSet.add(key)
    }
  }
  const edges: GraphEdge[] = [...edgeSet].map((k) => {
    const [source, target] = k.split("|")
    return { source, target }
  })

  // Degree → radius (slightly bigger for hub nodes, like Obsidian).
  const degree: Record<string, number> = {}
  for (const e of edges) {
    degree[e.source] = (degree[e.source] || 0) + 1
    degree[e.target] = (degree[e.target] || 0) + 1
  }

  // Seed positions on a circle so the sim converges quickly.
  const N = raw.length
  const nodes: GraphNode[] = raw.map((n, i) => {
    const angle = (i / N) * Math.PI * 2
    const r = 220
    return {
      id: n.id,
      label: n.label,
      folder: n.folder,
      x: Math.cos(angle) * r,
      y: Math.sin(angle) * r,
      vx: 0,
      vy: 0,
      radius: 4 + Math.sqrt(degree[n.id] || 1) * 1.6,
    }
  })

  // Adjacency for click highlighting.
  const adjacency: Record<string, Set<string>> = {}
  for (const n of raw) adjacency[n.id] = new Set()
  for (const e of edges) {
    adjacency[e.source].add(e.target)
    adjacency[e.target].add(e.source)
  }

  return { nodes, edges, adjacency }
}

/* ──────────────────────────────────────────────────────────────────────────
   Force simulation — small, dependency-free.
   Per tick:
     1. Repulsion (Coulomb) between every node pair, capped at min distance.
     2. Spring attraction along each edge toward a target length.
     3. Gentle pull toward centre (0,0).
     4. Integrate position with velocity damping.
   Runs in a requestAnimationFrame loop; cools (alpha → 0) so it settles.
   ────────────────────────────────────────────────────────────────────── */

type SimConfig = {
  repulsion: number
  springLength: number
  springStrength: number
  centerStrength: number
  damping: number
}

const DEFAULT_CFG: SimConfig = {
  repulsion: 2400,
  springLength: 120,
  springStrength: 0.04,
  centerStrength: 0.012,
  damping: 0.82,
}

function stepSimulation(
  nodes: GraphNode[],
  edges: GraphEdge[],
  cfg: SimConfig,
  alpha: number,
  pinnedId: string | null,
) {
  const byId: Record<string, GraphNode> = {}
  for (const n of nodes) byId[n.id] = n

  // Repulsion.
  for (let i = 0; i < nodes.length; i++) {
    const a = nodes[i]
    for (let j = i + 1; j < nodes.length; j++) {
      const b = nodes[j]
      let dx = a.x - b.x
      let dy = a.y - b.y
      let dist2 = dx * dx + dy * dy
      if (dist2 < 0.01) {
        dx = (Math.random() - 0.5) * 0.1
        dy = (Math.random() - 0.5) * 0.1
        dist2 = dx * dx + dy * dy + 0.01
      }
      const dist = Math.sqrt(dist2)
      const force = (cfg.repulsion / dist2) * alpha
      const fx = (dx / dist) * force
      const fy = (dy / dist) * force
      a.vx += fx
      a.vy += fy
      b.vx -= fx
      b.vy -= fy
    }
  }

  // Spring attraction.
  for (const e of edges) {
    const a = byId[e.source]
    const b = byId[e.target]
    const dx = b.x - a.x
    const dy = b.y - a.y
    const dist = Math.sqrt(dx * dx + dy * dy) || 0.01
    const delta = dist - cfg.springLength
    const force = delta * cfg.springStrength * alpha
    const fx = (dx / dist) * force
    const fy = (dy / dist) * force
    a.vx += fx
    a.vy += fy
    b.vx -= fx
    b.vy -= fy
  }

  // Centering + integrate.
  for (const n of nodes) {
    n.vx -= n.x * cfg.centerStrength * alpha
    n.vy -= n.y * cfg.centerStrength * alpha
    n.vx *= cfg.damping
    n.vy *= cfg.damping
    if (pinnedId && n.id === pinnedId) {
      n.vx = 0
      n.vy = 0
      continue
    }
    n.x += n.vx
    n.y += n.vy
  }
}

/* ──────────────────────────────────────────────────────────────────────────
   Sidebar file tree
   ────────────────────────────────────────────────────────────────────── */

function FileTree({
  nodes,
  selectedId,
  onSelect,
}: {
  nodes: GraphNode[]
  selectedId: string | null
  onSelect: (id: string) => void
}) {
  const [projectsOpen, setProjectsOpen] = useState(true)
  const [devPortalOpen, setDevPortalOpen] = useState(true)
  const [sourcesOpen, setSourcesOpen] = useState(true)

  const devPortal = useMemo(
    () => nodes.filter((n) => n.folder === "Dev Portal"),
    [nodes],
  )
  const sources = useMemo(
    () => nodes.filter((n) => n.folder === "Sources"),
    [nodes],
  )

  return (
    <nav
      aria-label="Vault file tree"
      className="h-full overflow-y-auto bg-[#1e1e1e] py-3 text-[13px] text-zinc-300 select-none"
    >
      <button
        type="button"
        onClick={() => setProjectsOpen((v) => !v)}
        className="flex w-full items-center gap-1 px-3 py-1 text-xs font-medium uppercase tracking-wide text-zinc-400 hover:text-zinc-200"
      >
        {projectsOpen ? (
          <ChevronDown className="size-3" aria-hidden="true" />
        ) : (
          <ChevronRight className="size-3" aria-hidden="true" />
        )}
        Projects
      </button>

      {projectsOpen && (
        <div className="pl-3">
          {/* Dev Portal folder */}
          <button
            type="button"
            onClick={() => setDevPortalOpen((v) => !v)}
            className="flex w-full items-center gap-1.5 px-2 py-1 text-zinc-200 hover:bg-zinc-800/60"
          >
            {devPortalOpen ? (
              <ChevronDown className="size-3 text-zinc-500" aria-hidden="true" />
            ) : (
              <ChevronRight className="size-3 text-zinc-500" aria-hidden="true" />
            )}
            {devPortalOpen ? (
              <FolderOpen className="size-3.5 text-zinc-400" aria-hidden="true" />
            ) : (
              <Folder className="size-3.5 text-zinc-400" aria-hidden="true" />
            )}
            <span>Dev Portal</span>
          </button>

          {devPortalOpen && (
            <div className="ml-3 border-l border-zinc-800/80 pl-1">
              {/* nested Sources folder, like the screenshot */}
              <button
                type="button"
                onClick={() => setSourcesOpen((v) => !v)}
                className="flex w-full items-center gap-1.5 px-2 py-1 text-zinc-300 hover:bg-zinc-800/60"
              >
                {sourcesOpen ? (
                  <ChevronDown className="size-3 text-zinc-500" aria-hidden="true" />
                ) : (
                  <ChevronRight className="size-3 text-zinc-500" aria-hidden="true" />
                )}
                {sourcesOpen ? (
                  <FolderOpen className="size-3.5 text-zinc-400" aria-hidden="true" />
                ) : (
                  <Folder className="size-3.5 text-zinc-400" aria-hidden="true" />
                )}
                <span>Sources</span>
              </button>
              {sourcesOpen &&
                sources.map((n) => (
                  <FileRow
                    key={n.id}
                    node={n}
                    indent={3}
                    selected={selectedId === n.id}
                    onSelect={onSelect}
                  />
                ))}

              {/* Dev Portal files (flat, after Sources). */}
              {devPortal.map((n) => (
                <FileRow
                  key={n.id}
                  node={n}
                  indent={2}
                  selected={selectedId === n.id}
                  onSelect={onSelect}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </nav>
  )
}

function FileRow({
  node,
  indent,
  selected,
  onSelect,
}: {
  node: GraphNode
  indent: number
  selected: boolean
  onSelect: (id: string) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(node.id)}
      aria-current={selected ? "true" : undefined}
      className={`flex w-full items-center gap-1.5 truncate py-1 pr-2 text-left transition-colors ${
        selected
          ? "bg-violet-500/15 text-violet-200"
          : "text-zinc-300 hover:bg-zinc-800/60"
      }`}
      style={{ paddingLeft: `${indent * 8 + 8}px` }}
    >
      <FileText
        className={`size-3.5 shrink-0 ${selected ? "text-violet-300" : "text-zinc-500"}`}
        aria-hidden="true"
      />
      <span className="truncate">{node.label}</span>
    </button>
  )
}

/* ──────────────────────────────────────────────────────────────────────────
   Graph canvas — SVG renderer wired to the force sim.
   ────────────────────────────────────────────────────────────────────── */

function GraphCanvas({
  nodes,
  edges,
  adjacency,
  selectedId,
  onSelectNode,
  onClearSelection,
}: {
  nodes: GraphNode[]
  edges: GraphEdge[]
  adjacency: Record<string, Set<string>>
  selectedId: string | null
  onSelectNode: (id: string) => void
  onClearSelection: () => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const rafRef = useRef<number | null>(null)
  const alphaRef = useRef(1)
  const draggingRef = useRef<{ id: string; dx: number; dy: number } | null>(null)
  const panRef = useRef<{ x: number; y: number } | null>(null)

  // Viewport state — translate (pan) + scale (zoom).
  const [viewport, setViewport] = useState({ tx: 0, ty: 0, scale: 1 })
  const [size, setSize] = useState({ w: 800, h: 600 })
  const [isPanning, setIsPanning] = useState(false)
  const [, forceRender] = useState(0)

  // Track container size for the SVG viewBox.
  useEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setSize({ w: width, h: height })
    })
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  // Drive the simulation loop.
  useEffect(() => {
    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(64, now - last)
      last = now
      // Heat the sim while the user is dragging; otherwise let it cool.
      if (draggingRef.current) {
        alphaRef.current = Math.max(alphaRef.current, 0.6)
      } else {
        alphaRef.current = Math.max(0.02, alphaRef.current * 0.995)
      }
      const steps = Math.max(1, Math.floor(dt / 16))
      for (let i = 0; i < steps; i++) {
        stepSimulation(
          nodes,
          edges,
          DEFAULT_CFG,
          alphaRef.current,
          draggingRef.current?.id ?? null,
        )
      }
      forceRender((n) => (n + 1) % 1_000_000)
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
    // We deliberately keep the sim tied to the (stable) node/edge refs so
    // we don't recreate the RAF loop on every state change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Reheat the sim when the user selects a node so it visibly responds.
  useEffect(() => {
    alphaRef.current = Math.max(alphaRef.current, 0.5)
  }, [selectedId])

  // Convert client coords → graph coords (account for pan + zoom + center).
  function clientToGraph(clientX: number, clientY: number) {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return { x: 0, y: 0 }
    const cx = clientX - rect.left - rect.width / 2 - viewport.tx
    const cy = clientY - rect.top - rect.height / 2 - viewport.ty
    return { x: cx / viewport.scale, y: cy / viewport.scale }
  }

  function handleWheel(event: React.WheelEvent) {
    event.preventDefault()
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const factor = Math.exp(-event.deltaY * 0.0015)
    const nextScale = Math.min(4, Math.max(0.3, viewport.scale * factor))
    // Zoom toward cursor: keep the graph-point under the cursor fixed.
    const px = event.clientX - rect.left - rect.width / 2
    const py = event.clientY - rect.top - rect.height / 2
    const ratio = nextScale / viewport.scale
    setViewport({
      scale: nextScale,
      tx: px - (px - viewport.tx) * ratio,
      ty: py - (py - viewport.ty) * ratio,
    })
  }

  function handlePointerDownBackground(event: React.PointerEvent) {
    if ((event.target as Element).closest("[data-node]")) return
    onClearSelection()
    panRef.current = { x: event.clientX - viewport.tx, y: event.clientY - viewport.ty }
    setIsPanning(true)
    ;(event.currentTarget as Element).setPointerCapture(event.pointerId)
  }

  function handlePointerMove(event: React.PointerEvent) {
    if (draggingRef.current) {
      const { x, y } = clientToGraph(event.clientX, event.clientY)
      const node = nodes.find((n) => n.id === draggingRef.current!.id)
      if (node) {
        node.x = x - draggingRef.current.dx
        node.y = y - draggingRef.current.dy
        node.vx = 0
        node.vy = 0
      }
      return
    }
    if (panRef.current) {
      setViewport((vp) => ({
        ...vp,
        tx: event.clientX - panRef.current!.x,
        ty: event.clientY - panRef.current!.y,
      }))
    }
  }

  function handlePointerUp(event: React.PointerEvent) {
    draggingRef.current = null
    panRef.current = null
    setIsPanning(false)
    if ((event.currentTarget as Element).hasPointerCapture?.(event.pointerId)) {
      ;(event.currentTarget as Element).releasePointerCapture(event.pointerId)
    }
  }

  function handleNodePointerDown(event: React.PointerEvent, id: string) {
    event.stopPropagation()
    const node = nodes.find((n) => n.id === id)
    if (!node) return
    const { x, y } = clientToGraph(event.clientX, event.clientY)
    draggingRef.current = { id, dx: x - node.x, dy: y - node.y }
    onSelectNode(id)
  }

  // Visual state derived from selection. Like Obsidian:
  //   - selected node: violet
  //   - 1-hop neighbors: lighter violet
  //   - selected edges: violet
  //   - everything else: dimmed
  const neighborSet = selectedId ? adjacency[selectedId] : null
  function nodeStyle(id: string) {
    if (!selectedId) return { fill: "#a1a1aa", opacity: 1, labelOpacity: 0.85 }
    if (id === selectedId) return { fill: "#8b5cf6", opacity: 1, labelOpacity: 1 }
    if (neighborSet?.has(id)) return { fill: "#c4b5fd", opacity: 1, labelOpacity: 1 }
    return { fill: "#52525b", opacity: 0.5, labelOpacity: 0.35 }
  }
  function edgeStyle(e: GraphEdge) {
    if (!selectedId) return { stroke: "#3f3f46", opacity: 0.7, width: 0.6 }
    const isHit = e.source === selectedId || e.target === selectedId
    if (isHit) return { stroke: "#8b5cf6", opacity: 0.95, width: 1.2 }
    return { stroke: "#27272a", opacity: 0.35, width: 0.5 }
  }

  // viewBox is centered at origin so the sim's coordinate frame matches.
  const viewBox = `${-size.w / 2} ${-size.h / 2} ${size.w} ${size.h}`

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden bg-[#181818]"
    >
      {/* Graph view title bar */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between px-4 py-3 text-[13px] text-zinc-300">
        <Link
          to="/"
          className="pointer-events-auto inline-flex items-center gap-1.5 rounded-md px-1.5 py-1 text-zinc-400 transition-colors hover:bg-zinc-800/70 hover:text-zinc-100"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          <span className="text-xs">Back</span>
        </Link>
        <span className="font-medium tracking-tight text-zinc-200">Graph view</span>
        <div className="pointer-events-auto flex items-center gap-2 text-zinc-500">
          <Settings2 className="size-4" aria-hidden="true" />
          <Wand2 className="size-4" aria-hidden="true" />
        </div>
      </div>

      <svg
        ref={svgRef}
        viewBox={viewBox}
        width="100%"
        height="100%"
        role="img"
        aria-label="Force-directed graph of vault notes"
        onPointerDown={handlePointerDownBackground}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onWheel={handleWheel}
        style={{ cursor: isPanning ? "grabbing" : "grab", touchAction: "none" }}
      >
        <g
          transform={`translate(${viewport.tx} ${viewport.ty}) scale(${viewport.scale})`}
        >
          {/* edges */}
          <g>
            {edges.map((e) => {
              const a = nodes.find((n) => n.id === e.source)!
              const b = nodes.find((n) => n.id === e.target)!
              const s = edgeStyle(e)
              return (
                <line
                  key={`${e.source}|${e.target}`}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke={s.stroke}
                  strokeOpacity={s.opacity}
                  strokeWidth={s.width}
                />
              )
            })}
          </g>

          {/* nodes + labels */}
          <g>
            {nodes.map((n) => {
              const s = nodeStyle(n.id)
              return (
                <g
                  key={n.id}
                  data-node={n.id}
                  onPointerDown={(e) => handleNodePointerDown(e, n.id)}
                  style={{ cursor: "pointer" }}
                >
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={n.radius}
                    fill={s.fill}
                    fillOpacity={s.opacity}
                    stroke={n.id === selectedId ? "#ddd6fe" : "transparent"}
                    strokeWidth={n.id === selectedId ? 1.5 : 0}
                  />
                  <text
                    x={n.x}
                    y={n.y + n.radius + 12}
                    textAnchor="middle"
                    fontSize={9}
                    fill="#e4e4e7"
                    opacity={s.labelOpacity}
                    style={{ pointerEvents: "none", userSelect: "none" }}
                  >
                    {n.label}
                  </text>
                </g>
              )
            })}
          </g>
        </g>
      </svg>

      {/* Hint, mirrors the small Obsidian filter counter */}
      <div className="pointer-events-none absolute left-3 top-12 rounded-md bg-zinc-900/80 px-2 py-1 text-[11px] text-zinc-300 shadow-sm">
        {nodes.length} files, 2 folders
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────────────────
   Page entry — left tree + right graph, like the screenshots.
   ────────────────────────────────────────────────────────────────────── */

export function GraphViewPage() {
  const graph = useMemo(() => buildGraph(RAW_NODES), [])
  const [selectedId, setSelectedId] = useState<string | null>(null)

  return (
    <div className="dark fixed inset-0 grid bg-[#181818] text-zinc-200" style={{ gridTemplateColumns: "260px 1fr" }}>
      <aside className="border-r border-zinc-800/80 bg-[#1e1e1e]">
        <FileTree
          nodes={graph.nodes}
          selectedId={selectedId}
          onSelect={(id) => setSelectedId(id)}
        />
      </aside>
      <section>
        <GraphCanvas
          nodes={graph.nodes}
          edges={graph.edges}
          adjacency={graph.adjacency}
          selectedId={selectedId}
          onSelectNode={(id) => setSelectedId(id)}
          onClearSelection={() => setSelectedId(null)}
        />
      </section>
    </div>
  )
}
