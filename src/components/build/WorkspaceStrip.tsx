const WORKSPACES = [
  { key: 'Personal', desc: 'leanecon-v3 et al.', url: 'https://github.com/Bonorinoa' },
  {
    key: 'EconLLM-Lab',
    desc: 'cultural alignment & open-source tooling',
    url: 'https://github.com/orgs/EconLLM-Lab/repositories',
  },
  { key: 'Perwell', desc: 'wellbeing × AI', url: 'https://github.com/orgs/Perwell/repositories' },
  {
    key: 'Cognitio-EDU',
    desc: 'teaching & learning technology',
    url: 'https://github.com/orgs/Cognitio-EDU/repositories',
  },
];

export const WorkspaceStrip = () => (
  <div className="mt-10 sm:mt-12">
    <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-3">
      Workspaces
    </div>
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
      {WORKSPACES.map((w) => (
        <li key={w.key}>
          <a
            href={w.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col justify-center min-h-[56px] hairline border border-border bg-background hover:bg-foreground/[0.02] hover:border-cobalt/50 transition-colors px-3 py-2.5 h-full"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-xs text-foreground">
                <span className="text-cobalt">/</span> {w.key}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground group-hover:text-cobalt transition-colors">
                github ↗
              </span>
            </div>
            <div className="mt-1 text-[11px] text-muted-foreground leading-snug">
              {w.desc}
            </div>
          </a>
        </li>
      ))}
    </ul>
  </div>
);
