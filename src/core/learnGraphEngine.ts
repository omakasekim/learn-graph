export type MasteryStatus = "todo" | "learning" | "mastered";

export interface CurriculumNode {
  id: string;
  label: string;
  shortLabel: string;
  category: string;
  difficulty: "Foundational" | "Intermediate" | "Advanced";
  hours: number;
  x: number;
  y: number;
  prereqs: string[];
  summary: string;
  deliverable: string;
  keywords: string[];
  resources: Array<{ title: string; source: string }>;
}

export interface CurriculumTrack {
  id: string;
  name: string;
  ecosystem: string;
  description: string;
  nodes: CurriculumNode[];
}

export const CURRICULUM_TRACKS: CurriculumTrack[] = [
  {
    id: "developer-roadmap",
    name: "Systems & Full-Stack Roadmap",
    ecosystem: "developer-roadmap",
    description: "End-to-end engineering DAG spanning HTTP/DNS internals, TypeScript/React, relational engines, containers, and distributed observability.",
    nodes: [
      {
        id: "net-http",
        label: "DNS, TCP & HTTP/3 Internals",
        shortLabel: "Networking",
        category: "Networking & Web",
        difficulty: "Foundational",
        hours: 14,
        x: 90,
        y: 120,
        prereqs: [],
        summary: "Packet routing, TLS 1.3 handshakes, HTTP/2 multiplexing, and QUIC congestion control.",
        deliverable: "Trace a full HTTPS request from recursive DNS to TLS key exchange",
        keywords: ["dns", "http", "tcp", "tls", "network", "curl", "nginx"],
        resources: [
          { title: "High Performance Browser Networking", source: "developer-roadmap" },
          { title: "RFC 9114 HTTP/3 Overview", source: "IETF" },
        ],
      },
      {
        id: "ts-runtime",
        label: "TypeScript & JS Engine Runtime",
        shortLabel: "TS / V8",
        category: "Networking & Web",
        difficulty: "Foundational",
        hours: 18,
        x: 90,
        y: 280,
        prereqs: [],
        summary: "Structural typing, event loop microtasks, hidden classes, inline caches, and memory GC.",
        deliverable: "Build a zero-dependency typed RPC client with AbortSignal cancellation",
        keywords: ["typescript", "javascript", "react", "node", "v8", "vite", "nextjs"],
        resources: [
          { title: "TypeScript Roadmap Track", source: "developer-roadmap" },
          { title: "You Don't Know JS Yet", source: "getify" },
        ],
      },
      {
        id: "os-proc",
        label: "OS Processes, Virtual Memory & POSIX",
        shortLabel: "OS & Memory",
        category: "Systems & OS",
        difficulty: "Intermediate",
        hours: 26,
        x: 90,
        y: 440,
        prereqs: [],
        summary: "Syscalls, page tables, epoll/kqueue async I/O, threads, mutexes, and copy-on-write fork.",
        deliverable: "Write a minimal POSIX shell with pipes, redirection, and signal handling",
        keywords: ["linux", "posix", "rust", "c", "cpp", "os", "kernel", "epoll"],
        resources: [
          { title: "OSTEP: Operating Systems Three Easy Pieces", source: "OSSU" },
          { title: "Linux Performance & Syscalls", source: "developer-roadmap" },
        ],
      },
      {
        id: "algo-ds",
        label: "Graphs, Trees & Dynamic Programming",
        shortLabel: "Algorithms",
        category: "Algorithms & DS",
        difficulty: "Intermediate",
        hours: 32,
        x: 330,
        y: 200,
        prereqs: ["ts-runtime"],
        summary: "Amortized analysis, topological sort, Dijkstra/A*, tries, segment trees, and DP state transitions.",
        deliverable: "Implement a topological task scheduler with cycle diagnostics",
        keywords: ["algorithms", "leetcode", "graphs", "trees", "dp", "dsa"],
        resources: [
          { title: "TheAlgorithms Visual Repository", source: "TheAlgorithms" },
          { title: "Tech Interview Handbook", source: "yangshun" },
        ],
      },
      {
        id: "sql-storage",
        label: "B-Trees, WAL & Query Planners",
        shortLabel: "Databases",
        category: "Databases & Storage",
        difficulty: "Intermediate",
        hours: 28,
        x: 330,
        y: 360,
        prereqs: ["os-proc"],
        summary: "MVCC isolation levels, write-ahead logging, B+Tree page splits, LSM compactions, and EXPLAIN plans.",
        deliverable: "Design an indexed time-series schema and eliminate sequential scans",
        keywords: ["postgres", "sql", "sqlite", "redis", "database", "prisma", "mongodb"],
        resources: [
          { title: "PostgreSQL Internals Roadmap", source: "developer-roadmap" },
          { title: "CMU 15-445 Intro to Database Systems", source: "CMU" },
        ],
      },
      {
        id: "api-auth",
        label: "Zero-Trust APIs, OAuth2 & Rate Limits",
        shortLabel: "API Security",
        category: "Networking & Web",
        difficulty: "Intermediate",
        hours: 16,
        x: 570,
        y: 120,
        prereqs: ["net-http", "ts-runtime"],
        summary: "PKCE OAuth2 flows, short-lived JWTs, sliding-window Redis rate limiters, and idempotency keys.",
        deliverable: "Ship an idempotent payment webhook gateway with replay protection",
        keywords: ["oauth", "jwt", "graphql", "rest", "api", "auth", "security"],
        resources: [
          { title: "Backend Security Best Practices", source: "developer-roadmap" },
        ],
      },
      {
        id: "containers",
        label: "Linux Namespaces, Docker & K8s",
        shortLabel: "Containers",
        category: "Systems & OS",
        difficulty: "Intermediate",
        hours: 22,
        x: 570,
        y: 300,
        prereqs: ["os-proc", "net-http"],
        summary: "cgroups v2, overlayfs layers, multi-stage distroless builds, health probes, and pod scheduling.",
        deliverable: "Build a <25MB distroless container with rootless securityContext",
        keywords: ["docker", "kubernetes", "k8s", "devops", "terraform", "ci", "github actions"],
        resources: [
          { title: "DevOps & Docker Roadmap", source: "developer-roadmap" },
        ],
      },
      {
        id: "compilers",
        label: "AST Parsers, IR & Static Analyzers",
        shortLabel: "Compilers",
        category: "Compilers & Tooling",
        difficulty: "Advanced",
        hours: 34,
        x: 570,
        y: 470,
        prereqs: ["algo-ds", "os-proc"],
        summary: "Recursive-descent parsing, Pratt precedence, type inference, SSA IR, and custom lint rules.",
        deliverable: "Write a typed expression compiler targeting WebAssembly bytecode",
        keywords: ["compiler", "ast", "wasm", "llvm", "babel", "swc", "eslint"],
        resources: [
          { title: "Crafting Interpreters", source: "build-your-own-x" },
        ],
      },
      {
        id: "dist-consensus",
        label: "Replication, Raft & Event Streaming",
        shortLabel: "Distributed",
        category: "Distributed & AI",
        difficulty: "Advanced",
        hours: 38,
        x: 820,
        y: 220,
        prereqs: ["sql-storage", "api-auth", "containers"],
        summary: "Leader election, quorum reads/writes, backpressure, outbox pattern, and deterministic simulation.",
        deliverable: "Implement a 3-node Raft key-value store surviving network partitions",
        keywords: ["kafka", "raft", "distributed", "grpc", "microservices", "queue", "nats"],
        resources: [
          { title: "System Design Primer", source: "donnemartin" },
          { title: "MIT 6.5840 Distributed Systems", source: "MIT" },
        ],
      },
      {
        id: "ai-systems",
        label: "Inference Serving, RAG & Agent Evals",
        shortLabel: "AI Systems",
        category: "Distributed & AI",
        difficulty: "Advanced",
        hours: 30,
        x: 820,
        y: 410,
        prereqs: ["algo-ds", "sql-storage", "containers"],
        summary: "KV-cache memory math, quantized local inference, hybrid vector/BM25 retrieval, and eval harnesses.",
        deliverable: "Build a deterministic tool-calling eval harness with token budget telemetry",
        keywords: ["llm", "ai", "pytorch", "tensorflow", "rag", "ollama", "mcp", "python"],
        resources: [
          { title: "AI Engineer Roadmap", source: "developer-roadmap" },
        ],
      },
    ],
  },
  {
    id: "ossu-cs",
    name: "OSSU Computer Science Core",
    ecosystem: "ossu/computer-science",
    description: "Accredited-equivalent open-source CS degree graph from discrete math and architecture to compilers and operating systems.",
    nodes: [
      {
        id: "cs-intro",
        label: "Systematic Program Design",
        shortLabel: "Prog Design",
        category: "Algorithms & DS",
        difficulty: "Foundational",
        hours: 35,
        x: 90,
        y: 240,
        prereqs: [],
        summary: "Data-driven recursion, invariants, generative recursion, and test-first decomposition.",
        deliverable: "Solve structural & generative tree problems with 100% property tests",
        keywords: ["python", "racket", "scheme", "recursion", "cs50"],
        resources: [{ title: "How to Design Programs (HtDP)", source: "OSSU" }],
      },
      {
        id: "discrete-math",
        label: "Mathematics for Computer Science",
        shortLabel: "Discrete Math",
        category: "Algorithms & DS",
        difficulty: "Foundational",
        hours: 45,
        x: 90,
        y: 410,
        prereqs: [],
        summary: "Induction proofs, graph theory, modular arithmetic, combinatorics, and discrete probability.",
        deliverable: "Prove correctness and termination of graph coloring & RSA keygen",
        keywords: ["math", "proofs", "probability", "linear algebra", "discrete"],
        resources: [{ title: "MIT 6.042J Math for CS", source: "OSSU" }],
      },
      {
        id: "nand2tetris",
        label: "Nand2Tetris: Logic Gates to CPU",
        shortLabel: "Computer Arch",
        category: "Systems & OS",
        difficulty: "Intermediate",
        hours: 40,
        x: 330,
        y: 160,
        prereqs: ["cs-intro"],
        summary: "Boolean ALU, registers, Hack ISA, assembler, stack VM translator, and Jack OS.",
        deliverable: "Assemble and run Pong on a self-built 16-bit CPU simulator",
        keywords: ["cpu", "assembly", "hdl", "verilog", "c", "architecture"],
        resources: [{ title: "From Nand to Tetris", source: "OSSU" }],
      },
      {
        id: "core-algo",
        label: "Design & Analysis of Algorithms",
        shortLabel: "Core Algos",
        category: "Algorithms & DS",
        difficulty: "Intermediate",
        hours: 50,
        x: 330,
        y: 350,
        prereqs: ["cs-intro", "discrete-math"],
        summary: "Master theorem, greedy exchange arguments, network flow, and NP-completeness reductions.",
        deliverable: "Benchmark QuickSort, HeapSort, and RadixSort on adversarial inputs",
        keywords: ["algorithms", "big-o", "dp", "graphs", "sorting"],
        resources: [{ title: "Stanford Algorithms Specialization", source: "OSSU" }],
      },
      {
        id: "os-kernel",
        label: "Operating Systems & Concurrency",
        shortLabel: "OS Kernel",
        category: "Systems & OS",
        difficulty: "Advanced",
        hours: 55,
        x: 590,
        y: 160,
        prereqs: ["nand2tetris"],
        summary: "Preemptive schedulers, virtual memory TLBs, lock-free queues, and crash-consistent filesystems.",
        deliverable: "Implement a multi-level feedback queue scheduler and ext2 reader",
        keywords: ["os", "kernel", "linux", "threads", "concurrency", "rust"],
        resources: [{ title: "OSTEP & xv6 Labs", source: "OSSU" }],
      },
      {
        id: "db-systems",
        label: "Relational Algebra & Storage Engines",
        shortLabel: "DB Internals",
        category: "Databases & Storage",
        difficulty: "Intermediate",
        hours: 40,
        x: 590,
        y: 320,
        prereqs: ["core-algo"],
        summary: "Query optimization, join algorithms (hash vs sort-merge), buffer pool LRU-K, and ARIES recovery.",
        deliverable: "Write a slotted-page buffer pool manager with LRU-K eviction",
        keywords: ["sql", "postgres", "sqlite", "database", "storage"],
        resources: [{ title: "Stanford Databases", source: "OSSU" }],
      },
      {
        id: "comp-lang",
        label: "Programming Languages & Compilers",
        shortLabel: "PL / Compilers",
        category: "Compilers & Tooling",
        difficulty: "Advanced",
        hours: 48,
        x: 590,
        y: 470,
        prereqs: ["core-algo"],
        summary: "Hindley-Milner type inference, closures, lexical scoping, bytecode VMs, and register allocation.",
        deliverable: "Build a static type-checker with algebraic data types and pattern matching",
        keywords: ["compiler", "ocaml", "haskell", "typescript", "llvm", "ast"],
        resources: [{ title: "UW Programming Languages A/B/C", source: "OSSU" }],
      },
      {
        id: "dist-net",
        label: "Computer Networking & Distributed Systems",
        shortLabel: "Dist & Net",
        category: "Distributed & AI",
        difficulty: "Advanced",
        hours: 50,
        x: 840,
        y: 280,
        prereqs: ["os-kernel", "db-systems"],
        summary: "BGP routing, TCP congestion control, Paxos/Raft, linearizability, and Lamport clocks.",
        deliverable: "Simulate a split-brain partition and verify linearizable reads",
        keywords: ["network", "tcp", "raft", "distributed", "grpc", "go"],
        resources: [{ title: "Computer Networking: Top-Down Approach", source: "OSSU" }],
      },
    ],
  },
  {
    id: "build-your-own-x",
    name: "Build Your Own X Projects",
    ecosystem: "build-your-own-x",
    description: "Hands-on systems mastery by building real production primitives from scratch: Shell, Git, Redis, SQLite, Docker, and a Transformer.",
    nodes: [
      {
        id: "byo-shell",
        label: "Build Your Own POSIX Shell",
        shortLabel: "BYO Shell",
        category: "Systems & OS",
        difficulty: "Foundational",
        hours: 12,
        x: 100,
        y: 160,
        prereqs: [],
        summary: "Tokenizer, fork/execvp, pipe descriptors, job control, and prompt expansion.",
        deliverable: "Working shell passing pipeline and SIGINT foreground tests",
        keywords: ["bash", "zsh", "shell", "c", "rust", "go", "posix"],
        resources: [{ title: "Build Your Own Shell", source: "build-your-own-x" }],
      },
      {
        id: "byo-regex",
        label: "Build Your Own NFA Regex Engine",
        shortLabel: "BYO Regex",
        category: "Compilers & Tooling",
        difficulty: "Foundational",
        hours: 10,
        x: 100,
        y: 350,
        prereqs: [],
        summary: "Thompson's construction from postfix AST to NFA simulation in guaranteed O(n*m) time.",
        deliverable: "Linear-time regex matcher immune to catastrophic backtracking",
        keywords: ["regex", "automata", "parser", "typescript", "rust"],
        resources: [{ title: "Russ Cox: Regular Expression Matching", source: "build-your-own-x" }],
      },
      {
        id: "byo-git",
        label: "Build Your Own Git",
        shortLabel: "BYO Git",
        category: "Databases & Storage",
        difficulty: "Intermediate",
        hours: 16,
        x: 340,
        y: 140,
        prereqs: ["byo-shell"],
        summary: "Content-addressed SHA-1 blobs, trees, commits, zlib packfiles, and three-way merge.",
        deliverable: "CLI implementing init, hash-object, cat-file, write-tree, commit-tree",
        keywords: ["git", "sha", "merkle", "cli", "python", "go", "rust"],
        resources: [{ title: "Write Yourself a Git!", source: "build-your-own-x" }],
      },
      {
        id: "byo-redis",
        label: "Build Your Own Redis Server",
        shortLabel: "BYO Redis",
        category: "Networking & Web",
        difficulty: "Intermediate",
        hours: 20,
        x: 340,
        y: 320,
        prereqs: ["byo-shell"],
        summary: "RESP protocol parser, single-threaded epoll event loop, TTL expiry heap, and RDB snapshots.",
        deliverable: "TCP server passing redis-cli PING/GET/SET/EXPIRE benchmarks",
        keywords: ["redis", "tcp", "epoll", "network", "cache", "go", "rust"],
        resources: [{ title: "Build Your Own Redis with C/C++", source: "build-your-own-x" }],
      },
      {
        id: "byo-sqlite",
        label: "Build Your Own SQLite",
        shortLabel: "BYO SQLite",
        category: "Databases & Storage",
        difficulty: "Advanced",
        hours: 30,
        x: 590,
        y: 200,
        prereqs: ["byo-git", "byo-regex"],
        summary: "SQL lexer/parser, bytecode VM, on-disk B-Tree pager, and crash-safe rollback journal.",
        deliverable: "Persistent SQL engine supporting CREATE, INSERT, and indexed SELECT",
        keywords: ["sqlite", "sql", "btree", "database", "storage", "c", "rust"],
        resources: [{ title: "Let's Build a Simple Database", source: "build-your-own-x" }],
      },
      {
        id: "byo-docker",
        label: "Build Your Own Container Runtime",
        shortLabel: "BYO Docker",
        category: "Systems & OS",
        difficulty: "Advanced",
        hours: 18,
        x: 590,
        y: 390,
        prereqs: ["byo-shell", "byo-redis"],
        summary: "clone() PID/NET/MNT namespaces, pivot_root chroot jail, cgroups memory limits, and OCI layers.",
        deliverable: "Run an isolated Alpine rootfs container in <250 lines of Go/Rust",
        keywords: ["docker", "linux", "containers", "cgroups", "go", "devops"],
        resources: [{ title: "Containers From Scratch", source: "build-your-own-x" }],
      },
      {
        id: "byo-gpt",
        label: "Build Your Own GPT / Micrograd",
        shortLabel: "BYO LLM",
        category: "Distributed & AI",
        difficulty: "Advanced",
        hours: 24,
        x: 830,
        y: 280,
        prereqs: ["byo-sqlite", "byo-regex"],
        summary: "Autograd reverse-mode tape, BPE tokenizer, multi-head causal attention, and KV-cache decoding.",
        deliverable: "Train a character/BPE transformer from scratch and sample tokens live",
        keywords: ["pytorch", "ai", "llm", "transformer", "python", "ml", "numpy"],
        resources: [{ title: "Andrej Karpathy: Let's build GPT", source: "build-your-own-x" }],
      },
    ],
  },
];

export const SKILL_AXES = [
  "Systems & OS",
  "Algorithms & DS",
  "Databases & Storage",
  "Networking & Web",
  "Compilers & Tooling",
  "Distributed & AI",
] as const;

export type SkillAxis = (typeof SKILL_AXES)[number];

export interface SkillGapResult {
  radar: Record<SkillAxis, number>;
  matchedKeywords: string[];
  strongestAxis: SkillAxis;
  weakestAxis: SkillAxis;
  readinessPct: number;
  recommendedNodes: Array<{
    node: CurriculumNode;
    reason: string;
    downstreamUnlocks: number;
  }>;
}

export const DEVELOPER_PRESETS: Array<{ id: string; label: string; stackText: string }> = [
  {
    id: "frontend-react",
    label: "Frontend React / Next.js Engineer",
    stackText: "typescript, javascript, react, nextjs, vite, tailwind, graphql, rest, api, http, git, eslint, jest, css",
  },
  {
    id: "python-ai",
    label: "Python ML / AI Application Engineer",
    stackText: "python, pytorch, llm, rag, ollama, mcp, numpy, sql, postgres, docker, api, git, algorithms",
  },
  {
    id: "backend-go",
    label: "Backend / Cloud Infrastructure Engineer",
    stackText: "go, postgres, redis, kafka, docker, kubernetes, grpc, nginx, linux, dns, tcp, oauth, terraform, ci",
  },
];

export function analyzeSkillGap(inputText: string, trackId: string): SkillGapResult {
  const track = CURRICULUM_TRACKS.find((t) => t.id === trackId) ?? CURRICULUM_TRACKS[0];
  const tokens = new Set(
    inputText
      .toLowerCase()
      .split(/[^a-z0-9+#.-]+/)
      .filter((t) => t.length >= 2)
  );

  const axisHits: Record<SkillAxis, number> = {
    "Systems & OS": 0,
    "Algorithms & DS": 0,
    "Databases & Storage": 0,
    "Networking & Web": 0,
    "Compilers & Tooling": 0,
    "Distributed & AI": 0,
  };
  const axisTotal: Record<SkillAxis, number> = {
    "Systems & OS": 0,
    "Algorithms & DS": 0,
    "Databases & Storage": 0,
    "Networking & Web": 0,
    "Compilers & Tooling": 0,
    "Distributed & AI": 0,
  };

  const matchedSet = new Set<string>();
  const allNodes = CURRICULUM_TRACKS.flatMap((t) => t.nodes);
  for (const node of allNodes) {
    const axis = node.category as SkillAxis;
    if (!(axis in axisTotal)) continue;
    axisTotal[axis] += 2;
    let nodeMatches = 0;
    for (const kw of node.keywords) {
      if (tokens.has(kw) || inputText.toLowerCase().includes(kw)) {
        matchedSet.add(kw);
        nodeMatches += 1;
      }
    }
    axisHits[axis] += Math.min(2, nodeMatches);
  }

  const radar = {} as Record<SkillAxis, number>;
  let sum = 0;
  for (const axis of SKILL_AXES) {
    const raw = axisTotal[axis] > 0 ? Math.round((axisHits[axis] / axisTotal[axis]) * 100) : 15;
    radar[axis] = Math.max(12, Math.min(98, raw));
    sum += radar[axis];
  }

  const sortedAxes = [...SKILL_AXES].sort((a, b) => radar[b] - radar[a]);
  const strongestAxis = sortedAxes[0];
  const weakestAxis = sortedAxes[sortedAxes.length - 1];

  const downstreamCount = (nodeId: string): number =>
    track.nodes.filter((n) => n.prereqs.includes(nodeId)).length;

  const recommendedNodes = track.nodes
    .map((node) => {
      const axis = node.category as SkillAxis;
      const axisScore = radar[axis] ?? 50;
      const matches = node.keywords.filter((kw) => matchedSet.has(kw)).length;
      const unlocks = downstreamCount(node.id);
      const leverageScore = (100 - axisScore) * 1.4 + unlocks * 24 - matches * 12;
      const reason =
        axis === weakestAxis
          ? `Closes your largest skill gap (${weakestAxis}: ${axisScore}%) and unlocks ${unlocks} downstream topic${unlocks === 1 ? "" : "s"}.`
          : unlocks > 0
            ? `High-leverage prerequisite unlocking ${unlocks} advanced track node${unlocks === 1 ? "" : "s"}.`
            : `Builds deep hands-on mastery in ${node.category} (${node.hours}h estimated).`;
      return { node, leverageScore, reason, downstreamUnlocks: unlocks };
    })
    .sort((a, b) => b.leverageScore - a.leverageScore)
    .slice(0, 4)
    .map(({ node, reason, downstreamUnlocks }) => ({ node, reason, downstreamUnlocks }));

  return {
    radar,
    matchedKeywords: Array.from(matchedSet).sort(),
    strongestAxis,
    weakestAxis,
    readinessPct: Math.round(sum / SKILL_AXES.length),
    recommendedNodes,
  };
}

export interface AlgoFrame {
  step: number;
  title: string;
  explanation: string;
  array: number[];
  highlights: Record<number, "pivot" | "compare" | "swap" | "sorted" | "active">;
  callStack: Array<{ fn: string; range: string; locals: string }>;
  heapNotes: string[];
  comparisons: number;
  swaps: number;
}

export interface AlgoScenario {
  id: string;
  name: string;
  complexity: { time: string; worst: string; space: string };
  summary: string;
  frames: AlgoFrame[];
}

export function buildQuickSortFrames(input: number[] = [38, 17, 64, 12, 49, 25, 41]): AlgoFrame[] {
  const arr = [...input];
  const frames: AlgoFrame[] = [];
  const sortedSet = new Set<number>();
  let comparisons = 0;
  let swaps = 0;
  const stack: Array<{ fn: string; range: string; locals: string }> = [];

  const pushFrame = (
    title: string,
    explanation: string,
    extra: Record<number, "pivot" | "compare" | "swap" | "sorted" | "active"> = {},
    heapNotes: string[] = []
  ) => {
    const highlights: Record<number, "pivot" | "compare" | "swap" | "sorted" | "active"> = {};
    for (const idx of sortedSet) highlights[idx] = "sorted";
    Object.assign(highlights, extra);
    frames.push({
      step: frames.length,
      title,
      explanation,
      array: [...arr],
      highlights,
      callStack: [...stack],
      heapNotes,
      comparisons,
      swaps,
    });
  };

  pushFrame("Initialize In-Place Array Buffer", "Allocate contiguous Int32 array on heap; no auxiliary merge buffer required (O(log n) stack frames).", {}, [
    `heap[0x1000] = Int32Array(${arr.length}) [${arr.join(", ")}]`,
  ]);

  const qs = (lo: number, hi: number) => {
    if (lo >= hi) {
      if (lo === hi) sortedSet.add(lo);
      return;
    }
    const pivot = arr[hi];
    stack.push({ fn: "quicksort", range: `[${lo}..${hi}]`, locals: `pivot=${pivot} @ idx ${hi}` });
    pushFrame(
      `Select Pivot arr[${hi}] = ${pivot}`,
      `Partition slice [${lo}..${hi}] using Lomuto scheme around pivot ${pivot}.`,
      { [hi]: "pivot" },
      [`pivot_ptr = &arr[${hi}] (${pivot})`, `partition_boundary i = ${lo - 1}`]
    );

    let i = lo - 1;
    for (let j = lo; j < hi; j++) {
      comparisons += 1;
      pushFrame(
        `Compare arr[${j}] (${arr[j]}) <= ${pivot}`,
        arr[j] <= pivot
          ? `${arr[j]} <= ${pivot}: advance partition index i → ${i + 1} and swap.`
          : `${arr[j]} > ${pivot}: keep in right partition.`,
        { [hi]: "pivot", [j]: "compare" },
        [`i=${i}, j=${j}`, `comparisons=${comparisons}, swaps=${swaps}`]
      );
      if (arr[j] <= pivot) {
        i += 1;
        if (i !== j) {
          [arr[i], arr[j]] = [arr[j], arr[i]];
          swaps += 1;
          pushFrame(
            `Swap arr[${i}] ↔ arr[${j}]`,
            `Placed ${arr[i]} into the left <= pivot zone.`,
            { [hi]: "pivot", [i]: "swap", [j]: "swap" },
            [`in-place swap at offsets +${i * 4}B / +${j * 4}B`]
          );
        }
      }
    }

    const pIdx = i + 1;
    if (pIdx !== hi) {
      [arr[pIdx], arr[hi]] = [arr[hi], arr[pIdx]];
      swaps += 1;
    }
    sortedSet.add(pIdx);
    pushFrame(
      `Lock Pivot ${pivot} at Final Index ${pIdx}`,
      `All elements left of ${pIdx} are <= ${pivot}; all elements right are > ${pivot}.`,
      { [pIdx]: "sorted" },
      [`pivot settled at idx ${pIdx}`, `recurse left [${lo}..${pIdx - 1}], right [${pIdx + 1}..${hi}]`]
    );

    qs(lo, pIdx - 1);
    qs(pIdx + 1, hi);
    stack.pop();
  };

  qs(0, arr.length - 1);
  for (let k = 0; k < arr.length; k++) sortedSet.add(k);
  pushFrame("Array Sorted — Stack Unwound", `Completed in ${comparisons} comparisons and ${swaps} swaps.`, {}, [
    `sorted buffer: [${arr.join(", ")}]`,
  ]);

  return frames;
}

export function buildBinarySearchFrames(input: number[] = [7, 14, 23, 31, 42, 58, 69, 84, 95], target = 69): AlgoFrame[] {
  const frames: AlgoFrame[] = [];
  let lo = 0;
  let hi = input.length - 1;
  let comparisons = 0;

  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    comparisons += 1;
    const val = input[mid];
    const highlights: Record<number, "pivot" | "compare" | "swap" | "sorted" | "active"> = {
      [lo]: "active",
      [hi]: "active",
      [mid]: val === target ? "sorted" : "pivot",
    };
    frames.push({
      step: frames.length,
      title: val === target ? `Found Target ${target} at idx ${mid}` : `Probe Midpoint idx ${mid} (${val})`,
      explanation:
        val === target
          ? `arr[${mid}] == ${target}. Halved search space in only ${comparisons} probes (O(log n)).`
          : val < target
            ? `${val} < ${target} → discard left half [${lo}..${mid}], set lo = ${mid + 1}.`
            : `${val} > ${target} → discard right half [${mid}..${hi}], set hi = ${mid - 1}.`,
      array: [...input],
      highlights,
      callStack: [{ fn: "binarySearch", range: `[${lo}..${hi}]`, locals: `mid=${mid}, target=${target}` }],
      heapNotes: [`remaining window = ${hi - lo + 1} elements`, `lo=${lo}, mid=${mid}, hi=${hi}`],
      comparisons,
      swaps: 0,
    });
    if (val === target) break;
    if (val < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return frames;
}

export function buildHeapifyFrames(input: number[] = [22, 48, 15, 73, 31, 60, 19]): AlgoFrame[] {
  const arr = [...input];
  const frames: AlgoFrame[] = [];
  let comparisons = 0;
  let swaps = 0;

  frames.push({
    step: 0,
    title: "Bottom-Up Floyd Max-Heapify",
    explanation: "Start sifting down from last internal node floor(n/2)-1 = 2; total work is linear O(n).",
    array: [...arr],
    highlights: { 2: "active" },
    callStack: [{ fn: "buildMaxHeap", range: `[0..${arr.length - 1}]`, locals: `n=${arr.length}` }],
    heapNotes: [`parent(i)=floor((i-1)/2), left=2i+1, right=2i+2`],
    comparisons,
    swaps,
  });

  const siftDown = (idx: number) => {
    let cur = idx;
    while (true) {
      const l = 2 * cur + 1;
      const r = 2 * cur + 2;
      let largest = cur;
      if (l < arr.length) {
        comparisons += 1;
        if (arr[l] > arr[largest]) largest = l;
      }
      if (r < arr.length) {
        comparisons += 1;
        if (arr[r] > arr[largest]) largest = r;
      }
      if (largest === cur) {
        frames.push({
          step: frames.length,
          title: `Subtree Rooted at idx ${cur} Valid`,
          explanation: `arr[${cur}] (${arr[cur]}) >= children; heap invariant satisfied.`,
          array: [...arr],
          highlights: { [cur]: "sorted" },
          callStack: [{ fn: "siftDown", range: `root=${idx}`, locals: `cur=${cur}` }],
          heapNotes: [`heap property holds at index ${cur}`],
          comparisons,
          swaps,
        });
        break;
      }
      [arr[cur], arr[largest]] = [arr[largest], arr[cur]];
      swaps += 1;
      frames.push({
        step: frames.length,
        title: `Sift Down Swap idx ${cur} ↔ idx ${largest}`,
        explanation: `Promoted larger child ${arr[cur]} above ${arr[largest]}.`,
        array: [...arr],
        highlights: { [cur]: "swap", [largest]: "pivot" },
        callStack: [{ fn: "siftDown", range: `root=${idx}`, locals: `cur=${cur} -> ${largest}` }],
        heapNotes: [`swaps=${swaps}, comparisons=${comparisons}`],
        comparisons,
        swaps,
      });
      cur = largest;
    }
  };

  for (let i = Math.floor(arr.length / 2) - 1; i >= 0; i--) {
    siftDown(i);
  }
  return frames;
}

export const ALGO_SCENARIOS: AlgoScenario[] = [
  {
    id: "quicksort",
    name: "QuickSort (Lomuto Partition)",
    complexity: { time: "O(n log n)", worst: "O(n²)", space: "O(log n) stack" },
    summary: "Cache-friendly divide-and-conquer sort showing live call-stack frames and in-place pointer swaps.",
    frames: buildQuickSortFrames(),
  },
  {
    id: "binary-search",
    name: "Binary Search (Monotonic Halving)",
    complexity: { time: "O(log n)", worst: "O(log n)", space: "O(1)" },
    summary: "Logarithmic interval halving over a sorted contiguous array with zero extra heap allocation.",
    frames: buildBinarySearchFrames(),
  },
  {
    id: "heapify",
    name: "Floyd Linear Max-Heapify",
    complexity: { time: "O(n)", worst: "O(n)", space: "O(1)" },
    summary: "Constructs an implicit binary max-heap inside an array in linear O(n) worst-case time.",
    frames: buildHeapifyFrames(),
  },
];

export interface BigOCurvePoint {
  n: number;
  o1: number;
  oLogN: number;
  oN: number;
  oNLogN: number;
  oN2: number;
  o2N: number;
}

export function computeBigOAt(n: number): BigOCurvePoint {
  const safeN = Math.max(1, n);
  return {
    n: safeN,
    o1: 1,
    oLogN: Number(Math.max(1, Math.log2(safeN)).toFixed(2)),
    oN: safeN,
    oNLogN: Number((safeN * Math.max(1, Math.log2(safeN))).toFixed(1)),
    oN2: safeN * safeN,
    o2N: safeN <= 24 ? Math.pow(2, safeN) : Number.POSITIVE_INFINITY,
  };
}
