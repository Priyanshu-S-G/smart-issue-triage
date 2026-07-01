// src/types/issue.ts

export type Impact = "none" | "minor" | "major" | "blocking";

export type Reproducible = "yes" | "no" | "unknown";

export type Category =
  | "bug"
  | "feature"
  | "security"
  | "performance"
  | "documentation"
  | "other";

export type Priority =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type Effort =
  | "small"
  | "medium"
  | "large";

export type Owner =
  | "frontend"
  | "backend"
  | "devops"
  | "ai-ml"
  | "security"
  | "product";

export interface IssueInput {
  title: string;
  description: string;
  module: string;
  impact: Impact;
  reproducible: Reproducible;
  logs?: string;
}

export interface ClassificationResult {
  category: Category;
  priority: Priority;
  effort: Effort;
  owner: Owner;
  confidence: number;
  reasoning: string[];
}

export interface KeywordRule {
  keyword: string;

  category?: Category;
  owner?: Owner;

  priorityBoost?: number;
  effortHint?: Effort;

  weight: number;

  reason: string;
}

export interface ScoreMap<T extends string> {
  [key: string]: number;
}

export interface ClassificationScores {
  category: ScoreMap<Category>;
  owner: ScoreMap<Owner>;
  priority: ScoreMap<Priority>;
  effort: ScoreMap<Effort>;
}