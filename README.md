# learn-graph

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-8B5CF6?style=for-the-badge)](https://aetherx86.github.io/learn-graph/)
[![Chrome MV3](https://img.shields.io/badge/Plugin-Chrome%20MV3%20%2B%20CLI-0EA5E9?style=for-the-badge)](#plugin-installation)
[![License: MIT](https://img.shields.io/badge/License-MIT-10B981?style=for-the-badge)](LICENSE)

> **Interactive Curriculum DAG, Repo-to-Roadmap Skill-Gap Mapper & Step-by-Step Algorithm / Memory / Big-O Lab** for `developer-roadmap`, `ossu/computer-science`, `build-your-own-x`, `freeCodeCamp`, and `TheAlgorithms`.

## Target GitHub Ecosystems

| Ecosystem | Capability in `learn-graph` |
| --- | --- |
| `kamranahmedse/developer-roadmap` | Pan/zoom prerequisite DAG with `localStorage` mastery progress and unlock indicators |
| `ossu/computer-science` | Full CS core graph from discrete math & Nand2Tetris to OS kernels and compilers |
| `codecrafters-io/build-your-own-x` | Skill-gap scanner recommends the highest-leverage scratch build (Shell, Git, Redis, SQLite, Docker, GPT) |
| `TheAlgorithms` & Interview Prep | Animated step-by-step QuickSort, Binary Search & Heapify with live Call Stack, Heap notes & Big-O curves |

## Architecture

```mermaid
flowchart LR
  A[GitHub Repo / Stack Input] --> B[learnGraphEngine.ts]
  B --> C[Curriculum DAG Canvas]
  B --> D[6-Axis Skill-Gap Radar]
  B --> E[Step-by-Step Algo & Big-O Lab]
  C & D & E --> F[WorkbenchShell: ⌘K · #state= · SVG/PNG/MD/JSON]
```

## Quickstart

```bash
npm install
npm run dev
```

Run tests and production build:

```bash
npm test && npm run build
```

## Plugin Installation

1. **Chrome MV3 Extension (`plugin/`)**: Open `chrome://extensions`, enable **Developer Mode**, click **Load unpacked**, and select `./plugin`.
2. **CLI Companion**:
   ```bash
   node plugin/cli.mjs --demo
   ```

## License

[MIT](LICENSE)
