import { describe, expect, it } from "vitest";
import {
  analyzeSkillGap,
  buildBinarySearchFrames,
  buildHeapifyFrames,
  buildQuickSortFrames,
  computeBigOAt,
} from "../src/core/learnGraphEngine";

describe("learn-graph engine", () => {
  it("computes skill-gap radar and highest-leverage recommendations from a developer stack", () => {
    const report = analyzeSkillGap("typescript, react, nextjs, graphql, http, tailwind", "developer-roadmap");
    expect(report.matchedKeywords).toContain("typescript");
    expect(report.radar["Networking & Web"]).toBeGreaterThan(report.radar["Compilers & Tooling"]);
    expect(report.recommendedNodes.length).toBeGreaterThanOrEqual(3);
  });

  it("generates complete QuickSort, Binary Search, and Floyd Heapify execution traces", () => {
    const qs = buildQuickSortFrames([9, 3, 7, 1, 5]);
    expect(qs[qs.length - 1].array).toEqual([1, 3, 5, 7, 9]);

    const bs = buildBinarySearchFrames([2, 4, 6, 8, 10, 12], 10);
    expect(bs[bs.length - 1].title).toContain("Found Target 10");

    const heap = buildHeapifyFrames([10, 40, 20, 90, 30]);
    expect(heap[heap.length - 1].array[0]).toBe(90);
  });

  it("evaluates asymptotic Big-O operation curves accurately", () => {
    const pt = computeBigOAt(16);
    expect(pt.oLogN).toBe(4);
    expect(pt.oNLogN).toBe(64);
    expect(pt.oN2).toBe(256);
    expect(pt.o2N).toBe(65536);
  });
});
