'use client'

import { useState, useRef, useEffect, Fragment, type ReactNode, type MouseEvent as RMouseEvent, type TouchEvent as RTouchEvent } from 'react'
import { ChevronDown, Menu, Trash2, X } from 'lucide-react'

// ─── Constants ───────────────────────────────────────────────────────────────

const MAP_PX    = 2000
const MIN_SCALE = 0.18
const MAX_SCALE = 6
const DRAG_THR  = 5

const MAPS = [
  { id: 'kambori',   name: 'KAMBORI',   size: '2000×2000 m' },
  { id: 'altamont',  name: 'ALTAMONT',  size: '3000×3000 m' },
  { id: 'ridgeline', name: 'RIDGELINE', size: '4000×4000 m' },
  { id: 'sector-7',  name: 'SECTOR 7',  size: '2500×2500 m' },
]

interface ToolDef {
  id: string
  label: string
  team: 'friendly' | 'enemy' | 'neutral'
  category: 'unit' | 'marker'
}

interface Placed {
  id: string
  toolId: string
  x: number
  y: number
  label: string
}

interface TF { x: number; y: number; scale: number }

const UNITS: ToolDef[] = [
  { id: 'rng-sqd', label: 'Ranger Squad',   team: 'friendly', category: 'unit' },
  { id: 'chalk-a', label: 'Chalk Alpha',     team: 'friendly', category: 'unit' },
  { id: 'chalk-b', label: 'Chalk Bravo',     team: 'friendly', category: 'unit' },
  { id: 'cmd',     label: 'Command Element', team: 'friendly', category: 'unit' },
  { id: 'wpns',    label: 'Weapons Team',    team: 'friendly', category: 'unit' },
  { id: 'enemy',   label: 'Enemy Element',   team: 'enemy',    category: 'unit' },
]

const PLANNER_MARKERS: ToolDef[] = [
  { id: 'orp',   label: 'ORP',         team: 'neutral', category: 'marker' },
  { id: 'obj',   label: 'Objective',   team: 'neutral', category: 'marker' },
  { id: 'nogo',  label: 'No-Go Area',  team: 'neutral', category: 'marker' },
  { id: 'infil', label: 'INFIL Point', team: 'neutral', category: 'marker' },
  { id: 'exfil', label: 'EXFIL Point', team: 'neutral', category: 'marker' },
  { id: 'ccp',   label: 'CCP',         team: 'neutral', category: 'marker' },
]

const ALL_TOOLS = [...UNITS, ...PLANNER_MARKERS]

// ─── SVG Icons (NATO-inspired) ────────────────────────────────────────────────

const IC = {
  blue:   '#60a5fa',
  red:    '#f87171',
  lime:   '#a3e635',
  green:  '#4ade80',
  orange: '#fb923c',
  white:  '#f1f5f9',
}

function ToolIcon({ id, size = 32 }: { id: string; size?: number }) {
  const s  = size
  const rh = Math.round(s * 0.68)

  const InfBox = ({ children }: { children?: ReactNode }) => (
    <svg width={s} height={rh} viewBox="0 0 40 27" fill="none">
      <rect x="1.5" y="2" width="37" height="23" stroke={IC.blue} strokeWidth="2.5" />
      {children}
      <circle cx="20" cy="2" r="3.5" fill={IC.blue} />
    </svg>
  )

  switch (id) {
    case 'rng-sqd': return (
      <InfBox>
        <line x1="1.5" y1="2" x2="38.5" y2="25" stroke={IC.blue} strokeWidth="2" />
        <line x1="38.5" y1="2" x2="1.5" y2="25" stroke={IC.blue} strokeWidth="2" />
      </InfBox>
    )
    case 'chalk-a': return (
      <InfBox>
        <text x="20" y="19" textAnchor="middle" fill={IC.blue} fontSize="14" fontFamily="monospace" fontWeight="bold">A</text>
      </InfBox>
    )
    case 'chalk-b': return (
      <InfBox>
        <text x="20" y="19" textAnchor="middle" fill={IC.blue} fontSize="14" fontFamily="monospace" fontWeight="bold">B</text>
      </InfBox>
    )
    case 'cmd': return (
      <InfBox>
        <text x="20" y="18" textAnchor="middle" fill={IC.blue} fontSize="10" fontFamily="monospace" fontWeight="bold">CMD</text>
      </InfBox>
    )
    case 'wpns': return (
      <InfBox>
        <text x="20" y="18" textAnchor="middle" fill={IC.blue} fontSize="10" fontFamily="monospace" fontWeight="bold">WPN</text>
      </InfBox>
    )
    case 'enemy': return (
      <svg width={s} height={s} viewBox="0 0 40 40" fill="none">
        <path d="M20 3 L37 20 L20 37 L3 20 Z" stroke={IC.red} strokeWidth="2.5" />
        <circle cx="20" cy="3" r="3.5" fill={IC.red} />
      </svg>
    )
    case 'orp': return (
      <svg width={s} height={s} viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="15" stroke={IC.blue} strokeWidth="2.5" />
        <circle cx="20" cy="20" r="5" fill={IC.blue} />
      </svg>
    )
    case 'obj': return (
      <svg width={s} height={s} viewBox="0 0 40 40" fill="none">
        <path d="M20 4 L36 20 L20 36 L4 20 Z" stroke={IC.lime} strokeWidth="2.5" />
        <line x1="20" y1="4" x2="20" y2="36" stroke={IC.lime} strokeWidth="1.5" />
        <line x1="4"  y1="20" x2="36" y2="20" stroke={IC.lime} strokeWidth="1.5" />
      </svg>
    )
    case 'nogo': return (
      <svg width={s} height={s} viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="15" stroke={IC.orange} strokeWidth="2.5" />
        <line x1="9.4" y1="9.4" x2="30.6" y2="30.6" stroke={IC.orange} strokeWidth="2.5" />
      </svg>
    )
    case 'infil': return (
      <svg width={s} height={s} viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="6" r="4" fill={IC.green} />
        <line x1="20" y1="6" x2="20" y2="30" stroke={IC.green} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M11 22 L20 31 L29 22" stroke={IC.green} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
    case 'exfil': return (
      <svg width={s} height={s} viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="34" r="4" fill={IC.green} />
        <line x1="20" y1="34" x2="20" y2="10" stroke={IC.green} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M11 18 L20 9 L29 18" stroke={IC.green} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
    case 'ccp': return (
      <svg width={s} height={s} viewBox="0 0 40 40" fill="none">
        <rect x="4" y="4" width="32" height="32" rx="3" stroke={IC.white} strokeWidth="2" />
        <line x1="20" y1="11" x2="20" y2="29" stroke={IC.white} strokeWidth="3.5" strokeLinecap="round" />
        <line x1="11" y1="20" x2="29" y2="20" stroke={IC.white} strokeWidth="3.5" strokeLinecap="round" />
      </svg>
    )
    default: return <div style={{ width: s, height: s, background: '#555', borderRadius: '50%' }} />
  }
}

// ─── Sidebar Row ──────────────────────────────────────────────────────────────

function ToolRow({ def, selected, onClick }: { key?: string; def: ToolDef; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 w-full px-3 py-2.5 text-left text-sm font-bold transition-all ${
        selected
          ? 'border border-[#a3e635] bg-[#a3e635]/10 text-[#a3e635]'
          : 'border border-transparent hover:bg-[#192019] text-[#c8c8a0]'
      }`}
    >
      <span className="shrink-0 flex items-center justify-center w-9">
        <ToolIcon id={def.id} size={32} />
      </span>
      {def.label}
    </button>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PlannerClient() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mapId,       setMapId]       = useState('kambori')
  const [mapDrop,     setMapDrop]     = useState(false)
  const [tool,        setTool]        = useState<string | null>(null)
  const [markerSize,  setMarkerSize]  = useState(100)
  const [placed,      setPlaced]      = useState<Placed[]>([])
  const [tf,          setTf]          = useState<TF>({ x: 0, y: 0, scale: 0.35 })
  const [popupId,     setPopupId]     = useState<string | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)
  const tfRef        = useRef<TF>(tf)
  const toolRef      = useRef<string | null>(null)
  const popupIdRef   = useRef<string | null>(null)
  const dragRef      = useRef({ active: false, sx: 0, sy: 0, moved: false })
  const pinchRef     = useRef<{ dist: number; mx: number; my: number } | null>(null)
  const touchMoved   = useRef(false)

  useEffect(() => { tfRef.current     = tf },      [tf])
  useEffect(() => { toolRef.current   = tool },    [tool])
  useEffect(() => { popupIdRef.current = popupId }, [popupId])

  // Center map on first mount
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const { width, height } = el.getBoundingClientRect()
    const scale = Math.min(width, height) / MAP_PX * 0.85
    const init: TF = {
      x: (width  - MAP_PX * scale) / 2,
      y: (height - MAP_PX * scale) / 2,
      scale,
    }
    setTf(init)
    tfRef.current = init
  }, [])

  // Wheel zoom (non-passive)
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const handler = (e: WheelEvent) => {
      e.preventDefault()
      const rect = el.getBoundingClientRect()
      const mx = e.clientX - rect.left
      const my = e.clientY - rect.top
      const factor = e.deltaY < 0 ? 1.1 : 1 / 1.1
      setTf(prev => {
        const s = Math.max(MIN_SCALE, Math.min(MAX_SCALE, prev.scale * factor))
        const r = s / prev.scale
        return { x: mx - (mx - prev.x) * r, y: my - (my - prev.y) * r, scale: s }
      })
    }
    el.addEventListener('wheel', handler, { passive: false })
    return () => el.removeEventListener('wheel', handler)
  }, [])

  // Prevent native touch scroll / zoom on map
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const stop = (e: TouchEvent) => e.preventDefault()
    el.addEventListener('touchmove', stop, { passive: false })
    return () => el.removeEventListener('touchmove', stop)
  }, [])

  // ESC cancels active tool
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setTool(null); setPopupId(null) }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // ── Helpers ────────────────────────────────────────────────────────────────

  function placeAt(clientX: number, clientY: number) {
    const currentTool = toolRef.current
    if (!currentTool) return
    const rect = containerRef.current!.getBoundingClientRect()
    const { x: tx, y: ty, scale } = tfRef.current
    const nx = (clientX - rect.left - tx) / scale / MAP_PX
    const ny = (clientY - rect.top  - ty) / scale / MAP_PX
    if (nx < 0 || nx > 1 || ny < 0 || ny > 1) return
    const def = ALL_TOOLS.find(t => t.id === currentTool)!
    setPlaced(prev => [
      ...prev,
      { id: crypto.randomUUID(), toolId: currentTool, x: nx, y: ny, label: def.label },
    ])
  }

  // ── Mouse events ───────────────────────────────────────────────────────────

  function onMouseDown(e: RMouseEvent) {
    if (e.button !== 0) return
    dragRef.current = { active: true, sx: e.clientX, sy: e.clientY, moved: false }
  }

  function onMouseMove(e: RMouseEvent) {
    if (!dragRef.current.active) return
    const dx = e.clientX - dragRef.current.sx
    const dy = e.clientY - dragRef.current.sy
    if (!dragRef.current.moved && (Math.abs(dx) > DRAG_THR || Math.abs(dy) > DRAG_THR)) {
      dragRef.current.moved = true
    }
    if (dragRef.current.moved) {
      dragRef.current.sx = e.clientX
      dragRef.current.sy = e.clientY
      setTf(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }))
    }
  }

  function onMouseUp(e: RMouseEvent) {
    const wasDrag = dragRef.current.moved
    dragRef.current = { active: false, sx: 0, sy: 0, moved: false }
    if (wasDrag) return
    if (popupIdRef.current) { setPopupId(null); return }
    placeAt(e.clientX, e.clientY)
  }

  function onMouseLeave() { dragRef.current.active = false }

  // ── Touch events ───────────────────────────────────────────────────────────

  function onTouchStart(e: RTouchEvent) {
    if (e.touches.length === 2) {
      const t0 = e.touches[0], t1 = e.touches[1]
      pinchRef.current = {
        dist: Math.hypot(t1.clientX - t0.clientX, t1.clientY - t0.clientY),
        mx: (t0.clientX + t1.clientX) / 2,
        my: (t0.clientY + t1.clientY) / 2,
      }
      touchMoved.current = true
    } else if (e.touches.length === 1) {
      pinchRef.current = null
      dragRef.current = { active: true, sx: e.touches[0].clientX, sy: e.touches[0].clientY, moved: false }
      touchMoved.current = false
    }
  }

  function onTouchMove(e: RTouchEvent) {
    if (e.touches.length === 2 && pinchRef.current) {
      const t0 = e.touches[0], t1 = e.touches[1]
      const dist  = Math.hypot(t1.clientX - t0.clientX, t1.clientY - t0.clientY)
      const mx    = (t0.clientX + t1.clientX) / 2
      const my    = (t0.clientY + t1.clientY) / 2
      const factor = dist / pinchRef.current.dist
      const rect   = containerRef.current!.getBoundingClientRect()
      const lx = mx - rect.left
      const ly = my - rect.top
      setTf(prev => {
        const s = Math.max(MIN_SCALE, Math.min(MAX_SCALE, prev.scale * factor))
        const r = s / prev.scale
        return { x: lx - (lx - prev.x) * r, y: ly - (ly - prev.y) * r, scale: s }
      })
      pinchRef.current = { dist, mx, my }
    } else if (e.touches.length === 1 && dragRef.current.active) {
      const dx = e.touches[0].clientX - dragRef.current.sx
      const dy = e.touches[0].clientY - dragRef.current.sy
      if (!dragRef.current.moved && (Math.abs(dx) > DRAG_THR || Math.abs(dy) > DRAG_THR)) {
        dragRef.current.moved = true
        touchMoved.current    = true
      }
      if (dragRef.current.moved) {
        dragRef.current.sx = e.touches[0].clientX
        dragRef.current.sy = e.touches[0].clientY
        setTf(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }))
      }
    }
  }

  function onTouchEnd(e: RTouchEvent) {
    const wasDrag = touchMoved.current
    dragRef.current  = { active: false, sx: 0, sy: 0, moved: false }
    pinchRef.current = null
    if (wasDrag) return
    if (popupIdRef.current) { setPopupId(null); return }
    const touch = e.changedTouches[0]
    placeAt(touch.clientX, touch.clientY)
  }

  // ── Derived ────────────────────────────────────────────────────────────────

  const currentMap = MAPS.find(m => m.id === mapId)!
  const iconPx     = Math.round(40 * markerSize / 100)

  // Grid coordinate labels (every 200px major line, 10 divisions)
  const gridLabels = Array.from({ length: 11 }, (_, i) => i)

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div
      className="fixed inset-0 flex overflow-hidden bg-black text-[#c8c8a0] z-10"
      style={{ top: '66px', fontFamily: '"Courier New", Courier, monospace' }}
    >

      {/* ═══ SIDEBAR ═══════════════════════════════════════════════════════ */}
      {sidebarOpen && (
        <aside className="w-72 shrink-0 flex flex-col overflow-y-auto bg-[#0b110b] border-r border-[#1c281c]">

          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-[#1c281c]">
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1.5 border border-[#a3e635] text-[#a3e635] hover:bg-[#a3e635]/10 transition-colors shrink-0"
            >
              <Menu className="w-4 h-4" />
            </button>
            <span className="font-black text-[#a3e635] tracking-[0.2em] text-sm uppercase">
              RANGER PLANNER
            </span>
          </div>

          {/* Map selector */}
          <div className="px-4 py-4 border-b border-[#1c281c] relative">
            <p className="text-[9px] font-black tracking-[0.3em] uppercase text-[#5a6a4a] mb-2">MAP</p>
            <button
              onClick={() => setMapDrop(v => !v)}
              className="flex items-center gap-2 mb-0.5"
            >
              <span className="text-[#a3e635] font-black text-xl tracking-widest uppercase">
                {currentMap.name}
              </span>
              <ChevronDown className={`w-4 h-4 text-[#a3e635] transition-transform ${mapDrop ? 'rotate-180' : ''}`} />
            </button>
            <p className="text-[#4a5a3a] text-xs">{currentMap.size}</p>

            {mapDrop && (
              <div className="absolute left-4 right-4 top-full mt-1 bg-[#0b110b] border border-[#a3e635]/30 z-40 shadow-2xl">
                {MAPS.map(m => (
                  <button
                    key={m.id}
                    onClick={() => { setMapId(m.id); setMapDrop(false); setPlaced([]); setPopupId(null) }}
                    className="w-full text-left px-3 py-2.5 hover:bg-[#192019] transition-colors"
                  >
                    <span className="text-[#c8c8a0] text-sm font-bold">{m.name}</span>
                    <span className="text-[#4a5a3a] text-xs ml-2">{m.size}</span>
                  </button>
                ))}
              </div>
            )}

            <div className="mt-3 space-y-1 text-[11px] text-[#4a5a3a] leading-relaxed">
              <p>
                Pick a unit or marker, then click the map to place it.{' '}
                <span className="text-[#60a5fa]">Friendly</span> units are blue,{' '}
                <span className="text-[#f87171]">enemy</span> red.
              </p>
              <p>Click a placed marker to edit or remove it. Drag to pan, scroll to zoom.</p>
            </div>
          </div>

          {/* Display */}
          <div className="px-4 py-4 border-b border-[#1c281c]">
            <p className="text-[9px] font-black tracking-[0.3em] uppercase text-[#a3e635] mb-3">DISPLAY</p>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-[#c8c8a0]">Marker size</span>
              <span className="text-[#c8c8a0]">{markerSize}%</span>
            </div>
            <input
              type="range"
              min={40} max={160} step={10}
              value={markerSize}
              onChange={e => setMarkerSize(Number(e.target.value))}
              className="w-full"
              style={{ accentColor: '#a3e635' }}
            />
          </div>

          {/* Units */}
          <div className="px-4 py-4 border-b border-[#1c281c]">
            <p className="text-[9px] font-black tracking-[0.3em] uppercase text-[#a3e635] mb-3">UNITS</p>
            <div className="space-y-0.5">
              {UNITS.map(u => (
                <ToolRow
                  key={u.id}
                  def={u}
                  selected={tool === u.id}
                  onClick={() => { setTool(tool === u.id ? null : u.id); setPopupId(null) }}
                />
              ))}
            </div>
          </div>

          {/* Markers */}
          <div className="px-4 py-4 flex-1">
            <p className="text-[9px] font-black tracking-[0.3em] uppercase text-[#a3e635] mb-3">MARKERS</p>
            <div className="space-y-0.5">
              {PLANNER_MARKERS.map(m => (
                <ToolRow
                  key={m.id}
                  def={m}
                  selected={tool === m.id}
                  onClick={() => { setTool(tool === m.id ? null : m.id); setPopupId(null) }}
                />
              ))}
            </div>

            {placed.length > 0 && (
              <button
                onClick={() => { setPlaced([]); setPopupId(null) }}
                className="mt-5 w-full flex items-center justify-center gap-2 px-3 py-2 border border-red-800/50 text-red-400 text-xs font-bold hover:bg-red-900/20 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear All ({placed.length})
              </button>
            )}
          </div>

        </aside>
      )}

      {/* ═══ MAP AREA ══════════════════════════════════════════════════════ */}
      <div
        ref={containerRef}
        className="flex-1 relative overflow-hidden bg-black"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{ cursor: tool ? 'crosshair' : 'grab', userSelect: 'none', touchAction: 'none' }}
      >

        {/* Sidebar toggle (when closed) */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="absolute top-3 left-3 z-30 p-2 border border-[#a3e635] text-[#a3e635] bg-[#0b110b] hover:bg-[#a3e635]/10 transition-colors"
          >
            <Menu className="w-4 h-4" />
          </button>
        )}

        {/* ── Map layer ── */}
        <div
          style={{
            position: 'absolute',
            width:  `${MAP_PX}px`,
            height: `${MAP_PX}px`,
            transform: `translate(${tf.x}px, ${tf.y}px) scale(${tf.scale})`,
            transformOrigin: '0 0',
          }}
        >
          {/* Terrain background */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: '#9a8a68',
              backgroundImage: [
                'linear-gradient(rgba(0,0,0,0.22) 1px, transparent 1px)',
                'linear-gradient(90deg, rgba(0,0,0,0.22) 1px, transparent 1px)',
                'linear-gradient(rgba(0,0,0,0.07) 1px, transparent 1px)',
                'linear-gradient(90deg, rgba(0,0,0,0.07) 1px, transparent 1px)',
              ].join(', '),
              backgroundSize: '200px 200px, 200px 200px, 40px 40px, 40px 40px',
            }}
          />

          {/* Grid coordinate labels */}
          {gridLabels.map(i => (
            <Fragment key={i}>
              <span
                style={{
                  position: 'absolute',
                  left: `${i * 200 + 4}px`,
                  top: '4px',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  color: 'rgba(0,0,0,0.38)',
                  pointerEvents: 'none',
                  userSelect: 'none',
                  fontFamily: 'monospace',
                }}
              >
                {String(i).padStart(2, '0')}
              </span>
              <span
                style={{
                  position: 'absolute',
                  left: '4px',
                  top: `${i * 200 + 4}px`,
                  fontSize: '11px',
                  fontWeight: 'bold',
                  color: 'rgba(0,0,0,0.38)',
                  pointerEvents: 'none',
                  userSelect: 'none',
                  fontFamily: 'monospace',
                }}
              >
                {String(i).padStart(2, '0')}
              </span>
            </Fragment>
          ))}

          {/* Placed markers */}
          {placed.map(pm => {
            const isOpen = popupId === pm.id
            return (
              <div
                key={pm.id}
                style={{
                  position: 'absolute',
                  left: `${pm.x * MAP_PX}px`,
                  top:  `${pm.y * MAP_PX}px`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: isOpen ? 20 : 10,
                  cursor: 'pointer',
                }}
                onClick={e => {
                  e.stopPropagation()
                  setPopupId(popupId === pm.id ? null : pm.id)
                }}
              >
                <ToolIcon id={pm.toolId} size={iconPx} />
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    marginTop: '3px',
                    whiteSpace: 'nowrap',
                    fontSize: `${Math.max(9, Math.round(11 * markerSize / 100))}px`,
                    fontWeight: 'bold',
                    color: '#f1f5f9',
                    textShadow: '0 1px 4px #000, 0 0 8px #000',
                    pointerEvents: 'none',
                    userSelect: 'none',
                    fontFamily: 'monospace',
                  }}
                >
                  {pm.label}
                </div>
              </div>
            )
          })}
        </div>

        {/* ── Marker popup (screen-space, follows marker) ── */}
        {popupId && (() => {
          const pm = placed.find(p => p.id === popupId)
          if (!pm) return null
          const sx = pm.x * MAP_PX * tf.scale + tf.x
          const sy = pm.y * MAP_PX * tf.scale + tf.y
          const top = Math.max(90, sy - 96)
          return (
            <div
              style={{
                position: 'absolute',
                left: sx,
                top,
                transform: 'translateX(-50%)',
                zIndex: 50,
                minWidth: '168px',
              }}
              className="bg-[#0b110b] border border-[#a3e635] p-3 shadow-2xl"
              onClick={e => e.stopPropagation()}
              onMouseDown={e => e.stopPropagation()}
            >
              <p className="text-[9px] font-black tracking-widest uppercase text-[#5a6a4a] mb-1.5">
                Label
              </p>
              <input
                value={pm.label}
                onChange={e =>
                  setPlaced(prev =>
                    prev.map(p => p.id === popupId ? { ...p, label: e.target.value } : p)
                  )
                }
                onClick={e => e.stopPropagation()}
                className="w-full bg-[#0d1408] border border-[#1c281c] px-2 py-1 text-sm text-[#c8c8a0] outline-none focus:border-[#a3e635] mb-2"
                style={{ fontFamily: 'monospace' }}
              />
              <div className="flex gap-1.5">
                <button
                  onClick={() => { setPlaced(prev => prev.filter(p => p.id !== popupId)); setPopupId(null) }}
                  className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-red-900/20 border border-red-700/40 text-red-400 text-[11px] font-bold hover:bg-red-900/40 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  Remove
                </button>
                <button
                  onClick={() => setPopupId(null)}
                  className="px-2.5 py-1.5 border border-[#1c281c] text-[#5a6a4a] hover:border-[#a3e635] hover:text-[#a3e635] transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )
        })()}

        {/* ── Active tool hint bar ── */}
        {tool && (
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 pointer-events-none z-20">
            <div
              className="bg-[#0b110b]/90 border border-[#a3e635]/50 px-4 py-2 text-xs font-black tracking-widest uppercase text-[#a3e635] whitespace-nowrap"
            >
              PLACING: {ALL_TOOLS.find(t => t.id === tool)?.label} &nbsp;·&nbsp; ESC to cancel
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
