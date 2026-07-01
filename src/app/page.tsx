"use client";

// src/app/page.tsx

import { useEffect, useState } from "react";
import IssueForm, { IssueFormValues } from "@/components/IssueForm";
import ResultCard from "@/components/ResultCard";
import HistoryTable from "@/components/HistoryTable";
import { ClassificationResult } from "@/types/issue";
import {
  HistoryEntry,
  loadHistory,
  saveHistoryEntry,
  makeEntryId,
} from "@/lib/storage";

export default function Home() {
  const [latestResult, setLatestResult] = useState<ClassificationResult | null>(
    null
  );
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  // Hydrate history from sessionStorage once the component mounts in the browser.
  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  function handleClassified(
    result: ClassificationResult,
    submitted: IssueFormValues
  ) {
    setLatestResult(result);

    const entry: HistoryEntry = {
      ...result,
      id: makeEntryId(),
      title: submitted.title,
      module: submitted.module,
      createdAt: new Date().toISOString(),
    };

    setHistory(saveHistoryEntry(entry));
  }

  return (
    <main className="page">
      <div className="page-header">
        <h1>Smart Issue Triage</h1>
        <p>
          Describe a software issue and get an instant category, priority,
          effort estimate, and suggested owner from a local rule-based triage
          engine — no external AI API required.
        </p>
      </div>

      <div className="card">
        <h2>Submit an issue</h2>
        <IssueForm onClassified={handleClassified} />
      </div>

      <ResultCard result={latestResult} />

      <HistoryTable entries={history} />
    </main>
  );
}
