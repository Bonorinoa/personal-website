// Parse GitHub owner/repo from a repo URL. Returns null if not a GitHub repo URL.
export function parseGithubRepo(url?: string | null): { owner: string; repo: string } | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (!/github\.com$/i.test(u.hostname)) return null;
    const parts = u.pathname.replace(/^\/+|\/+$/g, '').split('/');
    if (parts.length < 2) return null;
    const [owner, repo] = parts;
    const cleanRepo = repo.replace(/\.git$/, '');
    if (!owner || !cleanRepo) return null;
    return { owner, repo: cleanRepo };
  } catch {
    return null;
  }
}
