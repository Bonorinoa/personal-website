import { ExternalLink, Github, FileCode2, Play, Notebook } from 'lucide-react';
import type { DemoInfo } from '@/data/types';

interface DemoEmbedProps {
  demoInfo: DemoInfo;
  title: string;
}

const DEMO_ICONS = {
  colab: Notebook,
  github: Github,
  vercel: ExternalLink,
  streamlit: Play,
  iframe: ExternalLink,
  video: Play,
};

const DEMO_LABELS = {
  colab: 'Open in Colab',
  github: 'View on GitHub',
  vercel: 'Live Demo',
  streamlit: 'Open App',
  iframe: 'View Demo',
  video: 'Watch Video',
};

const DEMO_COLORS = {
  colab: 'bg-amber-500 hover:bg-amber-600',
  github: 'bg-slate-800 hover:bg-slate-900',
  vercel: 'bg-black hover:bg-slate-800',
  streamlit: 'bg-red-500 hover:bg-red-600',
  iframe: 'bg-blue-500 hover:bg-blue-600',
  video: 'bg-purple-500 hover:bg-purple-600',
};

export function DemoEmbed({ demoInfo, title }: DemoEmbedProps) {
  const Icon = DEMO_ICONS[demoInfo.type];
  const label = DEMO_LABELS[demoInfo.type];
  const colorClass = DEMO_COLORS[demoInfo.type];

  // For GitHub repos, show a preview card
  if (demoInfo.type === 'github') {
    const repoPath = demoInfo.url.replace('https://github.com/', '');
    
    return (
      <div className="relative aspect-video bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg overflow-hidden">
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
          <Github className="w-10 h-10 text-white/60 mb-2" />
          <p className="text-white/80 text-sm font-medium mb-1">{title}</p>
          <p className="text-white/40 text-xs font-mono">{repoPath}</p>
        </div>
        <a
          href={demoInfo.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`absolute bottom-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-xs font-medium ${colorClass} transition-colors`}
        >
          <Icon className="w-3.5 h-3.5" />
          {label}
        </a>
      </div>
    );
  }

  // For Colab notebooks
  if (demoInfo.type === 'colab') {
    return (
      <div className="relative aspect-video bg-gradient-to-br from-amber-50 to-orange-100 rounded-lg overflow-hidden">
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
          <Notebook className="w-10 h-10 text-amber-600/60 mb-2" />
          <p className="text-amber-800 text-sm font-medium mb-1">{title}</p>
          <p className="text-amber-600/60 text-xs">Google Colab Notebook</p>
        </div>
        <a
          href={demoInfo.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`absolute bottom-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-xs font-medium ${colorClass} transition-colors`}
        >
          <Icon className="w-3.5 h-3.5" />
          {label}
        </a>
      </div>
    );
  }

  // For Vercel/deployed apps
  if (demoInfo.type === 'vercel' || demoInfo.type === 'streamlit') {
    return (
      <div className="relative aspect-video bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg overflow-hidden">
        {demoInfo.thumbnail ? (
          <img 
            src={demoInfo.thumbnail} 
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
            <ExternalLink className="w-10 h-10 text-slate-400 mb-2" />
            <p className="text-slate-600 text-sm font-medium mb-1">{title}</p>
            <p className="text-slate-400 text-xs">Live Application</p>
          </div>
        )}
        <a
          href={demoInfo.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`absolute bottom-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-xs font-medium ${colorClass} transition-colors`}
        >
          <Icon className="w-3.5 h-3.5" />
          {label}
        </a>
      </div>
    );
  }

  // Default fallback
  return (
    <div className="relative aspect-video bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg overflow-hidden">
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
        <FileCode2 className="w-10 h-10 text-slate-400 mb-2" />
        <p className="text-slate-600 text-sm font-medium">{title}</p>
      </div>
      <a
        href={demoInfo.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`absolute bottom-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-xs font-medium bg-blue-500 hover:bg-blue-600 transition-colors`}
      >
        <Icon className="w-3.5 h-3.5" />
        {label}
      </a>
    </div>
  );
}
