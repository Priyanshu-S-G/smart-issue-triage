// src/lib/constants.ts

import { Impact, Reproducible } from "@/types/issue";

export const IMPACT_OPTIONS: { value: Impact; label: string }[] = [
  { value: "none", label: "None" },
  { value: "minor", label: "Minor" },
  { value: "major", label: "Major" },
  { value: "blocking", label: "Blocking" },
];

export const REPRODUCIBLE_OPTIONS: { value: Reproducible; label: string }[] = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "unknown", label: "Unknown" },
];

// Key used to persist triage history in sessionStorage.
export const HISTORY_STORAGE_KEY = "smart-issue-triage:history";

// Max number of history entries kept in the current session.
export const MAX_HISTORY_ENTRIES = 50;
