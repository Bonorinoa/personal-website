import { useEffect, useState } from 'react';
import { ExternalLink, Github, FileText, Star, GitCommit } from 'lucide-react';
import type { Artifact } from '@/data/types';
import { TagBadge } from './TagLegend';
import { CommitSparkline } from './CommitSparkline';
import { parseGithubRepo } from '@/lib/github';
import { useCommitActivity } from '@/hooks/useCommitActivity';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  artifact: Artifact;
  onOpen?: () => void;
}

function relTime(iso: string) {
  if (!iso) return '';
  const days = Math.round((Date.now() - new Date(iso).getTime()) / 86400000);
  if (days < 1) return 'today';
  if (days < 7) return `${days}d ago`;
  const w = Math.round(days / 7);
  if (w < 8) return `${w}w ago`;
  const m = Math.round(days / 30);
  if (m < 12) return `${m}mo ago`;
  return `${Math.round(days / 365)}y ago`;
}

function formatYm(iso?: string) {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

interface SignalsResult {
  langs: string[];
  lastCommit?: ReturnType<typeof useCommitActivity>['lastCommit'];
  repo?: ReturnType<typeof useCommitActivity>['repo'];
  headerDate?: string; // YYYY-MM derived from pushed_at
  homepage?: string;
}

function RepoSignals({ owner, repo, fallbackLang, stars, onData }: {
  owner: string; repo: string; fallbackLang?: string; stars?: number;
  onData?: (r: SignalsResult) => void;
}) {
  const { languages, lastCommit, repo: repoMeta } = useCommitActivity(owner, repo);
  const langs = languages && languages.length > 0
    ? languages.slice(0, 2).map(l => l.name)
    : (fallbackLang ? [fallbackLang] : []);
  const starsShown = repoMeta?.stars ?? stars;

  // Push derived data to the parent so header date / demo link stay verifiable.
  useEffect(() => {
    onData?.({
      langs,
      lastCommit,
      repo: repoMeta,
      headerDate: formatYm(repoMeta?.pushedAt),
      homepage: repoMeta?.homepage,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repoMeta?.pushedAt, repoMeta?.homepage, lastCommit?.sha, languages?.map(l => l.name).join('|')]);

  if (langs.length === 0 && !lastCommit && starsShown === undefined) return null;

  return (
    <div className="mb-3 space-y-1.5">
      {(langs.length > 0 || starsShown !== undefined) && (
        <div className="flex items-center gap-1.5 flex-wrap font-mono text-[10px]">
          {langs.map((name) => (
            <span
              key={name}
              className="px-1.5 py-0.5 hairline text-muted-foreground uppercase tracking-[0.12em]"
            >
              {name}
            </span>
          ))}
          {starsShown !== undefined && (
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              <Star className="w-3 h-3" /> {starsShown}
            </span>
          )}
        </div>
      )}
      {lastCommit && (
        <a
          href={lastCommit.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="group/cm block font-mono text-[11px] text-muted-foreground hover:text-cobalt transition-colors"
          title={`${lastCommit.sha} · ${new Date(lastCommit.date).toLocaleString()}`}
        >
          <span className="inline-flex items-center gap-1.5 max-w-full">
            <GitCommit className="w-3 h-3 shrink-0" />
            <span className="truncate">{lastCommit.message}</span>
          </span>
          <span className="block pl-[18px] text-[10px] tabular-nums opacity-80">
            {lastCommit.sha} · {relTime(lastCommit.date)}
          </span>
        </a>
      )}
    </div>
  );
}

export function ProjectCard({ artifact, onOpen }: ProjectCardProps) {
  const gh = parseGithubRepo(artifact.links?.repo);
  const lang = (artifact as unknown as { language?: string }).language;
  const stars = (artifact as unknown as { stars?: number }).stars;
  const [signals, setSignals] = useState<SignalsResult | null>(null);

  const headerDate = signals?.headerDate || (artifact.date || '').slice(0, 7);
  const demoHref = artifact.links?.demo ?? signals?.homepage;
  const demoIsHomepage = !artifact.links?.demo && !!signals?.homepage;

  return (
    <article
      onClick={onOpen}
      className={cn(
        'group relative h-full flex flex-col p-5 sm:p-6 cursor-pointer bg-background',
        'transition-colors duration-200',
        'hover:bg-secondary/40 focus-within:bg-secondary/40',
        'outline-none focus-visible:ring-1 focus-visible:ring-cobalt'
      )}
      tabIndex={0}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && onOpen) {
          e.preventDefault();
          onOpen();
        }
      }}
    >
      {/* Header row: org/year monoline (year sourced from GitHub pushed_at when available) */}
      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-3">
        <span className="text-cobalt">{artifact.org ?? 'Project'}</span>
        <span title={signals?.repo?.pushedAt ? `Last pushed ${new Date(signals.repo.pushedAt).toLocaleDateString()}` : undefined}>
          {headerDate}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-serif text-xl sm:text-2xl leading-tight tracking-tight mb-2 group-hover:text-cobalt transition-colors">
        {artifact.title}
      </h3>

      {/* Live GitHub signals: languages + last commit */}
      {gh ? (
        <div onClick={(e) => e.stopPropagation()}>
          <RepoSignals owner={gh.owner} repo={gh.repo} fallbackLang={lang} stars={stars} onData={setSignals} />
        </div>
      ) : (
        (lang || stars !== undefined) && (
          <div className="font-mono text-[11px] text-muted-foreground mb-3 flex items-center gap-3">
            {lang && <span>{lang}</span>}
            {stars !== undefined && (
              <span className="inline-flex items-center gap-1">
                <Star className="w-3 h-3" /> {stars}
              </span>
            )}
          </div>
        )
      )}

      {/* Summary */}
      <p className="text-sm text-foreground/80 leading-relaxed line-clamp-3 mb-4">
        {artifact.summary}
      </p>

      {/* Tags */}
      {artifact.tags && artifact.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {artifact.tags.map((tag) => (
            <TagBadge key={tag} tag={tag} size="sm" />
          ))}
        </div>
      )}

      {/* Commit sparkline (real signal) */}
      {gh && (
        <div className="mb-4" onClick={(e) => e.stopPropagation()}>
          <CommitSparkline owner={gh.owner} repo={gh.repo} />
        </div>
      )}

      {/* Footer row: links */}
      <div className="mt-auto pt-4 hairline-t flex items-center gap-4">
        {artifact.links?.repo && (
          <a
            href={artifact.links.repo}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-cobalt transition-colors min-h-[44px] py-2"
            aria-label="Open repository"
          >
            <Github className="w-3.5 h-3.5" /> repo
          </a>
        )}
        {artifact.links?.demo && (
          <a
            href={artifact.links.demo}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-cobalt transition-colors min-h-[44px] py-2"
            aria-label="Open demo"
          >
            <ExternalLink className="w-3.5 h-3.5" /> demo
          </a>
        )}
        {artifact.links?.paper && (
          <a
            href={artifact.links.paper}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-cobalt transition-colors min-h-[44px] py-2"
            aria-label="Open paper"
          >
            <FileText className="w-3.5 h-3.5" /> paper
          </a>
        )}
      </div>
    </article>
  );
}
