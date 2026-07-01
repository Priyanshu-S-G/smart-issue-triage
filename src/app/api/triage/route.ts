// src/app/api/triage/route.ts

import { NextResponse } from "next/server";
import { validateIssue } from "@/lib/triage/validateIssue";
import { classifyIssue } from "@/lib/triage/classifyIssue";
import { IssueInput } from "@/types/issue";

export async function POST(request: Request) {
  let body: Partial<IssueInput>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400 }
    );
  }

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return NextResponse.json(
      { error: "Request body must be a JSON object." },
      { status: 400 }
    );
  }

  const validation = validateIssue(body);

  if (!validation.isValid) {
    return NextResponse.json(
      { error: "Validation failed.", errors: validation.errors },
      { status: 400 }
    );
  }

  const result = classifyIssue(body as IssueInput);

  return NextResponse.json(result, { status: 200 });
}
