#!/usr/bin/env node
import fs from "node:fs";
import { execSync } from "node:child_process";

const args = process.argv.slice(2);
const isDemo = args.includes("--demo") || args.length === 0;
if (args.includes("--help") || args.includes("-h")) {
  console.log("learn-graph CLI companion\nUsage: node plugin/cli.mjs [--demo] [--json]");
  process.exit(0);
}
let gitBranch = "demo";
try { gitBranch = execSync("git rev-parse --abbrev-ref HEAD", { stdio: ["ignore", "pipe", "ignore"] }).toString().trim(); } catch {}
const report = {
  tool: "learn-graph",
  mode: isDemo ? "demo" : "local",
  branch: gitBranch,
  cwd: process.cwd().split("/").pop(),
  workbenchUrl: "https://aetherx86.github.io/learn-graph/",
  checkedAt: new Date().toISOString(),
};
console.log(args.includes("--json") ? JSON.stringify(report, null, 2) : `[${report.tool}] mode=${report.mode} branch=${report.branch} -> ${report.workbenchUrl}`);
