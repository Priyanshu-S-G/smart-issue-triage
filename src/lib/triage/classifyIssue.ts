// src/lib/triage/classifyIssue.ts

import {
  Category,
  ClassificationResult,
  ClassificationScores,
  Effort,
  IssueInput,
  Owner,
  Priority,
} from "../../types/issue";

import {
  KEYWORD_RULES,
  BUSINESS_CRITICAL_MODULES,
  FRONTEND_MODULES,
  BACKEND_MODULES,
  DEVOPS_MODULES,
} from "./keywords";

import {
  addScore,
  getHighestScore,
  matchKeywords,
} from "./scoring";

export function classifyIssue(
  issue: IssueInput
): ClassificationResult {

  const text = [
    issue.title,
    issue.description,
    issue.logs ?? "",
  ].join(" ");

  const matchedRules = matchKeywords(text, KEYWORD_RULES);

  const scores: ClassificationScores = {
    category: {},
    owner: {},
    priority: {},
    effort: {},
  };

  const reasoning: string[] = [];

  let priorityScore = 0;

  // -------------------------
  // Keyword scoring
  // -------------------------

  for (const rule of matchedRules) {

    if (rule.category) {
      addScore(scores.category, rule.category, rule.weight);
    }

    if (rule.owner) {
      addScore(scores.owner, rule.owner, rule.weight);
    }

    if (rule.priorityBoost) {
      priorityScore += rule.priorityBoost;
    }

    if (rule.effortHint) {
      addScore(scores.effort, rule.effortHint, 3);
    }

    reasoning.push(rule.reason);
  }

  // -------------------------
  // Impact
  // -------------------------

  switch (issue.impact) {
    case "blocking":
      priorityScore += 5;
      reasoning.push("Blocking impact increases priority.");
      break;

    case "major":
      priorityScore += 3;
      break;

    case "minor":
      priorityScore += 1;
      break;
  }

  // -------------------------
  // Reproducible
  // -------------------------

  let confidence = 0.6;

  if (issue.reproducible === "yes") {
    confidence += 0.15;
  } else if (issue.reproducible === "unknown") {
    confidence -= 0.05;
  }

  // -------------------------
  // Module owner hints
  // -------------------------

  const moduleName = issue.module.toLowerCase();

  if (FRONTEND_MODULES.has(moduleName)) {
    addScore(scores.owner, "frontend", 4);
  }

  if (BACKEND_MODULES.has(moduleName)) {
    addScore(scores.owner, "backend", 4);
  }

  if (DEVOPS_MODULES.has(moduleName)) {
    addScore(scores.owner, "devops", 4);
  }

  if (BUSINESS_CRITICAL_MODULES.has(moduleName)) {
    priorityScore += 2;
  }

  // -------------------------
  // Determine category
  // -------------------------

  const category =
    getHighestScore(scores.category) ?? "other";

  // -------------------------
  // Determine owner
  // -------------------------

  const owner =
    getHighestScore(scores.owner) ?? "product";

  // -------------------------
  // Priority
  // -------------------------

  let priority: Priority;

  if (priorityScore >= 8) {
    priority = "critical";
  } else if (priorityScore >= 5) {
    priority = "high";
  } else if (priorityScore >= 2) {
    priority = "medium";
  } else {
    priority = "low";
  }

  // -------------------------
  // Effort
  // -------------------------

  let effort =
    getHighestScore(scores.effort) ?? "medium";

  // -------------------------
  // Confidence
  // -------------------------

  confidence += Math.min(
    matchedRules.length * 0.03,
    0.15
  );

  if (issue.description.length < 40) {
    confidence -= 0.1;
  }

  const vagueSignals = [
    "not sure",
    "something",
    "things",
    "various",
    "unclear",
    "hard to pin down",
    "feels off",
  ];

  const vagueSignalCount = vagueSignals.filter((signal) =>
    issue.description.toLowerCase().includes(signal)
  ).length;

  if (issue.description.length > 100 && vagueSignalCount >= 2) {
    confidence -= 0.1;
    reasoning.push("Long vague description reduces confidence.");
  }

  if (matchedRules.length === 0) {
    confidence -= 0.15;
  }

  confidence = Math.max(
    0,
    Math.min(1, Number(confidence.toFixed(2)))
  );

  const uniqueReasoning = [...new Set(reasoning)];

  return {
    category,
    priority,
    effort,
    owner,
    confidence,
    reasoning: uniqueReasoning,
  };
}