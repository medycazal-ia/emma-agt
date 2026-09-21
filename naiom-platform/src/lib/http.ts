/**
 * Origine publique d'une requête entrante.
 *
 * Derrière un reverse proxy (Render, etc.), `req.url` reflète parfois
 * l'adresse interne du conteneur (ex. http://localhost:10000) plutôt que
 * le domaine public — ça casse les redirections OAuth qui doivent revenir
 * vers l'utilisateur. On privilégie donc x-forwarded-host/proto quand ils
 * sont présents.
 */
export function publicOrigin(req: Request): string {
  const host = req.headers.get("x-forwarded-host");
  if (host) {
    const proto = req.headers.get("x-forwarded-proto") ?? "https";
    return `${proto}://${host}`;
  }
  return new URL(req.url).origin;
}
