/**
 * TaskOrchestrator
 *
 * Entry-point for the local DOM-perception pipeline.
 *
 * Flow:
 *   task → DomPerceptionAdapter.extract()
 *        → ElementCanonicalizer.canonicalize()
 *        → ContextSelector.select(task, candidates)
 *        → SelectedContext
 *
 * Everything runs locally in the content script.
 * No backend calls, no LLM, no network.
 */

import type { SelectedContext } from "../types/index";
import { DomPerceptionAdapter } from "../perception/DomPerceptionAdapter";
import { ElementCanonicalizer } from "../perception/ElementCanonicalizer";
import { ContextSelector } from "../context/ContextSelector";

export class TaskOrchestrator {
  private perception: DomPerceptionAdapter;
  private canonicalizer: ElementCanonicalizer;
  private selector: ContextSelector;

  constructor(topK?: number) {
    this.perception = new DomPerceptionAdapter();
    this.canonicalizer = new ElementCanonicalizer();
    this.selector = new ContextSelector(topK);
  }

  /**
   * Run the full local perception pipeline for a given user task.
   *
   * @param task - TRUSTED user task string (never from webpage content).
   * @returns SelectedContext with scored, ranked DOM candidates.
   */
  async getRelevantContext(task: string): Promise<SelectedContext> {
    // 1. Extract raw candidates from the live DOM
    const rawCandidates = this.perception.extract();

    // 2. Canonicalize (normalize whitespace, lowercase, clamp)
    const canonical = this.canonicalizer.canonicalize(rawCandidates);

    // 3. Score & rank against the task, return Top-K
    const context = this.selector.select(task, canonical);

    return context;
  }

  /** Expose the perception adapter for later action execution phases. */
  getPerception(): DomPerceptionAdapter {
    return this.perception;
  }
}
