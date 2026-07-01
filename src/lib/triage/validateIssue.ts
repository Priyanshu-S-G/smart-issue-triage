// src/lib/triage/validateIssue.ts

import {
  Impact,
  IssueInput,
  Reproducible,
} from "../../types/issue";

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

const VALID_IMPACTS: readonly Impact[] = [
  "none",
  "minor",
  "major",
  "blocking",
];

const VALID_REPRODUCIBLE: readonly Reproducible[] = [
  "yes",
  "no",
  "unknown",
];

export function validateIssue(
  issue: Partial<IssueInput>
): ValidationResult {
  const errors: string[] = [];

  // Title
  if (!issue.title || issue.title.trim().length === 0) {
    errors.push("Title is required.");
  } else if (issue.title.trim().length < 5) {
    errors.push("Title must be at least 5 characters.");
  }

  // Description
  if (!issue.description || issue.description.trim().length === 0) {
    errors.push("Description is required.");
  } else if (issue.description.trim().length < 20) {
    errors.push("Description must be at least 20 characters.");
  }

  // Module
  if (!issue.module || issue.module.trim().length === 0) {
    errors.push("Affected module is required.");
  }

  // Impact
  if (!issue.impact) {
    errors.push("Impact is required.");
  } else if (!VALID_IMPACTS.includes(issue.impact)) {
    errors.push(
      "Impact must be one of: none, minor, major, blocking."
    );
  }

  // Reproducible
  if (!issue.reproducible) {
    errors.push("Reproducible status is required.");
  } else if (!VALID_REPRODUCIBLE.includes(issue.reproducible)) {
    errors.push(
      "Reproducible must be one of: yes, no, unknown."
    );
  }

  // Logs
  if (
    issue.logs !== undefined &&
    typeof issue.logs !== "string"
  ) {
    errors.push("Logs must be a string.");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}