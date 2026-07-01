// tests/validateIssue.test.ts

import { describe, expect, it } from "vitest";
import { validateIssue } from "../src/lib/triage/validateIssue";

describe("validateIssue", () => {
  it("passes for a fully valid issue", () => {
    const result = validateIssue({
      title: "Checkout page crashes",
      description: "Checkout crashes when the user applies a discount code.",
      module: "checkout",
      impact: "major",
      reproducible: "yes",
    });

    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("rejects an empty title", () => {
    const result = validateIssue({
      title: "",
      description: "Checkout crashes when the user applies a discount code.",
      module: "checkout",
      impact: "major",
      reproducible: "yes",
    });

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Title is required.");
  });

  it("rejects a title shorter than 5 characters", () => {
    const result = validateIssue({
      title: "Bug",
      description: "Checkout crashes when the user applies a discount code.",
      module: "checkout",
      impact: "major",
      reproducible: "yes",
    });

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Title must be at least 5 characters.");
  });

  it("rejects a missing description", () => {
    const result = validateIssue({
      title: "Checkout page crashes",
      module: "checkout",
      impact: "major",
      reproducible: "yes",
    });

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Description is required.");
  });

  it("rejects a description shorter than 20 characters", () => {
    const result = validateIssue({
      title: "Checkout page crashes",
      description: "Too short",
      module: "checkout",
      impact: "major",
      reproducible: "yes",
    });

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain(
      "Description must be at least 20 characters."
    );
  });

  it("rejects a missing module", () => {
    const result = validateIssue({
      title: "Checkout page crashes",
      description: "Checkout crashes when the user applies a discount code.",
      impact: "major",
      reproducible: "yes",
    });

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Affected module is required.");
  });

  it("rejects a missing impact", () => {
    const result = validateIssue({
      title: "Checkout page crashes",
      description: "Checkout crashes when the user applies a discount code.",
      module: "checkout",
      reproducible: "yes",
    });

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Impact is required.");
  });

  it("rejects an impact outside the allowed values", () => {
    const result = validateIssue({
      title: "Checkout page crashes",
      description: "Checkout crashes when the user applies a discount code.",
      module: "checkout",
      // @ts-expect-error intentionally invalid value for the test
      impact: "urgent",
      reproducible: "yes",
    });

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain(
      "Impact must be one of: none, minor, major, blocking."
    );
  });

  it("rejects a missing reproducible status", () => {
    const result = validateIssue({
      title: "Checkout page crashes",
      description: "Checkout crashes when the user applies a discount code.",
      module: "checkout",
      impact: "major",
    });

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Reproducible status is required.");
  });

  it("rejects a reproducible value outside the allowed values", () => {
    const result = validateIssue({
      title: "Checkout page crashes",
      description: "Checkout crashes when the user applies a discount code.",
      module: "checkout",
      impact: "major",
      // @ts-expect-error intentionally invalid value for the test
      reproducible: "maybe",
    });

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain(
      "Reproducible must be one of: yes, no, unknown."
    );
  });

  it("rejects logs that are not a string", () => {
    const result = validateIssue({
      title: "Checkout page crashes",
      description: "Checkout crashes when the user applies a discount code.",
      module: "checkout",
      impact: "major",
      reproducible: "yes",
      // @ts-expect-error intentionally invalid value for the test
      logs: 12345,
    });

    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Logs must be a string.");
  });

  it("accepts an issue with no logs, since logs are optional", () => {
    const result = validateIssue({
      title: "Checkout page crashes",
      description: "Checkout crashes when the user applies a discount code.",
      module: "checkout",
      impact: "major",
      reproducible: "yes",
    });

    expect(result.isValid).toBe(true);
  });

  it("collects multiple errors at once for a mostly-empty submission", () => {
    const result = validateIssue({});

    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThanOrEqual(5);
  });
});
