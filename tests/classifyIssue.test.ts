// tests/classifyIssue.test.ts

import { describe, expect, it } from "vitest";
import { classifyIssue } from "../src/lib/triage/classifyIssue";
import { IssueInput } from "../src/types/issue";

describe("classifyIssue - visible test cases", () => {
  it("TC-01: blocking checkout crash with a TypeError log is a critical backend bug", () => {
    const result = classifyIssue({
      title: "Checkout freezes after OTP verification",
      description:
        "Users are unable to complete checkout after OTP verification. The page freezes and no order is created.",
      module: "checkout",
      impact: "blocking",
      reproducible: "yes",
      logs: "TypeError: Cannot read properties of undefined",
    });

    expect(result.category).toBe("bug");
    expect(result.priority).toBe("critical");
    expect(result.owner).toBe("backend");
  });

  it("TC-02: minor mobile alignment issue is a low priority frontend bug", () => {
    const result = classifyIssue({
      title: "Button alignment broken on mobile",
      description:
        "The submit button alignment is broken on mobile screens, it overlaps other elements.",
      module: "ui",
      impact: "minor",
      reproducible: "yes",
    });

    expect(result.category).toBe("bug");
    expect(result.priority).toBe("low");
    expect(result.owner).toBe("frontend");
  });

  it("TC-03: JWT token exposure is classified as a security issue owned by security", () => {
    const result = classifyIssue({
      title: "JWT token visible in browser console",
      description:
        "The JWT token is visible in the browser console logs, which could allow session hijacking.",
      module: "auth",
      impact: "major",
      reproducible: "yes",
    });

    expect(result.category).toBe("security");
    expect(result.owner).toBe("security");
  });

  it("TC-04: a dark mode request is a frontend feature", () => {
    const result = classifyIssue({
      title: "Need dark mode option in dashboard",
      description:
        "Users have requested a dark mode feature option for the dashboard to reduce eye strain at night.",
      module: "dashboard",
      impact: "minor",
      reproducible: "unknown",
    });

    expect(result.category).toBe("feature");
    expect(result.owner).toBe("frontend");
  });

  it("TC-05: rising API response time is a backend performance issue", () => {
    const result = classifyIssue({
      title: "API response time increased",
      description:
        "API response time increased from 200ms to 4s under normal load, causing latency issues across the app.",
      module: "api",
      impact: "major",
      reproducible: "yes",
    });

    expect(result.category).toBe("performance");
    expect(result.owner).toBe("backend");
  });

  it("TC-06: docker setup instructions is a low-priority documentation request", () => {
    const result = classifyIssue({
      title: "Add setup instructions for Docker installation",
      description:
        "The README is missing documentation and setup instructions for Docker installation for new developers.",
      module: "docs",
      impact: "none",
      reproducible: "unknown",
    });

    expect(result.category).toBe("documentation");
    expect(result.priority).toBe("low");
    expect(result.owner).toBe("product");
  });

  it("TC-07: dropped model accuracy after a data import is owned by ai-ml with large effort", () => {
    const result = classifyIssue({
      title: "Model prediction accuracy dropped after new data import",
      description:
        "After the latest data import, the model prediction accuracy dropped significantly compared to before.",
      module: "ml-pipeline",
      impact: "major",
      reproducible: "yes",
    });

    expect(result.owner).toBe("ai-ml");
    expect(result.effort).toBe("large");
  });

  it("TC-08: unauthorized admin access is a high-severity security issue", () => {
    const result = classifyIssue({
      title: "Unauthorized users can access admin page",
      description:
        "Unauthorized users can access the admin page without proper authorization checks in place.",
      module: "admin",
      impact: "blocking",
      reproducible: "yes",
    });

    expect(result.category).toBe("security");
    expect(result.owner).toBe("security");
    expect(["high", "critical"]).toContain(result.priority);
  });

  it("TC-09: a documentation typo stays low priority", () => {
    const result = classifyIssue({
      title: "Typo in privacy policy page",
      description:
        "There is a small typo in the privacy policy page under the documentation section.",
      module: "docs",
      impact: "none",
      reproducible: "yes",
    });

    expect(result.category).toBe("documentation");
    expect(result.priority).toBe("low");
  });

  it("TC-10: server crash on large uploads is a backend bug", () => {
    const result = classifyIssue({
      title: "Server crashes when uploading large files",
      description:
        "The server crashes when uploading files larger than 20MB, causing an application crash.",
      module: "upload",
      impact: "major",
      reproducible: "yes",
    });

    expect(result.category).toBe("bug");
    expect(result.owner).toBe("backend");
  });
});

describe("classifyIssue - classification expectations from the spec", () => {
  const base: IssueInput = {
    title: "Something is broken in the app",
    description: "General description that is long enough to pass validation.",
    module: "misc",
    impact: "minor",
    reproducible: "yes",
  };

  it("increases priority when impact is blocking, compared to the same issue as minor", () => {
    const minorResult = classifyIssue({ ...base, impact: "minor" });
    const blockingResult = classifyIssue({ ...base, impact: "blocking" });

    const priorityRank = { low: 0, medium: 1, high: 2, critical: 3 };
    expect(priorityRank[blockingResult.priority]).toBeGreaterThan(
      priorityRank[minorResult.priority]
    );
  });

  it("increases severity for business-critical modules like payment and login", () => {
    const genericModule = classifyIssue({ ...base, module: "misc" });
    const paymentModule = classifyIssue({ ...base, module: "payment" });

    const priorityRank = { low: 0, medium: 1, high: 2, critical: 3 };
    expect(priorityRank[paymentModule.priority]).toBeGreaterThanOrEqual(
      priorityRank[genericModule.priority]
    );
  });

  it("does not push a documentation-only request to high priority unless impact is blocking", () => {
    const result = classifyIssue({
      title: "Update onboarding documentation",
      description:
        "The onboarding documentation is outdated and needs a refresh with new screenshots.",
      module: "docs",
      impact: "minor",
      reproducible: "unknown",
    });

    expect(result.priority).not.toBe("critical");
    expect(result.priority).not.toBe("high");
  });

  it("gives security keywords enough weight to win the category over a generic bug signal", () => {
    const result = classifyIssue({
      title: "Possible SQL injection in search endpoint",
      description:
        "The search endpoint appears vulnerable to SQL injection through the query parameter.",
      module: "api",
      impact: "major",
      reproducible: "unknown",
    });

    expect(result.category).toBe("security");
    expect(result.owner).toBe("security");
  });

  it("reduces confidence for a long but vague description with no keyword matches", () => {
    const vague = classifyIssue({
      title: "Something feels off lately",
      description:
        "Not really sure what is going on but things have generally felt a bit strange and slow in various parts of the product over the past little while, hard to pin down exactly.",
      module: "misc",
      impact: "minor",
      reproducible: "unknown",
    });

    const specific = classifyIssue({
      title: "Login page crashes on submit",
      description:
        "The login page crashes with a TypeError whenever a user submits the form.",
      module: "login",
      impact: "major",
      reproducible: "yes",
    });

    expect(vague.confidence).toBeLessThan(specific.confidence);
  });

  it("increases confidence when the issue is marked reproducible", () => {
    const reproducible = classifyIssue({ ...base, reproducible: "yes" });
    const unknownRepro = classifyIssue({ ...base, reproducible: "unknown" });

    expect(reproducible.confidence).toBeGreaterThan(unknownRepro.confidence);
  });

  it("keeps confidence within the 0 to 1 range", () => {
    const result = classifyIssue({
      title: "SQL injection, XSS, and leaked password all at once",
      description:
        "A user found SQL injection, an XSS vector, and a leaked password token all in the same authorization flow.",
      module: "auth",
      impact: "blocking",
      reproducible: "yes",
    });

    expect(result.confidence).toBeGreaterThanOrEqual(0);
    expect(result.confidence).toBeLessThanOrEqual(1);
  });

  it("falls back to 'other' category and 'product' owner when no keywords or module hints match", () => {
    const result = classifyIssue({
      title: "Unclear request from a stakeholder",
      description:
        "A stakeholder mentioned something in a meeting but it was not written down clearly anywhere.",
      module: "zzz-unknown-module",
      impact: "none",
      reproducible: "unknown",
    });

    expect(result.category).toBe("other");
    expect(result.owner).toBe("product");
  });
});
