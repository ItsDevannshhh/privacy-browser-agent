/**
 * Privacy Browser Agent — Content Script
 *
 * Entry point injected into every page (document_idle).
 * Runs the local DOM perception pipeline with a test task,
 * then logs the results to the console.
 *
 * No network requests. No LLM. No form values collected.
 */

import { TaskOrchestrator } from "./orchestrator/TaskOrchestrator";

// ── Temporary test task (will come from popup/sidepanel later) ──────────

const testTask = "click the Download Invoice button";

// ── Run pipeline ───────────────────────────────────────────────────────

(async () => {
  console.log("Privacy Browser Agent content script loaded");

  const orchestrator = new TaskOrchestrator();
  const context = await orchestrator.getRelevantContext(testTask);

  // Also log raw extraction count for visibility
  const rawCount = orchestrator.getPerception().extract().length;

  console.log(`DOM candidates: ${rawCount}`);
  console.log(`Relevant candidates: ${context.candidates.length}`);
  console.log("Selected context:", JSON.stringify(context, null, 2));
})();