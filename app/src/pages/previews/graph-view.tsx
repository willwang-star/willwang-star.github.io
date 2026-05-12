import { useEffect, useMemo, useRef, useState } from "react"
import { Link } from "react-router-dom"
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  FileText,
  Folder,
  FolderOpen,
  Plus,
  RotateCcw,
  Trash2,
} from "lucide-react"

/* ──────────────────────────────────────────────────────────────────────────
   Editable knowledge graph.

   Data shape:
     - `entities` is a flat map keyed by id (stable references for the sim).
     - Each entity has `parentId` (or null for roots), so we can render the
       left tree at arbitrary nesting depth.
     - Each entity has `links: string[]` — the relationships, undirected,
       stored from whichever side the user toggled. We dedupe at graph build.

   The graph view derives its nodes/edges from this state every render, so
   any edit on the left shows up immediately on the right.

   State is persisted to localStorage so demos survive reloads. A "Reset"
   button restores the seed data.
   ────────────────────────────────────────────────────────────────────── */

type Entity = {
  id: string
  label: string
  parentId: string | null
  links: string[]
}

type EntityMap = Record<string, Entity>

const STORAGE_KEY = "graph-view:entities:v1"

function uid() {
  return `e_${Math.random().toString(36).slice(2, 9)}`
}

function seedEntities(): EntityMap {
  // Two top-level folders, mirroring the Obsidian reference screenshot.
  const projects = "projects"
  const devPortal = "dev-portal"
  const sources = "sources"

  const map: EntityMap = {
    [projects]: { id: projects, label: "Projects", parentId: null, links: [] },
    [devPortal]: {
      id: devPortal,
      label: "Dev Portal",
      parentId: projects,
      links: [],
    },
    [sources]: {
      id: sources,
      label: "Sources",
      parentId: devPortal,
      links: [],
    },
  }

  // Helper to add a leaf entity under a parent.
  function add(id: string, label: string, parentId: string, links: string[]) {
    map[id] = { id, label, parentId, links }
  }

  add("dev-portal-unification", "Dev Portal Unification", devPortal, [
    "personas-jtbd",
    "information-architecture",
    "phases-bsg",
    "guiding-principles",
    "design-system",
    "user-journeys",
    "resources-links",
    "tech-arch",
    "data-discovery",
  ])
  add("ai-workbench", "AI Workbench (AIW)", devPortal, [
    "personas-jtbd",
    "tech-arch",
    "phases-bsg",
    "information-architecture",
  ])
  add("data-discovery", "Data Discovery (DDE)", devPortal, [
    "personas-jtbd",
    "tech-arch",
    "phases-bsg",
    "ai-workbench",
  ])
  add("design-system", "Design System & Components", devPortal, [
    "guiding-principles",
    "information-architecture",
  ])
  add("guiding-principles", "Guiding Principles", devPortal, [
    "personas-jtbd",
    "information-architecture",
  ])
  add("information-architecture", "Information Architecture", devPortal, [
    "personas-jtbd",
    "phases-bsg",
    "guiding-principles",
  ])
  add("personas-jtbd", "Personas & JTBD", devPortal, [
    "user-journeys",
    "guiding-principles",
  ])
  add("phases-bsg", "Phases – Bronze Silver Gold", devPortal, [
    "information-architecture",
    "tech-arch",
  ])
  add("resources-links", "Resources & Links", devPortal, ["will-onboarding"])
  add("tech-arch", "Technical Architecture – Experience Layer", devPortal, [
    "phases-bsg",
    "will-onboarding",
  ])
  add("user-journeys", "User Journeys", devPortal, ["personas-jtbd"])
  add("will-onboarding", "Will Onboarding – DevX Design", sources, [
    "tech-arch",
    "resources-links",
  ])

  return map
}

function loadEntities(): EntityMap {
  if (typeof window === "undefined") return seedEntities()
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return seedEntities()
    const parsed = JSON.parse(raw) as EntityMap
    // Light sanity check.
    if (parsed && typeof parsed === "object" && Object.keys(parsed).length > 0) {
      return parsed
    }
  } catch {
    // fall through
  }
  return seedEntities()
}

function saveEntities(map: EntityMap) {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
  } catch {
    // localStorage may be full / disabled; non-fatal for a demo.
  }
}

/* ──────────────────────────────────────────────────────────────────────────
   Derived graph: which entities are leaves (drawn as nodes), and the
   deduped edge list. Folders (entities with children) are NOT drawn as
   graph nodes — they're organizational only, like Obsidian folders.
   ────────────────────────────────────────────────────────────────────── */

type GraphNode = {
  id: string
  label: string
  x: number
  y: number
  vx: number
  vy: number
  radius: number
}

type GraphEdge = { source: string; target: string }

function buildGraph(
  entities: EntityMap,
  prev: Record<string, { x: number; y: number; vx: number; vy: number }>,
) {
  const allIds = Object.keys(entities)
  const hasChildren = new Set<string>()
  for (const id of allIds) {
    const parentId = entities[id].parentId
    if (parentId) hasChildren.add(parentId)
  }
  const leafIds = allIds.filter((id) => !hasChildren.has(id))
  const leafSet = new Set(leafIds)

  // Dedupe edges to undirected pairs. Skip edges that point to a non-leaf
  // (e.g. someone linked to a folder) or to a deleted entity.
  const edgeSet = new Set<string>()
  for (const id of leafIds) {
    for (const other of entities[id].links) {
      if (!leafSet.has(other)) continue
      if (other === id) continue
      const key = id < other ? `${id}|${other}` : `${other}|${id}`
      edgeSet.add(key)
    }
  }
  const edges: GraphEdge[] = [...edgeSet].map((k) => {
    const [source, target] = k.split("|")
    return { source, target }
  })

  // Degree → radius.
  const degree: Record<string, number> = {}
  for (const e of edges) {
    degree[e.source] = (degree[e.source] || 0) + 1
    degree[e.target] = (degree[e.target] || 0) + 1
  }

  // Build nodes. Reuse previous positions where we can so adding/removing
  // an entity doesn't jolt the whole layout.
  const N = leafIds.length
  const nodes: GraphNode[] = leafIds.map((id, i) => {
    const p = prev[id]
    const angle = (i / Math.max(1, N)) * Math.PI * 2
    const r = 220
    return {
      id,
      label: entities[id].label,
      x: p?.x ?? Math.cos(angle) * r,
      y: p?.y ?? Math.sin(angle) * r,
      vx: p?.vx ?? 0,
      vy: p?.vy ?? 0,
      // Base 2.5px, grows ~sqrt(degree) so a node with 9 links is ~5.5px
      // and most leaves stay ~3.5px — a noticeable but small bump.
      radius: 2.5 + Math.sqrt(degree[id] || 1) * 1.1,
    }
  })

  const adjacency: Record<string, Set<string>> = {}
  for (const id of leafIds) adjacency[id] = new Set()
  for (const e of edges) {
    adjacency[e.source].add(e.target)
    adjacency[e.target].add(e.source)
  }

  return { nodes, edges, adjacency, leafIds }
}

/* ──────────────────────────────────────────────────────────────────────────
   Force simulation.
   ────────────────────────────────────────────────────────────────────── */

type SimConfig = {
  repulsion: number
  springLength: number
  springStrength: number
  centerStrength: number
  damping: number
}

const DEFAULT_CFG: SimConfig = {
  repulsion: 3200,
  springLength: 150,
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

  for (const e of edges) {
    const a = byId[e.source]
    const b = byId[e.target]
    if (!a || !b) continue
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
   Left sidebar — editable tree + relationships panel.
   ────────────────────────────────────────────────────────────────────── */

function childrenOf(entities: EntityMap, parentId: string | null): Entity[] {
  return Object.values(entities)
    .filter((e) => e.parentId === parentId)
    .sort((a, b) => a.label.localeCompare(b.label))
}

function Sidebar({
  entities,
  selectedId,
  onSelect,
  onAddChild,
  onRename,
  onDelete,
  onToggleLink,
  onReset,
}: {
  entities: EntityMap
  selectedId: string | null
  onSelect: (id: string | null) => void
  onAddChild: (parentId: string | null) => void
  onRename: (id: string, label: string) => void
  onDelete: (id: string) => void
  onToggleLink: (a: string, b: string) => void
  onReset: () => void
}) {
  const [expanded, setExpanded] = useState<Set<string>>(() => {
    // Expand root + first level by default.
    const s = new Set<string>()
    for (const e of Object.values(entities)) {
      if (e.parentId === null) s.add(e.id)
      if (e.parentId && entities[e.parentId]?.parentId === null) s.add(e.id)
    }
    return s
  })

  function toggleExpanded(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const roots = childrenOf(entities, null)
  const selected = selectedId ? entities[selectedId] : null

  // For the relationships panel, build the list of OTHER leaf entities the
  // selected entity can link to. Folders (entities with children) are
  // excluded — only leaves appear as graph nodes.
  const allIds = Object.keys(entities)
  const hasChildren = new Set<string>()
  for (const id of allIds) {
    const parentId = entities[id].parentId
    if (parentId) hasChildren.add(parentId)
  }
  const otherLeafEntities =
    selected && !hasChildren.has(selected.id)
      ? Object.values(entities)
          .filter((e) => e.id !== selected.id && !hasChildren.has(e.id))
          .sort((a, b) => a.label.localeCompare(b.label))
      : []

  // The undirected link set for the selected entity — union of its own
  // links plus any entity that links back to it.
  const linkedToSelected = useMemo(() => {
    if (!selected) return new Set<string>()
    const s = new Set<string>(selected.links)
    for (const e of Object.values(entities)) {
      if (e.links.includes(selected.id)) s.add(e.id)
    }
    return s
  }, [selected, entities])

  return (
    <nav
      aria-label="Vault file tree"
      className="flex h-full flex-col bg-[#1e1e1e] text-[13px] text-zinc-300 select-none"
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 px-3 py-2">
        <span className="text-xs font-medium uppercase tracking-wide text-zinc-400">
          Entities
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onAddChild(null)}
            title="Add top-level entity"
            className="rounded p-1 text-zinc-400 hover:bg-zinc-800/80 hover:text-zinc-100"
          >
            <Plus className="size-3.5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => {
              if (
                window.confirm(
                  "Reset to the original demo data? Your changes will be lost.",
                )
              ) {
                onReset()
              }
            }}
            title="Reset to seed data"
            className="rounded p-1 text-zinc-400 hover:bg-zinc-800/80 hover:text-zinc-100"
          >
            <RotateCcw className="size-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Tree */}
      <div className="flex-1 overflow-y-auto py-2">
        {roots.map((root) => (
          <TreeRow
            key={root.id}
            entity={root}
            depth={0}
            entities={entities}
            expanded={expanded}
            selectedId={selectedId}
            onToggleExpanded={toggleExpanded}
            onSelect={onSelect}
            onAddChild={onAddChild}
            onRename={onRename}
            onDelete={onDelete}
          />
        ))}
        {roots.length === 0 && (
          <p className="px-4 py-3 text-xs text-zinc-500">
            No entities yet. Click + above to add one.
          </p>
        )}
      </div>

      {/* Relationships panel */}
      {selected && (
        <div className="max-h-[40vh] overflow-y-auto border-t border-zinc-800/80 bg-[#1a1a1a] px-3 py-3">
          <div className="mb-1 text-xs font-medium uppercase tracking-wide text-zinc-400">
            Relationships
          </div>
          <div className="mb-2 truncate text-[13px] text-zinc-200">
            {selected.label}
          </div>

          {hasChildren.has(selected.id) ? (
            <p className="text-[11px] text-zinc-500">
              Folders don't appear in the graph. Add a sub-entity, then assign
              its relationships.
            </p>
          ) : otherLeafEntities.length === 0 ? (
            <p className="text-[11px] text-zinc-500">
              Add another entity to start linking.
            </p>
          ) : (
            <ul className="space-y-0.5">
              {otherLeafEntities.map((other) => {
                const checked = linkedToSelected.has(other.id)
                return (
                  <li key={other.id}>
                    <label className="flex cursor-pointer items-center gap-2 rounded px-1 py-1 text-[12px] text-zinc-300 hover:bg-zinc-800/60">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => onToggleLink(selected.id, other.id)}
                        className="size-3 accent-violet-500"
                      />
                      <span className="truncate">{other.label}</span>
                    </label>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      )}
    </nav>
  )
}

function TreeRow({
  entity,
  depth,
  entities,
  expanded,
  selectedId,
  onToggleExpanded,
  onSelect,
  onAddChild,
  onRename,
  onDelete,
}: {
  entity: Entity
  depth: number
  entities: EntityMap
  expanded: Set<string>
  selectedId: string | null
  onToggleExpanded: (id: string) => void
  onSelect: (id: string) => void
  onAddChild: (parentId: string) => void
  onRename: (id: string, label: string) => void
  onDelete: (id: string) => void
}) {
  const [isRenaming, setIsRenaming] = useState(false)
  const [draftLabel, setDraftLabel] = useState(entity.label)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isRenaming) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [isRenaming])

  const kids = childrenOf(entities, entity.id)
  const isFolder = kids.length > 0
  const isOpen = expanded.has(entity.id)
  const isSelected = selectedId === entity.id

  function commitRename() {
    const trimmed = draftLabel.trim()
    if (trimmed && trimmed !== entity.label) {
      onRename(entity.id, trimmed)
    } else {
      setDraftLabel(entity.label)
    }
    setIsRenaming(false)
  }

  return (
    <div>
      <div
        className={`group flex items-center gap-1 rounded px-1 py-[3px] transition-colors ${
          isSelected
            ? "bg-violet-500/15 text-violet-100"
            : "text-zinc-300 hover:bg-zinc-800/60"
        }`}
        style={{ paddingLeft: `${depth * 12 + 4}px` }}
      >
        {/* Chevron / spacer */}
        {isFolder ? (
          <button
            type="button"
            onClick={() => onToggleExpanded(entity.id)}
            className="rounded p-0.5 text-zinc-500 hover:text-zinc-200"
            aria-label={isOpen ? "Collapse" : "Expand"}
          >
            {isOpen ? (
              <ChevronDown className="size-3" aria-hidden="true" />
            ) : (
              <ChevronRight className="size-3" aria-hidden="true" />
            )}
          </button>
        ) : (
          <span className="inline-block w-4" />
        )}

        {/* Icon */}
        {isFolder ? (
          isOpen ? (
            <FolderOpen
              className="size-3.5 shrink-0 text-zinc-400"
              aria-hidden="true"
            />
          ) : (
            <Folder
              className="size-3.5 shrink-0 text-zinc-400"
              aria-hidden="true"
            />
          )
        ) : (
          <FileText
            className={`size-3.5 shrink-0 ${
              isSelected ? "text-violet-300" : "text-zinc-500"
            }`}
            aria-hidden="true"
          />
        )}

        {/* Label / rename input */}
        {isRenaming ? (
          <input
            ref={inputRef}
            value={draftLabel}
            onChange={(e) => setDraftLabel(e.target.value)}
            onBlur={commitRename}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitRename()
              if (e.key === "Escape") {
                setDraftLabel(entity.label)
                setIsRenaming(false)
              }
            }}
            className="min-w-0 flex-1 rounded border border-violet-400/60 bg-zinc-950 px-1 py-0 text-[12px] text-zinc-100 outline-none"
          />
        ) : (
          <button
            type="button"
            onClick={() => onSelect(entity.id)}
            onDoubleClick={() => setIsRenaming(true)}
            className="min-w-0 flex-1 truncate text-left text-[12px]"
            title="Click to select · Double-click to rename"
          >
            {entity.label}
          </button>
        )}

        {/* Row actions — visible on hover */}
        {!isRenaming && (
          <div className="ml-auto flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onAddChild(entity.id)
              }}
              title="Add sub-entity"
              className="rounded p-0.5 text-zinc-400 hover:bg-zinc-700/80 hover:text-zinc-100"
            >
              <Plus className="size-3" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setIsRenaming(true)
              }}
              title="Rename"
              className="rounded px-1 py-0 text-[10px] text-zinc-400 hover:bg-zinc-700/80 hover:text-zinc-100"
            >
              Aa
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                if (
                  window.confirm(
                    isFolder
                      ? `Delete "${entity.label}" and all its sub-entities?`
                      : `Delete "${entity.label}"?`,
                  )
                ) {
                  onDelete(entity.id)
                }
              }}
              title="Delete"
              className="rounded p-0.5 text-zinc-400 hover:bg-red-500/20 hover:text-red-300"
            >
              <Trash2 className="size-3" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      {/* Children */}
      {isFolder && isOpen && (
        <div>
          {kids.map((kid) => (
            <TreeRow
              key={kid.id}
              entity={kid}
              depth={depth + 1}
              entities={entities}
              expanded={expanded}
              selectedId={selectedId}
              onToggleExpanded={onToggleExpanded}
              onSelect={onSelect}
              onAddChild={onAddChild}
              onRename={onRename}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────────────────
   Graph canvas.
   ────────────────────────────────────────────────────────────────────── */

function GraphCanvas({
  nodes,
  edges,
  adjacency,
  selectedId,
  onSelectNode,
  onClearSelection,
  nodeCount,
}: {
  nodes: GraphNode[]
  edges: GraphEdge[]
  adjacency: Record<string, Set<string>>
  selectedId: string | null
  onSelectNode: (id: string) => void
  onClearSelection: () => void
  nodeCount: number
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | null>(null)
  const alphaRef = useRef(1)
  const draggingRef = useRef<{ id: string; dx: number; dy: number } | null>(null)
  const panRef = useRef<{ x: number; y: number } | null>(null)

  const [viewport, setViewport] = useState({ tx: 0, ty: 0, scale: 1 })
  const [size, setSize] = useState({ w: 800, h: 600 })
  const [isPanning, setIsPanning] = useState(false)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [, forceRender] = useState(0)

  useEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setSize({ w: width, h: height })
    })
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  // Always pin the latest nodes/edges in refs so the RAF loop sees fresh data
  // even though we only create the loop once.
  const nodesRef = useRef(nodes)
  const edgesRef = useRef(edges)
  nodesRef.current = nodes
  edgesRef.current = edges

  useEffect(() => {
    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(64, now - last)
      last = now
      if (draggingRef.current) {
        alphaRef.current = Math.max(alphaRef.current, 0.6)
      } else {
        alphaRef.current = Math.max(0.02, alphaRef.current * 0.995)
      }
      const steps = Math.max(1, Math.floor(dt / 16))
      for (let i = 0; i < steps; i++) {
        stepSimulation(
          nodesRef.current,
          edgesRef.current,
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
  }, [])

  // Reheat the sim when graph structure or selection changes.
  useEffect(() => {
    alphaRef.current = Math.max(alphaRef.current, 0.6)
  }, [selectedId, nodeCount, edges.length])

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
    panRef.current = {
      x: event.clientX - viewport.tx,
      y: event.clientY - viewport.ty,
    }
    setIsPanning(true)
    ;(event.currentTarget as Element).setPointerCapture(event.pointerId)
  }

  function handlePointerMove(event: React.PointerEvent) {
    if (draggingRef.current) {
      const { x, y } = clientToGraph(event.clientX, event.clientY)
      const node = nodesRef.current.find((n) => n.id === draggingRef.current!.id)
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
    const node = nodesRef.current.find((n) => n.id === id)
    if (!node) return
    const { x, y } = clientToGraph(event.clientX, event.clientY)
    draggingRef.current = { id, dx: x - node.x, dy: y - node.y }
    onSelectNode(id)
  }

  // Selection wins over hover. Either one drives highlighting.
  const focusedId = selectedId ?? hoveredId
  const neighborSet = focusedId ? adjacency[focusedId] : null
  function nodeStyle(id: string) {
    if (!focusedId) return { fill: "#a1a1aa", opacity: 1, labelOpacity: 0.85 }
    if (id === focusedId) return { fill: "#8b5cf6", opacity: 1, labelOpacity: 1 }
    if (neighborSet?.has(id)) return { fill: "#c4b5fd", opacity: 1, labelOpacity: 1 }
    return { fill: "#52525b", opacity: 0.5, labelOpacity: 0.35 }
  }
  function edgeStyle(e: GraphEdge) {
    if (!focusedId) return { stroke: "#3f3f46", opacity: 0.7, width: 0.6 }
    const isHit = e.source === focusedId || e.target === focusedId
    if (isHit) return { stroke: "#8b5cf6", opacity: 0.95, width: 1.2 }
    return { stroke: "#27272a", opacity: 0.35, width: 0.5 }
  }

  const viewBox = `${-size.w / 2} ${-size.h / 2} ${size.w} ${size.h}`

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden bg-[#181818]"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between px-4 py-3 text-[13px] text-zinc-300">
        <Link
          to="/"
          className="pointer-events-auto inline-flex items-center gap-1.5 rounded-md px-1.5 py-1 text-zinc-400 transition-colors hover:bg-zinc-800/70 hover:text-zinc-100"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          <span className="text-xs">Back</span>
        </Link>
        <span className="font-medium tracking-tight text-zinc-200">Graph Nav</span>
        <span className="w-[60px]" />
      </div>

      <svg
        viewBox={viewBox}
        width="100%"
        height="100%"
        role="img"
        aria-label="Force-directed graph of entities"
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
          <g>
            {edges.map((e) => {
              const a = nodes.find((n) => n.id === e.source)
              const b = nodes.find((n) => n.id === e.target)
              if (!a || !b) return null
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
          <g>
            {nodes.map((n) => {
              const s = nodeStyle(n.id)
              return (
                <g
                  key={n.id}
                  data-node={n.id}
                  onPointerDown={(e) => handleNodePointerDown(e, n.id)}
                  onPointerEnter={() => setHoveredId(n.id)}
                  onPointerLeave={() =>
                    setHoveredId((cur) => (cur === n.id ? null : cur))
                  }
                  style={{ cursor: "pointer" }}
                >
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={n.radius}
                    fill={s.fill}
                    fillOpacity={s.opacity}
                  />
                  <text
                    x={n.x}
                    y={n.y + n.radius + 9}
                    textAnchor="middle"
                    fontSize={7}
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

      <div className="pointer-events-none absolute left-3 top-12 rounded-md bg-zinc-900/80 px-2 py-1 text-[11px] text-zinc-300 shadow-sm">
        {nodeCount} {nodeCount === 1 ? "entity" : "entities"}
        {edges.length > 0 ? `, ${edges.length} links` : ""}
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────────────────
   Page entry.
   ────────────────────────────────────────────────────────────────────── */

export function GraphViewPage() {
  const [entities, setEntities] = useState<EntityMap>(() => loadEntities())
  const [selectedId, setSelectedId] = useState<string | null>(null)

  // Persist on every change.
  useEffect(() => {
    saveEntities(entities)
  }, [entities])

  // Build the derived graph. We pass in previous positions so newly-added
  // entities slide in without resetting the rest of the layout.
  const prevPosRef = useRef<
    Record<string, { x: number; y: number; vx: number; vy: number }>
  >({})
  const graph = useMemo(() => {
    const g = buildGraph(entities, prevPosRef.current)
    // Snapshot the new positions for the NEXT build.
    const snap: Record<string, { x: number; y: number; vx: number; vy: number }> =
      {}
    for (const n of g.nodes) snap[n.id] = { x: n.x, y: n.y, vx: n.vx, vy: n.vy }
    prevPosRef.current = snap
    return g
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entities])

  // Keep the live sim positions written back to the snapshot so subsequent
  // rebuilds (after edits) keep the layout stable. Run on a low cadence.
  useEffect(() => {
    const id = window.setInterval(() => {
      for (const n of graph.nodes) {
        prevPosRef.current[n.id] = { x: n.x, y: n.y, vx: n.vx, vy: n.vy }
      }
    }, 250)
    return () => window.clearInterval(id)
  }, [graph.nodes])

  /* ─── Mutations ─── */

  function addChild(parentId: string | null) {
    const id = uid()
    const siblings = childrenOf(entities, parentId)
    const label = `New entity ${siblings.length + 1}`
    setEntities((prev) => ({
      ...prev,
      [id]: { id, label, parentId, links: [] },
    }))
    setSelectedId(id)
  }

  function rename(id: string, label: string) {
    setEntities((prev) => ({ ...prev, [id]: { ...prev[id], label } }))
  }

  function deleteEntity(id: string) {
    setEntities((prev) => {
      // Collect the entity + all descendants.
      const toRemove = new Set<string>([id])
      let grew = true
      while (grew) {
        grew = false
        for (const e of Object.values(prev)) {
          if (
            e.parentId &&
            toRemove.has(e.parentId) &&
            !toRemove.has(e.id)
          ) {
            toRemove.add(e.id)
            grew = true
          }
        }
      }
      const next: EntityMap = {}
      for (const e of Object.values(prev)) {
        if (toRemove.has(e.id)) continue
        // Also strip any links pointing at the removed entities.
        next[e.id] = {
          ...e,
          links: e.links.filter((l) => !toRemove.has(l)),
        }
      }
      return next
    })
    if (selectedId && (id === selectedId || !entities[selectedId])) {
      setSelectedId(null)
    }
  }

  function toggleLink(a: string, b: string) {
    setEntities((prev) => {
      const next = { ...prev }
      const entA = next[a]
      const entB = next[b]
      if (!entA || !entB) return prev
      // Treat the link as undirected. If either side has it, remove from both;
      // otherwise add it on side A.
      const hasA = entA.links.includes(b)
      const hasB = entB.links.includes(a)
      if (hasA || hasB) {
        next[a] = { ...entA, links: entA.links.filter((x) => x !== b) }
        next[b] = { ...entB, links: entB.links.filter((x) => x !== a) }
      } else {
        next[a] = { ...entA, links: [...entA.links, b] }
      }
      return next
    })
  }

  function reset() {
    prevPosRef.current = {}
    setEntities(seedEntities())
    setSelectedId(null)
  }

  return (
    <div
      className="dark fixed inset-0 grid bg-[#181818] text-zinc-200"
      style={{ gridTemplateColumns: "280px 1fr" }}
    >
      <aside className="border-r border-zinc-800/80 bg-[#1e1e1e]">
        <Sidebar
          entities={entities}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onAddChild={addChild}
          onRename={rename}
          onDelete={deleteEntity}
          onToggleLink={toggleLink}
          onReset={reset}
        />
      </aside>
      <section>
        <GraphCanvas
          nodes={graph.nodes}
          edges={graph.edges}
          adjacency={graph.adjacency}
          selectedId={selectedId}
          onSelectNode={setSelectedId}
          onClearSelection={() => setSelectedId(null)}
          nodeCount={graph.leafIds.length}
        />
      </section>
    </div>
  )
}
