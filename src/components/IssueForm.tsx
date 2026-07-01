"use client";

// src/components/IssueForm.tsx

import { FormEvent, useState } from "react";
import { ClassificationResult, Impact, Reproducible } from "@/types/issue";
import { IMPACT_OPTIONS, REPRODUCIBLE_OPTIONS } from "@/lib/constants";

export interface IssueFormValues {
  title: string;
  description: string;
  module: string;
  impact: Impact | "";
  reproducible: Reproducible | "";
  logs: string;
}

const EMPTY_FORM: IssueFormValues = {
  title: "",
  description: "",
  module: "",
  impact: "",
  reproducible: "",
  logs: "",
};

interface IssueFormProps {
  onClassified: (result: ClassificationResult, submitted: IssueFormValues) => void;
}

export default function IssueForm({ onClassified }: IssueFormProps) {
  const [values, setValues] = useState<IssueFormValues>(EMPTY_FORM);
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField<K extends keyof IssueFormValues>(
    key: K,
    value: IssueFormValues[K]
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors([]);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/triage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: values.title,
          description: values.description,
          module: values.module,
          impact: values.impact || undefined,
          reproducible: values.reproducible || undefined,
          logs: values.logs || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors(
          Array.isArray(data.errors) && data.errors.length > 0
            ? data.errors
            : [data.error ?? "Something went wrong. Please try again."]
        );
        return;
      }

      onClassified(data as ClassificationResult, values);
      setValues(EMPTY_FORM);
    } catch {
      setErrors(["Could not reach the triage service. Please try again."]);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit} noValidate>
      {errors.length > 0 && (
        <div className="form-error-summary" role="alert">
          Please fix the following before submitting:
          <ul>
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="form-row">
        <label htmlFor="title">
          Title <span className="hint">(min 5 characters)</span>
        </label>
        <input
          id="title"
          type="text"
          value={values.title}
          onChange={(e) => updateField("title", e.target.value)}
          placeholder="e.g. Payment fails after OTP verification"
          required
        />
      </div>

      <div className="form-row">
        <label htmlFor="description">
          Description <span className="hint">(min 20 characters)</span>
        </label>
        <textarea
          id="description"
          value={values.description}
          onChange={(e) => updateField("description", e.target.value)}
          placeholder="What happened? Steps to reproduce, expected vs actual behavior..."
          required
        />
      </div>

      <div className="form-row">
        <label htmlFor="module">Affected module</label>
        <input
          id="module"
          type="text"
          value={values.module}
          onChange={(e) => updateField("module", e.target.value)}
          placeholder="e.g. checkout, api, dashboard"
          required
        />
      </div>

      <div className="form-row two-col">
        <div className="form-row">
          <label htmlFor="impact">User impact</label>
          <select
            id="impact"
            value={values.impact}
            onChange={(e) => updateField("impact", e.target.value as Impact)}
            required
          >
            <option value="" disabled>
              Select impact
            </option>
            {IMPACT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <label htmlFor="reproducible">Reproducible</label>
          <select
            id="reproducible"
            value={values.reproducible}
            onChange={(e) =>
              updateField("reproducible", e.target.value as Reproducible)
            }
            required
          >
            <option value="" disabled>
              Select status
            </option>
            {REPRODUCIBLE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-row">
        <label htmlFor="logs">
          Logs / error message <span className="hint">(optional)</span>
        </label>
        <textarea
          id="logs"
          value={values.logs}
          onChange={(e) => updateField("logs", e.target.value)}
          placeholder="Paste any relevant stack trace or console output"
        />
      </div>

      <div className="actions">
        <button className="btn-primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Triaging..." : "Submit for triage"}
        </button>
      </div>
    </form>
  );
}
