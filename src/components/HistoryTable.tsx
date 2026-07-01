// src/components/HistoryTable.tsx

import { HistoryEntry } from "@/lib/storage";
import { formatConfidence, formatTimestamp } from "@/lib/utils";

interface HistoryTableProps {
  entries: HistoryEntry[];
}

export default function HistoryTable({ entries }: HistoryTableProps) {
  return (
    <div className="card">
      <h2>Session history</h2>

      {entries.length === 0 && (
        <p className="empty-state">
          Issues you triage in this browser session will show up here.
        </p>
      )}

      {entries.length > 0 && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Owner</th>
                <th>Confidence</th>
                <th>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id}>
                  <td className="title-cell">{entry.title}</td>
                  <td>{entry.category}</td>
                  <td>{entry.priority}</td>
                  <td>{entry.owner}</td>
                  <td>{formatConfidence(entry.confidence)}</td>
                  <td>{formatTimestamp(entry.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
