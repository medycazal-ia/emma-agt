import { NextResponse } from "next/server";
import { exchangeCodeForTokens, saveTokens } from "@/lib/integrations/google";
import { publicOrigin } from "@/lib/http";

export const runtime = "nodejs";

/**
 * GET /api/integrations/google/callback?code=xxx
 * Callback OAuth Google. Échange le code contre tokens + persiste + redirige vers /settings.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const origin = publicOrigin(req);
  const code = url.searchParams.get("code");
  const oauthError = url.searchParams.get("error");

  if (oauthError) {
    return NextResponse.redirect(
      new URL(`/settings?google_error=${encodeURIComponent(oauthError)}`, origin)
    );
  }
  if (!code) {
    return NextResponse.redirect(
      new URL("/settings?google_error=missing_code", origin)
    );
  }

  try {
    const tokens = await exchangeCodeForTokens(code);
    await saveTokens(tokens);
    return NextResponse.redirect(new URL("/settings?google=connected", origin));
  } catch (err) {
    const msg = err instanceof Error ? err.message : "exchange_failed";
    return NextResponse.redirect(
      new URL(`/settings?google_error=${encodeURIComponent(msg)}`, origin)
    );
  }
}
