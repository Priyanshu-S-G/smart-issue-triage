// tests/api.test.ts

import { describe, expect, it } from "vitest";
import { POST } from "../src/app/api/triage/route";

function makeRequest(body: unknown, raw?: string) {
  return new Request("http://localhost/api/triage", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: raw !== undefined ? raw : JSON.stringify(body),
  });
}

describe("POST /api/triage", () => {
  it("returns a classification for a valid issue", async () => {
    const response = await POST(
      makeRequest({
        title: "Payment fails after OTP verification",
        description:
          "Users are unable to complete checkout after OTP verification. The page freezes and no order is created.",
        module: "checkout",
        impact: "blocking",
        reproducible: "yes",
        logs: "TypeError: Cannot read properties of undefined",
      })
    );

    expect(response.status).toBe(200);

    const data = await response.json();

    expect(data).toHaveProperty("category");
    expect(data).toHaveProperty("priority");
    expect(data).toHaveProperty("effort");
    expect(data).toHaveProperty("owner");
    expect(data).toHaveProperty("confidence");
    expect(data).toHaveProperty("reasoning");
    expect(Array.isArray(data.reasoning)).toBe(true);
    expect(data.category).toBe("bug");
    expect(data.priority).toBe("critical");
  });

  it("returns 400 with validation errors for invalid input", async () => {
    const response = await POST(
      makeRequest({
        title: "",
        description: "Too short",
        module: "",
      })
    );

    expect(response.status).toBe(400);

    const data = await response.json();

    expect(data.error).toBeDefined();
    expect(Array.isArray(data.errors)).toBe(true);
    expect(data.errors.length).toBeGreaterThan(0);
  });

  it("returns 400 for an empty title", async () => {
    const response = await POST(
      makeRequest({
        title: "",
        description: "A perfectly reasonable description that is long enough.",
        module: "checkout",
        impact: "minor",
        reproducible: "yes",
      })
    );

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.errors).toContain("Title is required.");
  });

  it("returns 400 for a missing impact field", async () => {
    const response = await POST(
      makeRequest({
        title: "Checkout page crashes",
        description: "Checkout crashes when the user applies a discount code.",
        module: "checkout",
        reproducible: "yes",
      })
    );

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.errors).toContain("Impact is required.");
  });

  it("returns 400 for malformed JSON in the request body", async () => {
    const response = await POST(makeRequest(undefined, "{ not valid json"));

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toMatch(/JSON/i);
  });

  it("returns 400 when the body is a JSON array instead of an object", async () => {
    const response = await POST(makeRequest([]));

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBeDefined();
  });
});
