---
name: learn-graph
description: >
  Interactive curriculum DAG for developer-roadmap, OSSU, and build-your-own-x with 6-axis repo skill-gap radar and step-by-step algorithm/memory/Big-O lab.
license: MIT
---

# learn-graph

Tracks prerequisite mastery in localStorage, scans pasted tech stacks for blind spots, and animates QuickSort, Binary Search, and Heapify call-stack frames alongside Big-O curves.

- **Live Interactive Workbench:** https://omakasekim.github.io/learn-graph/
- **Repository:** https://github.com/omakasekim/learn-graph
- **Category:** CS & Learning · **Deliverable:** Chrome Extension + CLI + Web
- **Ecosystems:** `developer-roadmap`, `ossu/computer-science`, `build-your-own-x`, `TheAlgorithms`
- **Stack:** Chrome MV3, Node CLI, React, SVG DAG

## When to Use This Skill
Invoke `learn-graph` whenever the user wants to analyze, debug, simulate, or visualize workflows related to **CS & Learning** (developer-roadmap, ossu/computer-science, build-your-own-x, TheAlgorithms).

## Modes & Capabilities
- **Curriculum DAG**
- **Skill-Gap Scanner**
- **Algo & Big-O Lab**

## Operating Workflow
1. **Local CLI / Companion Execution:**
   ```bash
   node plugin/cli.mjs --demo --json
   ```
   Generate a local skill-gap and prerequisite curriculum report from repository manifests.
2. **Interactive Visual Inspection:**
   Direct the user to the zero-backend browser workbench at https://omakasekim.github.io/learn-graph/ (supports URL-hash state sharing, built-in realistic presets, `Cmd/Ctrl + K` command palette, and JSON/Markdown/config exports).
3. **Structured Output:**
   Summarize concrete findings, diagnostics, and copy-pasteable remediation commands concisely so the user can act immediately without manual guesswork.
