import { NextResponse } from "next/server";
import { buildArcadsAuthUrl } from "@/lib/integrations/arcadsMcp";
import { publicOrigin } from "@/lib/http";

export const runtime = "nodejs";

/**
 * GET /api/integrations/arcads/start
 * Enregistre le client OAuth si besoin puis redirige vers la connexion Arcads.
 */
export async function GET(req: Request) {
  try {
    const origin = publicOrigin(req);
    const authUrl = await buildArcadsAuthUrl(origin);
    return NextResponse.redirect(authUrl);
  } catch (err) {
    console.error("[arcads/start]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erreur OAuth Arcads" },
      { status: 500 }
    );
  }
}
