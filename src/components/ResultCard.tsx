// src/components/ResultCard.tsx

import { ClassificationResult } from "@/types/issue";
import { formatConfidence } from "@/lib/utils";

interface ResultCardProps {
  result: ClassificationResult | null;
}

const PRIORITY_BADGE_CLASS: Record<string, string> = {
  low: "badge-priority-low",
  medium: "badge-priority-medium",
  high: "badge-priority-high",
  critical: "badge-priority-critical",
};

export default function ResultCard({ result }: ResultCardProps) {
  return (
    <div className="card">
      <h2>Triage result</h2>

      {!result && (
        <p className="empty-state">
          Submit an issue to see its category, priority, effort, and owner.
        </p>
      )}

      {result && (
        <>
          <div className="result-header">
            <span className="badge badge-category">{result.category}</span>
            <span
              className={`badge ${
                PRIORITY_BADGE_CLASS[result.priority] ?? "badge-priority-medium"
              }`}
            >
              {result.priority}
            </span>
            <span className="badge badge-effort">{result.effort} effort</span>
            <span className="badge badge-owner">{result.owner}</span>
          </div>

          <div className="confidence-wrap">
            <div className="confidence-label">
              <span>Confidence</span>
              <span>{formatConfidence(result.confidence)}</span>
            </div>
            <div className="confidence-bar">
              <div
                className="confidence-bar-fill"
                style={{ width: formatConfidence(result.confidence) }}
              />
            </div>
          </div>

          <div>
            <label>Reasoning</label>
            {result.reasoning.length > 0 ? (
              <ul className="reasoning-list">
                {result.reasoning.map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
              </ul>
            ) : (
              <p className="empty-state">
                No specific signals were matched; this is a low-confidence
                default classification.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
