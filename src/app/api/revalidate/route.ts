import { timingSafeEqual } from "node:crypto";

import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

import {
  getRevalidationTargets,
  type SanityRevalidationPayload,
} from "@/lib/revalidation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getHookSecret() {
  return (
    process.env.SANITY_REVALIDATE_SECRET?.trim() ||
    process.env.SANITY_API_READ_TOKEN?.trim() ||
    process.env.SANITY_STUDIO_READ_TOKEN?.trim() ||
    ""
  );
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

function hasBearerSecret(request: NextRequest, secret: string) {
  const authorization = request.headers.get("authorization") ?? "";
  const token = authorization.startsWith("Bearer ") ? authorization.slice("Bearer ".length).trim() : "";

  return Boolean(token) && safeEqual(token, secret);
}

function payloadFromSearchParams(searchParams: URLSearchParams): SanityRevalidationPayload {
  return {
    _type: searchParams.get("_type") ?? searchParams.get("type") ?? undefined,
    slug: searchParams.get("slug"),
    previousSlug: searchParams.get("previousSlug"),
    categorySlug: searchParams.get("categorySlug"),
    previousCategorySlug: searchParams.get("previousCategorySlug"),
  };
}

function runRevalidation(payload: SanityRevalidationPayload | null | undefined) {
  const targets = getRevalidationTargets(payload);

  for (const target of targets) {
    revalidatePath(target.path, target.type);
  }

  return targets;
}

function jsonResponse(payload: SanityRevalidationPayload | null | undefined, source: "manual" | "sanity") {
  const targets = runRevalidation(payload);

  return NextResponse.json({
    revalidated: targets.length > 0,
    source,
    documentType: payload?._type ?? null,
    targets,
    now: new Date().toISOString(),
  });
}

export async function GET(request: NextRequest) {
  const secret = getHookSecret();

  if (!secret) {
    return NextResponse.json({ error: "Missing revalidation secret" }, { status: 500 });
  }

  if (!hasBearerSecret(request, secret)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return jsonResponse(payloadFromSearchParams(new URL(request.url).searchParams), "manual");
}

export async function POST(request: NextRequest) {
  const secret = getHookSecret();

  if (!secret) {
    return NextResponse.json({ error: "Missing revalidation secret" }, { status: 500 });
  }

  const { body, isValidSignature } = await parseBody<SanityRevalidationPayload>(request, secret);

  if (!isValidSignature) {
    return NextResponse.json({ error: "Invalid Sanity webhook signature" }, { status: 401 });
  }

  return jsonResponse(body, "sanity");
}
