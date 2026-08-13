import type { Contributor } from '@/hooks/useCommitActivity';

export function agentSplit(contributors?: Contributor[]) {
  if (!contributors || contributors.length === 0) return null;
  const agents = contributors.filter((c) => c.isAgent);
  if (agents.length === 0) return null;
  const total = contributors.reduce((s, c) => s + c.commits, 0);
  if (total === 0) return null;
  const agentCommits = agents.reduce((s, c) => s + c.commits, 0);
  return {
    total,
    agentCommits,
    humanCommits: total - agentCommits,
    agentPct: Math.round((agentCommits / total) * 100),
  };
}

/** Two-segment human/agent commit-share bar. Renders only when an agent contributor exists. */
export function AgentShareBar({ contributors }: { contributors?: Contributor[] }) {
  const split = agentSplit(contributors);
  if (!split) return null;

  return (
    <div
      className="mb-3"
      title={`${split.humanCommits} human commits · ${split.agentCommits} agent commits`}
    >
      <div className="flex h-1 w-full overflow-hidden bg-border">
        <div
          className="h-full bg-foreground/70"
          style={{ width: `${100 - split.agentPct}%` }}
          aria-hidden
        />
        <div
          className="h-full bg-cobalt"
          style={{ width: `${split.agentPct}%` }}
          aria-hidden
        />
      </div>
      <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground tabular-nums">
        {split.agentPct}% agent-authored commits
      </div>
    </div>
  );
}

/** Full per-author breakdown for the modal. */
export function ContributorTable({ contributors }: { contributors?: Contributor[] }) {
  if (!contributors || contributors.length === 0) return null;

  return (
    <div className="space-y-2">
      {contributors.map((c) => (
        <div key={c.login} className="flex items-baseline justify-between gap-4 text-sm">
          <span className="flex items-center gap-2 min-w-0">
            <a
              href={`https://github.com/${c.login}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono truncate hover:text-cobalt transition-colors"
            >
              {c.login}
            </a>
            {c.isAgent && (
              <span className="px-1.5 py-0.5 hairline font-mono text-[10px] uppercase tracking-[0.12em] text-cobalt shrink-0">
                agent
              </span>
            )}
          </span>
          <span className="font-mono text-[11px] text-muted-foreground tabular-nums shrink-0">
            {c.commits} commits · +{c.additions.toLocaleString()} / −{c.deletions.toLocaleString()}
          </span>
        </div>
      ))}
      <p className="text-xs text-muted-foreground leading-relaxed pt-1">
        Counts come straight from GitHub. They measure volume, not judgment — read them next to the
        credit note above, not instead of it.
      </p>
    </div>
  );
}
