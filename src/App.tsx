import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  Compass,
  Cpu,
  GitBranch,
  Pause,
  Play,
  RotateCcw,
  SkipBack,
  SkipForward,
  Sparkles,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { WorkbenchShell, decodeHashState, type ExportBundle, type PaletteAction } from "./components/WorkbenchShell";
import {
  ALGO_SCENARIOS,
  CURRICULUM_TRACKS,
  DEVELOPER_PRESETS,
  SKILL_AXES,
  analyzeSkillGap,
  computeBigOAt,
  type MasteryStatus,
} from "./core/learnGraphEngine";

type ModeId = "dag" | "gap" | "algo";

const STORAGE_KEY = "learn-graph-mastery-v1";

function loadMastery(): Record<string, MasteryStatus> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Record<string, MasteryStatus>;
  } catch {
    /* ignore */
  }
  return { "net-http": "mastered", "ts-runtime": "mastered", "algo-ds": "learning", "cs-intro": "mastered", "byo-shell": "mastered" };
}

export default function App() {
  const initial = useMemo(
    () => decodeHashState<{ mode: ModeId; trackId: string; algoId: string; nVal: number }>(),
    []
  );

  const [mode, setMode] = useState<ModeId>(initial?.mode ?? "dag");
  const [trackId, setTrackId] = useState<string>(initial?.trackId ?? CURRICULUM_TRACKS[0].id);
  const [mastery, setMastery] = useState<Record<string, MasteryStatus>>(loadMastery);
  const [selectedNodeId, setSelectedNodeId] = useState<string>("sql-storage");
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragState, setDragState] = useState<{ startX: number; startY: number; origX: number; origY: number } | null>(null);

  // Mode 2: Skill-Gap Scanner
  const [stackInput, setStackInput] = useState(DEVELOPER_PRESETS[0].stackText);

  // Mode 3: Algorithm & Big-O Lab
  const [algoId, setAlgoId] = useState<string>(initial?.algoId ?? ALGO_SCENARIOS[0].id);
  const [frameIdx, setFrameIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [bigON, setBigON] = useState<number>(initial?.nVal ?? 18);

  const track = useMemo(() => CURRICULUM_TRACKS.find((t) => t.id === trackId) ?? CURRICULUM_TRACKS[0], [trackId]);
  const selectedNode = useMemo(
    () => track.nodes.find((n) => n.id === selectedNodeId) ?? track.nodes[0],
    [track, selectedNodeId]
  );

  const gapReport = useMemo(() => analyzeSkillGap(stackInput, track.id), [stackInput, track.id]);
  const algo = useMemo(() => ALGO_SCENARIOS.find((a) => a.id === algoId) ?? ALGO_SCENARIOS[0], [algoId]);
  const currentFrame = algo.frames[Math.min(frameIdx, algo.frames.length - 1)];
  const bigOStats = useMemo(() => computeBigOAt(bigON), [bigON]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mastery));
    } catch {
      /* ignore */
    }
  }, [mastery]);

  useEffect(() => {
    setFrameIdx(0);
    setPlaying(false);
  }, [algoId]);

  useEffect(() => {
    if (!playing || mode !== "algo") return;
    const timer = setInterval(() => {
      setFrameIdx((idx) => {
        if (idx >= algo.frames.length - 1) {
          setPlaying(false);
          return idx;
        }
        return idx + 1;
      });
    }, 850);
    return () => clearInterval(timer);
  }, [playing, mode, algo.frames.length]);

  const cycleMastery = (nodeId: string) => {
    setMastery((prev) => {
      const cur = prev[nodeId] ?? "todo";
      const next: MasteryStatus = cur === "todo" ? "learning" : cur === "learning" ? "mastered" : "todo";
      return { ...prev, [nodeId]: next };
    });
  };

  const trackStats = useMemo(() => {
    const masteredNodes = track.nodes.filter((n) => mastery[n.id] === "mastered");
    const totalHours = track.nodes.reduce((a, b) => a + b.hours, 0);
    const doneHours = masteredNodes.reduce((a, b) => a + b.hours, 0);
    return {
      masteredCount: masteredNodes.length,
      totalCount: track.nodes.length,
      pct: Math.round((masteredNodes.length / track.nodes.length) * 100),
      remainingHours: totalHours - doneHours,
    };
  }, [track, mastery]);

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const stepAlgo = (dir: -1 | 1) => {
    if (mode !== "algo") return;
    setFrameIdx((i) => Math.max(0, Math.min(algo.frames.length - 1, i + dir)));
  };

  const renderDagSvgString = () => {
    const edges = track.nodes
      .flatMap((n) =>
        n.prereqs.map((pId) => {
          const src = track.nodes.find((x) => x.id === pId);
          if (!src) return "";
          const x1 = src.x + 150;
          const y1 = src.y + 34;
          const x2 = n.x;
          const y2 = n.y + 34;
          const cx = (x1 + x2) / 2;
          return `<path d="M ${x1} ${y1} C ${cx} ${y1}, ${cx} ${y2}, ${x2} ${y2}" fill="none" stroke="#334155" stroke-width="2" />`;
        })
      )
      .join("");
    const nodes = track.nodes
      .map((n) => {
        const st = mastery[n.id] ?? "todo";
        const stroke = st === "mastered" ? "#10B981" : st === "learning" ? "#F59E0B" : "#38BDF8";
        return `<g transform="translate(${n.x},${n.y})">
          <rect width="150" height="68" rx="10" fill="#0F172A" stroke="${stroke}" stroke-width="2"/>
          <text x="12" y="26" fill="#F8FAFC" font-family="Inter,sans-serif" font-size="12" font-weight="700">${n.shortLabel}</text>
          <text x="12" y="46" fill="#94A3B8" font-family="JetBrains Mono,monospace" font-size="10">${n.hours}h · ${st.toUpperCase()}</text>
        </g>`;
      })
      .join("");
    return `<svg xmlns="http://www.w3.org/2000/svg" width="1060" height="580" viewBox="0 0 1060 580"><rect width="1060" height="580" fill="#070B14"/>${edges}${nodes}</svg>`;
  };

  const exportBundle: ExportBundle = {
    filenameBase: `learn-graph-${track.id}`,
    svg: renderDagSvgString,
    markdown: () =>
      [
        `# learn-graph Curriculum & Skill-Gap Report`,
        ``,
        `- **Active Track:** ${track.name} (\`${track.ecosystem}\`)`,
        `- **Progress:** ${trackStats.masteredCount}/${trackStats.totalCount} mastered (${trackStats.pct}%, ${trackStats.remainingHours}h remaining)`,
        `- **Readiness Score:** ${gapReport.readinessPct}% (Strongest: ${gapReport.strongestAxis} · Gap: ${gapReport.weakestAxis})`,
        ``,
        `## Highest-Leverage Next Builds`,
        ...gapReport.recommendedNodes.map(
          (r, idx) => `${idx + 1}. **${r.node.label}** (${r.node.hours}h) — ${r.reason}`
        ),
      ].join("\n"),
    json: () => ({ trackId: track.id, mastery, trackStats, gapReport, bigOStats }),
    codeLabel: "Study Plan Checklist (.md)",
    codeExt: "md",
    code: () =>
      track.nodes
        .map((n) => `- [${mastery[n.id] === "mastered" ? "x" : " "}] **${n.label}** (${n.hours}h) — Deliverable: ${n.deliverable}`)
        .join("\n"),
  };

  const paletteActions: PaletteAction[] = [
    ...CURRICULUM_TRACKS.map((t) => ({
      id: `track-${t.id}`,
      label: `Load Track: ${t.name}`,
      group: "Tracks",
      run: () => {
        setTrackId(t.id);
        setSelectedNodeId(t.nodes[0].id);
        setMode("dag");
      },
    })),
    ...DEVELOPER_PRESETS.map((p) => ({
      id: `preset-${p.id}`,
      label: `Scan Profile: ${p.label}`,
      group: "Skill Gap",
      run: () => {
        setStackInput(p.stackText);
        setMode("gap");
      },
    })),
    ...ALGO_SCENARIOS.map((a) => ({
      id: `algo-${a.id}`,
      label: `Simulate ${a.name}`,
      group: "Algo Lab",
      run: () => {
        setAlgoId(a.id);
        setMode("algo");
      },
    })),
  ];

  // Radar polygon geometry
  const radarCenter = 135;
  const radarRadius = 92;
  const radarPoints = SKILL_AXES.map((axis, idx) => {
    const angle = (Math.PI * 2 * idx) / SKILL_AXES.length - Math.PI / 2;
    const val = gapReport.radar[axis] / 100;
    return {
      axis,
      score: gapReport.radar[axis],
      x: radarCenter + Math.cos(angle) * radarRadius * val,
      y: radarCenter + Math.sin(angle) * radarRadius * val,
      lx: radarCenter + Math.cos(angle) * (radarRadius + 24),
      ly: radarCenter + Math.sin(angle) * (radarRadius + 24),
      gx: radarCenter + Math.cos(angle) * radarRadius,
      gy: radarCenter + Math.sin(angle) * radarRadius,
    };
  });

  return (
    <WorkbenchShell
      name="learn-graph"
      subtitle="Curriculum DAG · Repo Skill-Gap Scanner · Algorithm & Big-O Lab"
      badge="EDU + MV3"
      accentHex="#8B5CF6"
      icon={<GitBranch className="h-4 w-4" />}
      modes={[
        { id: "dag", label: "Curriculum DAG", shortKey: "1" },
        { id: "gap", label: "Skill-Gap Scanner", shortKey: "2" },
        { id: "algo", label: "Algo & Big-O Lab", shortKey: "3" },
      ]}
      activeMode={mode}
      onModeChange={(id) => setMode(id as ModeId)}
      actions={paletteActions}
      exportBundle={exportBundle}
      getShareState={() => ({ mode, trackId, algoId, nVal: bigON })}
      onResetView={resetView}
      onTogglePlay={() => mode === "algo" && setPlaying((p) => !p)}
      onStep={stepAlgo}
      headerExtra={
        <div className="hidden items-center gap-2 rounded-lg border border-[#1E293B] bg-[#070B14] px-2.5 py-1 font-mono text-[11px] lg:flex">
          <span className="text-violet-400">{trackStats.pct}% mastered</span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-400">{trackStats.remainingHours}h left</span>
        </div>
      }
    >
      {mode === "dag" && (
        <div className="flex flex-1 overflow-hidden">
          <div className="flex flex-1 flex-col overflow-hidden">
            {/* Track selector bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1E293B] bg-[#0B1120] px-4 py-2">
              <div className="flex flex-wrap items-center gap-1.5">
                {CURRICULUM_TRACKS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      setTrackId(t.id);
                      setSelectedNodeId(t.nodes[0].id);
                    }}
                    className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition ${
                      track.id === t.id
                        ? "border-violet-500/60 bg-violet-500/15 text-violet-200"
                        : "border-[#1E293B] bg-[#070B14] text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-1.5 font-mono text-xs">
                <button type="button" onClick={() => setZoom((z) => Math.max(0.65, Number((z - 0.1).toFixed(2))))} className="rounded border border-[#1E293B] bg-[#070B14] p-1 text-slate-300 hover:border-slate-500"><ZoomOut className="h-3.5 w-3.5" /></button>
                <span className="w-11 text-center text-[11px] text-slate-400">{Math.round(zoom * 100)}%</span>
                <button type="button" onClick={() => setZoom((z) => Math.min(1.45, Number((z + 0.1).toFixed(2))))} className="rounded border border-[#1E293B] bg-[#070B14] p-1 text-slate-300 hover:border-slate-500"><ZoomIn className="h-3.5 w-3.5" /></button>
                <button type="button" onClick={resetView} className="rounded border border-[#1E293B] bg-[#070B14] p-1 text-slate-300 hover:border-slate-500" title="Reset View (R)"><RotateCcw className="h-3.5 w-3.5" /></button>
              </div>
            </div>

            {/* Interactive SVG DAG Canvas */}
            <div
              className="relative flex-1 cursor-grab overflow-hidden bg-[#070B14] active:cursor-grabbing"
              onMouseDown={(e) => setDragState({ startX: e.clientX, startY: e.clientY, origX: pan.x, origY: pan.y })}
              onMouseMove={(e) => {
                if (!dragState) return;
                setPan({ x: dragState.origX + (e.clientX - dragState.startX), y: dragState.origY + (e.clientY - dragState.startY) });
              }}
              onMouseUp={() => setDragState(null)}
              onMouseLeave={() => setDragState(null)}
            >
              <svg className="h-full w-full" viewBox="0 0 1050 580">
                <defs>
                  <pattern id="lg-grid" width="32" height="32" patternUnits="userSpaceOnUse">
                    <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#1E293B" strokeOpacity="0.35" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="1050" height="580" fill="url(#lg-grid)" />
                <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
                  {track.nodes.map((node) =>
                    node.prereqs.map((pId) => {
                      const src = track.nodes.find((x) => x.id === pId);
                      if (!src) return null;
                      const x1 = src.x + 158;
                      const y1 = src.y + 38;
                      const x2 = node.x;
                      const y2 = node.y + 38;
                      const cx = (x1 + x2) / 2;
                      const isHot = hoveredNodeId === node.id || hoveredNodeId === pId || selectedNode.id === node.id;
                      const satisfied = mastery[pId] === "mastered";
                      return (
                        <path
                          key={`${pId}-${node.id}`}
                          d={`M ${x1} ${y1} C ${cx} ${y1}, ${cx} ${y2}, ${x2} ${y2}`}
                          fill="none"
                          stroke={isHot ? "#A78BFA" : satisfied ? "#10B981" : "#334155"}
                          strokeWidth={isHot ? 2.6 : 1.7}
                          strokeDasharray={satisfied ? undefined : "5 4"}
                          opacity={hoveredNodeId && !isHot ? 0.25 : 0.95}
                        />
                      );
                    })
                  )}
                  {track.nodes.map((node) => {
                    const st = mastery[node.id] ?? "todo";
                    const unlocked = node.prereqs.every((p) => mastery[p] === "mastered");
                    const isSelected = selectedNode.id === node.id;
                    const border =
                      st === "mastered" ? "#10B981" : st === "learning" ? "#F59E0B" : unlocked ? "#38BDF8" : "#334155";
                    return (
                      <g
                        key={node.id}
                        transform={`translate(${node.x}, ${node.y})`}
                        className="cursor-pointer"
                        onMouseEnter={() => setHoveredNodeId(node.id)}
                        onMouseLeave={() => setHoveredNodeId(null)}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedNodeId(node.id);
                        }}
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          cycleMastery(node.id);
                        }}
                      >
                        <rect
                          width="158"
                          height="76"
                          rx="12"
                          fill={isSelected ? "#131F38" : "#0F172A"}
                          stroke={isSelected ? "#A78BFA" : border}
                          strokeWidth={isSelected ? 2.4 : 1.5}
                        />
                        <circle cx="142" cy="16" r="5" fill={border} />
                        <text x="12" y="25" fill="#F8FAFC" fontSize="12" fontWeight="700">
                          {node.shortLabel}
                        </text>
                        <text x="12" y="43" fill="#94A3B8" fontSize="10" fontFamily="JetBrains Mono, monospace">
                          {node.category.split(" ")[0]} · {node.hours}h
                        </text>
                        <text x="12" y="62" fill={border} fontSize="9.5" fontFamily="JetBrains Mono, monospace" fontWeight="600">
                          {st === "mastered" ? "✓ MASTERED" : st === "learning" ? "● IN PROGRESS" : unlocked ? "→ UNLOCKED" : "🔒 PREREQS"}
                        </text>
                      </g>
                    );
                  })}
                </g>
              </svg>
              <div className="pointer-events-none absolute bottom-3 left-4 flex items-center gap-3 rounded-lg border border-[#1E293B] bg-[#0F172A]/90 px-3 py-1.5 font-mono text-[10px] text-slate-300 backdrop-blur">
                <span className="text-emerald-400">● Mastered</span>
                <span className="text-amber-400">● In Progress</span>
                <span className="text-sky-400">● Ready / Unlocked</span>
                <span className="text-slate-500">Double-click node to cycle status · Drag to pan</span>
              </div>
            </div>
          </div>

          {/* Right Node Inspector Drawer */}
          <aside className="w-80 shrink-0 overflow-y-auto border-l border-[#1E293B] bg-[#0F172A] p-4">
            <div className="flex items-center justify-between">
              <span className="rounded bg-violet-500/15 px-2 py-0.5 font-mono text-[10px] font-bold text-violet-300">
                {selectedNode.category}
              </span>
              <span className="font-mono text-[11px] text-slate-400">{selectedNode.hours}h · {selectedNode.difficulty}</span>
            </div>
            <h2 className="mt-2 text-sm font-bold text-slate-50">{selectedNode.label}</h2>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-300">{selectedNode.summary}</p>

            <button
              type="button"
              onClick={() => cycleMastery(selectedNode.id)}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/15 px-3 py-2 text-xs font-semibold text-emerald-200 hover:bg-emerald-500/25"
            >
              <CheckCircle2 className="h-4 w-4" />
              Status: {(mastery[selectedNode.id] ?? "todo").toUpperCase()} (Click to cycle)
            </button>

            <div className="mt-4 rounded-xl border border-[#1E293B] bg-[#070B14] p-3">
              <div className="font-mono text-[10px] uppercase tracking-wider text-cyan-400">Capstone Deliverable</div>
              <p className="mt-1 text-xs text-slate-200">{selectedNode.deliverable}</p>
            </div>

            <div className="mt-4">
              <div className="font-mono text-[10px] uppercase tracking-wider text-slate-400">Prerequisites ({selectedNode.prereqs.length})</div>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {selectedNode.prereqs.length === 0 ? (
                  <span className="text-xs text-emerald-400">Entry node — start immediately</span>
                ) : (
                  selectedNode.prereqs.map((pId) => {
                    const pNode = track.nodes.find((n) => n.id === pId);
                    return (
                      <button
                        key={pId}
                        type="button"
                        onClick={() => setSelectedNodeId(pId)}
                        className="rounded-md border border-[#1E293B] bg-[#070B14] px-2 py-1 font-mono text-[11px] text-slate-200 hover:border-violet-400"
                      >
                        {mastery[pId] === "mastered" ? "✓ " : "○ "}
                        {pNode?.shortLabel ?? pId}
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            <div className="mt-4">
              <div className="font-mono text-[10px] uppercase tracking-wider text-slate-400">Curated Resources</div>
              <div className="mt-1.5 space-y-1.5">
                {selectedNode.resources.map((r) => (
                  <div key={r.title} className="flex items-center justify-between rounded-lg border border-[#1E293B] bg-[#070B14] px-2.5 py-2 text-xs">
                    <span className="flex items-center gap-1.5 text-slate-200"><BookOpen className="h-3.5 w-3.5 text-violet-400" />{r.title}</span>
                    <span className="font-mono text-[10px] text-slate-500">{r.source}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      )}

      {mode === "gap" && (
        <div className="grid flex-1 grid-cols-1 gap-4 overflow-y-auto p-4 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-5">
            <div className="rounded-2xl border border-[#1E293B] bg-[#0F172A] p-4">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-sm font-bold text-slate-100">
                  <Compass className="h-4 w-4 text-violet-400" /> Repo & Stack Skill-Gap Input
                </h2>
                <span className="font-mono text-xs text-emerald-400">{gapReport.readinessPct}% readiness</span>
              </div>
              <p className="mt-1 text-xs text-slate-400">
                Paste your GitHub repo languages, `package.json` dependencies, or resume keywords to map coverage against {track.name}.
              </p>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {DEVELOPER_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setStackInput(p.stackText)}
                    className="rounded-md border border-[#1E293B] bg-[#070B14] px-2 py-1 text-[11px] text-slate-300 hover:border-violet-400"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              <textarea
                value={stackInput}
                onChange={(e) => setStackInput(e.target.value)}
                rows={4}
                className="mt-3 w-full rounded-xl border border-[#1E293B] bg-[#070B14] p-3 font-mono text-xs text-slate-100 focus:border-violet-500 focus:outline-none"
              />
              <div className="mt-3 flex flex-wrap gap-1.5">
                {gapReport.matchedKeywords.map((kw) => (
                  <span key={kw} className="rounded bg-emerald-500/15 px-2 py-0.5 font-mono text-[10px] text-emerald-300">
                    ✓ {kw}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-[#1E293B] bg-[#0F172A] p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">6-Axis Competency Radar</h3>
              <div className="mt-2 flex justify-center">
                <svg width="270" height="270" viewBox="0 0 270 270">
                  {[0.25, 0.5, 0.75, 1].map((r) => (
                    <circle key={r} cx={radarCenter} cy={radarCenter} r={radarRadius * r} fill="none" stroke="#1E293B" strokeDasharray="3 3" />
                  ))}
                  {radarPoints.map((p) => (
                    <line key={p.axis} x1={radarCenter} y1={radarCenter} x2={p.gx} y2={p.gy} stroke="#1E293B" />
                  ))}
                  <polygon
                    points={radarPoints.map((p) => `${p.x},${p.y}`).join(" ")}
                    fill="#8B5CF6"
                    fillOpacity="0.28"
                    stroke="#A78BFA"
                    strokeWidth="2"
                  />
                  {radarPoints.map((p) => (
                    <g key={p.axis}>
                      <circle cx={p.x} cy={p.y} r="4" fill="#38BDF8" />
                      <text x={p.lx} y={p.ly} textAnchor="middle" fill="#CBD5E1" fontSize="9.5" fontFamily="JetBrains Mono, monospace">
                        {p.axis.split(" ")[0]} ({p.score}%)
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
            </div>
          </div>

          <div className="space-y-4 lg:col-span-7">
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-[#1E293B] bg-[#0F172A] p-3.5">
                <div className="font-mono text-[10px] uppercase text-slate-400">Strongest Axis</div>
                <div className="mt-1 text-sm font-bold text-emerald-400">{gapReport.strongestAxis}</div>
              </div>
              <div className="rounded-xl border border-[#1E293B] bg-[#0F172A] p-3.5">
                <div className="font-mono text-[10px] uppercase text-slate-400">Primary Blind Spot</div>
                <div className="mt-1 text-sm font-bold text-rose-400">{gapReport.weakestAxis}</div>
              </div>
              <div className="rounded-xl border border-[#1E293B] bg-[#0F172A] p-3.5">
                <div className="font-mono text-[10px] uppercase text-slate-400">Matched Signals</div>
                <div className="mt-1 font-mono text-sm font-bold text-cyan-400">{gapReport.matchedKeywords.length} keywords</div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#1E293B] bg-[#0F172A] p-4">
              <h3 className="flex items-center gap-2 text-sm font-bold text-slate-100">
                <Sparkles className="h-4 w-4 text-amber-400" /> Highest-Leverage Next Builds
              </h3>
              <div className="mt-3 space-y-2.5">
                {gapReport.recommendedNodes.map((rec, idx) => (
                  <div key={rec.node.id} className="rounded-xl border border-[#1E293B] bg-[#070B14] p-3.5">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <span className="mr-2 font-mono text-xs text-violet-400">#{idx + 1}</span>
                        <span className="text-sm font-bold text-slate-100">{rec.node.label}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedNodeId(rec.node.id);
                          setMode("dag");
                        }}
                        className="rounded-md border border-violet-500/40 bg-violet-500/15 px-2.5 py-1 font-mono text-[11px] text-violet-200 hover:bg-violet-500/25"
                      >
                        Inspect in DAG →
                      </button>
                    </div>
                    <p className="mt-1.5 text-xs text-slate-300">{rec.reason}</p>
                    <div className="mt-2 flex items-center gap-3 font-mono text-[11px] text-slate-400">
                      <span>Est. {rec.node.hours}h</span>
                      <span>·</span>
                      <span>Unlocks {rec.downstreamUnlocks} nodes</span>
                      <span>·</span>
                      <span className="text-cyan-300">{rec.node.deliverable}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {mode === "algo" && (
        <div className="grid flex-1 grid-cols-1 gap-4 overflow-y-auto p-4 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-7">
            <div className="rounded-2xl border border-[#1E293B] bg-[#0F172A] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap gap-1.5">
                  {ALGO_SCENARIOS.map((a) => (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => setAlgoId(a.id)}
                      className={`rounded-lg border px-2.5 py-1 text-xs font-medium ${
                        algo.id === a.id
                          ? "border-cyan-500/60 bg-cyan-500/15 text-cyan-200"
                          : "border-[#1E293B] bg-[#070B14] text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {a.name}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-1.5">
                  <button type="button" onClick={() => stepAlgo(-1)} className="rounded-lg border border-[#1E293B] bg-[#070B14] p-1.5 text-slate-300 hover:border-cyan-400"><SkipBack className="h-3.5 w-3.5" /></button>
                  <button
                    type="button"
                    onClick={() => setPlaying((p) => !p)}
                    className="inline-flex items-center gap-1 rounded-lg border border-cyan-500/50 bg-cyan-500/20 px-3 py-1 text-xs font-semibold text-cyan-200"
                  >
                    {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                    {playing ? "Pause" : "Play"}
                  </button>
                  <button type="button" onClick={() => stepAlgo(1)} className="rounded-lg border border-[#1E293B] bg-[#070B14] p-1.5 text-slate-300 hover:border-cyan-400"><SkipForward className="h-3.5 w-3.5" /></button>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between font-mono text-xs text-slate-400">
                <span>Step {currentFrame.step + 1} / {algo.frames.length}: <strong className="text-slate-100">{currentFrame.title}</strong></span>
                <span>cmp: {currentFrame.comparisons} · swaps: {currentFrame.swaps}</span>
              </div>
              <p className="mt-1 text-xs text-slate-300">{currentFrame.explanation}</p>

              {/* Bar + Memory Index Visualization */}
              <div className="mt-4 flex h-52 items-end justify-around gap-2 rounded-xl border border-[#1E293B] bg-[#070B14] px-4 pb-4 pt-6">
                {currentFrame.array.map((val, idx) => {
                  const maxVal = Math.max(...currentFrame.array, 1);
                  const state = currentFrame.highlights[idx];
                  const barColor =
                    state === "pivot"
                      ? "bg-amber-400"
                      : state === "swap"
                        ? "bg-rose-400"
                        : state === "sorted"
                          ? "bg-emerald-400"
                          : state === "compare"
                            ? "bg-cyan-400"
                            : "bg-violet-500/75";
                  return (
                    <div key={idx} className="flex flex-1 flex-col items-center gap-1.5">
                      <span className="font-mono text-xs font-bold text-slate-100">{val}</span>
                      <div className="flex w-full items-end justify-center" style={{ height: "130px" }}>
                        <div
                          className={`w-full max-w-[44px] rounded-t-md transition-all duration-300 ${barColor}`}
                          style={{ height: `${Math.max(14, Math.round((val / maxVal) * 124))}px` }}
                        />
                      </div>
                      <span className="font-mono text-[10px] text-slate-500">[{idx}]</span>
                    </div>
                  );
                })}
              </div>

              {/* Call Stack + Heap Inspector */}
              <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="rounded-xl border border-[#1E293B] bg-[#070B14] p-3">
                  <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase text-violet-400">
                    <Cpu className="h-3.5 w-3.5" /> Call Stack ({currentFrame.callStack.length} frames)
                  </div>
                  <div className="mt-2 space-y-1.5 font-mono text-[11px]">
                    {currentFrame.callStack.length === 0 ? (
                      <div className="text-slate-500">(empty stack)</div>
                    ) : (
                      currentFrame.callStack.map((f, i) => (
                        <div key={i} className="rounded border border-[#1E293B] bg-[#0F172A] px-2 py-1 text-slate-200">
                          {f.fn}({f.range}) <span className="text-slate-400">— {f.locals}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                <div className="rounded-xl border border-[#1E293B] bg-[#070B14] p-3">
                  <div className="font-mono text-[10px] uppercase text-cyan-400">Heap & Pointer Telemetry</div>
                  <div className="mt-2 space-y-1 font-mono text-[11px] text-slate-300">
                    {currentFrame.heapNotes.map((note, i) => (
                      <div key={i}>› {note}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Empirical Big-O Curve Lab */}
          <div className="space-y-4 lg:col-span-5">
            <div className="rounded-2xl border border-[#1E293B] bg-[#0F172A] p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-100">Big-O Asymptotic Curve Lab</h3>
                <span className="font-mono text-xs text-cyan-300">n = {bigON}</span>
              </div>
              <input
                type="range"
                min={2}
                max={24}
                value={bigON}
                onChange={(e) => setBigON(Number(e.target.value))}
                className="mt-3 w-full accent-violet-500"
              />
              <svg viewBox="0 0 360 210" className="mt-3 w-full rounded-xl border border-[#1E293B] bg-[#070B14]">
                {[
                  { label: "O(1)", color: "#10B981", fn: () => 1 },
                  { label: "O(log n)", color: "#38BDF8", fn: (x: number) => Math.log2(x) },
                  { label: "O(n)", color: "#A78BFA", fn: (x: number) => x },
                  { label: "O(n log n)", color: "#F59E0B", fn: (x: number) => x * Math.log2(x) },
                  { label: "O(n²)", color: "#FB7185", fn: (x: number) => x * x },
                ].map((curve) => {
                  const maxY = Math.max(bigON * bigON, 25);
                  const pts = Array.from({ length: 24 }, (_, idx) => {
                    const xVal = 1 + (idx / 23) * (bigON - 1);
                    const yVal = Math.min(maxY, curve.fn(xVal));
                    const px = 26 + (idx / 23) * 316;
                    const py = 188 - (yVal / maxY) * 164;
                    return `${px.toFixed(1)},${py.toFixed(1)}`;
                  }).join(" ");
                  return <polyline key={curve.label} fill="none" stroke={curve.color} strokeWidth="2.2" points={pts} />;
                })}
              </svg>

              <div className="mt-3 space-y-1.5 font-mono text-xs">
                {[
                  ["O(1)", bigOStats.o1.toLocaleString(), "text-emerald-400"],
                  ["O(log n)", bigOStats.oLogN.toLocaleString(), "text-sky-400"],
                  ["O(n)", bigOStats.oN.toLocaleString(), "text-violet-400"],
                  ["O(n log n)", bigOStats.oNLogN.toLocaleString(), "text-amber-400"],
                  ["O(n²)", bigOStats.oN2.toLocaleString(), "text-rose-400"],
                  ["O(2ⁿ)", Number.isFinite(bigOStats.o2N) ? bigOStats.o2N.toLocaleString() : "Overflow", "text-red-400"],
                ].map(([label, ops, cls]) => (
                  <div key={label} className="flex items-center justify-between rounded-lg border border-[#1E293B] bg-[#070B14] px-3 py-1.5">
                    <span className={cls}>{label}</span>
                    <span className="text-slate-200">{ops} ops</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </WorkbenchShell>
  );
}
