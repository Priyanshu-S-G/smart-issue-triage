// src/lib/triage/keywords.ts

import { KeywordRule } from "../../types/issue";

export const KEYWORD_RULES: KeywordRule[] = [
  // ==========================
  // Bug
  // ==========================
  {
    keyword: "crash",
    category: "bug",
    owner: "backend",
    weight: 5,
    reason: "Application crash indicates a software bug."
  },
  {
    keyword: "typeerror",
    category: "bug",
    owner: "backend",
    weight: 6,
    reason: "Runtime TypeError indicates an application bug."
  },
  {
    keyword: "freeze",
    category: "bug",
    owner: "backend",
    weight: 4,
    reason: "Application freezing is characteristic of a bug."
  },
  {
    keyword: "button",
    category: "bug",
    owner: "frontend",
    weight: 3,
    reason: "UI button issue detected."
  },
  {
    keyword: "alignment",
    category: "bug",
    owner: "frontend",
    weight: 4,
    reason: "Layout/alignment issue detected."
  },
  {
    keyword: "mobile",
    category: "bug",
    owner: "frontend",
    weight: 4,
    reason: "Mobile-specific issue detected."
  },
  {
    keyword: "server",
    category: "bug",
    owner: "backend",
    weight: 4,
    reason: "Server-side issue detected."
  },
  {
    keyword: "upload",
    category: "bug",
    owner: "backend",
    weight: 4,
    reason: "Upload functionality affected."
  },

  // ==========================
  // Security
  // ==========================
  {
    keyword: "jwt",
    category: "security",
    owner: "security",
    weight: 8,
    reason: "JWT exposure is a security concern."
  },
  {
    keyword: "token",
    category: "security",
    owner: "security",
    weight: 7,
    reason: "Sensitive token detected."
  },
  {
    keyword: "unauthorized",
    category: "security",
    owner: "security",
    weight: 8,
    reason: "Unauthorized access indicates a security issue."
  },
  {
    keyword: "password",
    category: "security",
    owner: "security",
    weight: 8,
    reason: "Password exposure is a security issue."
  },
  {
    keyword: "authorization",
    category: "security",
    owner: "security",
    weight: 8,
    reason: "Authorization issue detected."
  },
  {
    keyword: "permission",
    category: "security",
    owner: "security",
    weight: 7,
    reason: "Permission issue detected."
  },
  {
    keyword: "sql injection",
    category: "security",
    owner: "security",
    weight: 10,
    reason: "SQL injection vulnerability detected."
  },
  {
    keyword: "xss",
    category: "security",
    owner: "security",
    weight: 10,
    reason: "Cross-site scripting vulnerability detected."
  },
  {
    keyword: "leak",
    category: "security",
    owner: "security",
    weight: 8,
    reason: "Sensitive information leak detected."
  },

  // ==========================
  // Performance
  // ==========================
  {
    keyword: "slow",
    category: "performance",
    owner: "backend",
    weight: 5,
    reason: "Slow response indicates a performance issue."
  },
  {
    keyword: "latency",
    category: "performance",
    owner: "backend",
    weight: 5,
    reason: "High latency indicates degraded performance."
  },
  {
    keyword: "response time",
    category: "performance",
    owner: "backend",
    weight: 6,
    reason: "Response time degradation detected."
  },
  {
    keyword: "4s",
    category: "performance",
    owner: "backend",
    weight: 5,
    reason: "High response time detected."
  },

  // ==========================
  // Feature
  // ==========================
  {
    keyword: "feature",
    category: "feature",
    owner: "product",
    weight: 4,
    reason: "Explicit feature request detected."
  },
  {
    keyword: "dark mode",
    category: "feature",
    owner: "frontend",
    weight: 6,
    reason: "Dark mode is a frontend feature request."
  },

  // ==========================
  // Documentation
  // ==========================
  {
    keyword: "documentation",
    category: "documentation",
    owner: "product",
    weight: 6,
    reason: "Documentation-related request detected."
  },
  {
    keyword: "readme",
    category: "documentation",
    owner: "product",
    weight: 5,
    reason: "README change requested."
  },
  {
    keyword: "typo",
    category: "documentation",
    owner: "product",
    weight: 4,
    reason: "Typographical error in documentation."
  },
  {
    keyword: "docker",
    category: "documentation",
    owner: "product",
    weight: 5,
    reason: "Docker documentation requested."
  },

  // ==========================
  // AI / ML
  // ==========================
  {
    keyword: "model",
    owner: "ai-ml",
    weight: 5,
    reason: "Machine learning model referenced."
  },
  {
    keyword: "prediction",
    owner: "ai-ml",
    weight: 5,
    reason: "Prediction pipeline referenced."
  },
  {
    keyword: "accuracy",
    owner: "ai-ml",
    weight: 6,
    reason: "Model accuracy issue detected."
  },
  {
    keyword: "import",
    owner: "ai-ml",
    weight: 4,
    reason: "Data import referenced."
  },
  // Business-critical flows
  {
    keyword: "payment",
    category: "bug",
    owner: "backend",
    weight: 5,
    priorityBoost: 2,
    reason: "Payment flow affects a business-critical path."
  },
  {
    keyword: "checkout",
    category: "bug",
    owner: "backend",
    weight: 5,
    priorityBoost: 2,
    reason: "Checkout flow affects a business-critical path."
  },
  {
    keyword: "login",
    category: "bug",
    owner: "backend",
    weight: 4,
    priorityBoost: 2,
    reason: "Login issues affect user access."
  },
  {
    keyword: "authentication",
    category: "security",
    owner: "security",
    weight: 7,
    priorityBoost: 2,
    reason: "Authentication issues may impact security and user access."
  },
  {
    keyword: "data loss",
    category: "bug",
    owner: "backend",
    weight: 8,
    priorityBoost: 3,
    effortHint: "large",
    reason: "Potential data loss is a high-severity issue."
  },
];

export const BUSINESS_CRITICAL_MODULES = new Set([
  "payment",
  "checkout",
  "billing",
  "login",
  "authentication",
  "admin"
]);

export const FRONTEND_MODULES = new Set([
  "ui",
  "dashboard",
  "mobile",
  "frontend"
]);

export const BACKEND_MODULES = new Set([
  "api",
  "server",
  "database",
  "checkout",
  "payment",
  "upload"
]);

export const DEVOPS_MODULES = new Set([
  "docker",
  "deployment",
  "ci",
  "pipeline",
  "kubernetes"
]);