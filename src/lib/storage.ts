// src/lib/storage.ts
//
// Small wrapper around sessionStorage for keeping a history of triaged
// issues for the current browser session. Nothing here is persisted to a
// server or database on purpose - see README for the reasoning.

import { ClassificationResult } from "@/types/issue";
import { HISTORY_STORAGE_KEY, MAX_HISTORY_ENTRIES } from "@/lib/constants";

export interface HistoryEntry extends ClassificationResult {
  id: string;
  title: string;
  module: string;
  createdAt: string;
}

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function loadHistory(): HistoryEntry[] {
  if (!isBrowser()) return [];

  try {
    const raw = window.sessionStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as HistoryEntry[]) : [];
  } catch {
    // Corrupt or unreadable data shouldn't crash the app.
    return [];
  }
}

export function saveHistoryEntry(entry: HistoryEntry): HistoryEntry[] {
  const current = loadHistory();
  const updated = [entry, ...current].slice(0, MAX_HISTORY_ENTRIES);

  if (isBrowser()) {
    try {
      window.sessionStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // sessionStorage can throw if quota is exceeded or storage is disabled.
      // We fail silently, the entry is still returned for in-memory use.
    }
  }

  return updated;
}

export function clearHistory(): void {
  if (!isBrowser()) return;

  try {
    window.sessionStorage.removeItem(HISTORY_STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function makeEntryId(): string {
  if (isBrowser() && "randomUUID" in window.crypto) {
    return window.crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
