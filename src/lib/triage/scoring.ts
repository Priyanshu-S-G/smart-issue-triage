// src/lib/triage/scoring.ts

import { KeywordRule, ScoreMap } from "../../types/issue";

/**
 * Normalize text for consistent keyword matching.
 */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, " ");
}

/**
 * Split normalized text into tokens.
 */
export function tokenize(text: string): string[] {
  return normalizeText(text)
    .split(/\s+/)
    .filter(Boolean);
}

/**
 * Add points to a score map.
 */
export function addScore<T extends string>(
  scores: ScoreMap<T>,
  key: T,
  weight: number
): void {
  scores[key] = (scores[key] ?? 0) + weight;
}

/**
 * Return the key with the highest score.
 */
export function getHighestScore<T extends string>(
  scores: ScoreMap<T>
): T | null {
  const entries = Object.entries(scores);

  if (entries.length === 0) {
    return null;
  }

  entries.sort((a, b) => b[1] - a[1]);

  return entries[0][0] as T;
}

/**
 * Match keyword rules against normalized text.
 * Supports both single-word and multi-word phrases.
 */
export function matchKeywords(
  text: string,
  rules: KeywordRule[]
): KeywordRule[] {
  const normalized = normalizeText(text);

  return rules.filter((rule) =>
    normalized.includes(rule.keyword.toLowerCase())
  );
}