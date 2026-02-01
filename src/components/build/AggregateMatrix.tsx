import { useMemo } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { getBuildArtifacts } from '@/lib/artifacts';
import { AI_TASK_METADATA, LLM_MODEL_METADATA, ALL_TASKS, ALL_MODELS, type AITask, type LLMModel } from '@/data/llm-tasks';

export function AggregateMatrix() {
  const aggregateData = useMemo(() => {
    const artifacts = getBuildArtifacts();
    
    // Count (model, task) pairs across all projects
    const counts: Record<LLMModel, Record<AITask, number>> = {} as any;
    const modelTotals: Record<LLMModel, number> = {} as any;
    const taskTotals: Record<AITask, number> = {} as any;
    
    ALL_MODELS.forEach(m => {
      counts[m] = {} as any;
      modelTotals[m] = 0;
      ALL_TASKS.forEach(t => {
        counts[m][t] = 0;
        if (!taskTotals[t]) taskTotals[t] = 0;
      });
    });
    
    artifacts.forEach(artifact => {
      if (artifact.collaboration_breakdown?.matrix) {
        artifact.collaboration_breakdown.matrix.forEach(({ model, tasks }) => {
          tasks.forEach(task => {
            counts[model][task]++;
            modelTotals[model]++;
            taskTotals[task]++;
          });
        });
      }
    });
    
    // Filter to only show used models and tasks
    const usedModels = ALL_MODELS.filter(m => modelTotals[m] > 0);
    const usedTasks = ALL_TASKS.filter(t => taskTotals[t] > 0);
    const maxCount = Math.max(...Object.values(counts).flatMap(m => Object.values(m)));
    
    return { counts, modelTotals, taskTotals, usedModels, usedTasks, maxCount };
  }, []);

  const { counts, modelTotals, taskTotals, usedModels, usedTasks, maxCount } = aggregateData;

  if (usedModels.length === 0) {
    return null;
  }

  return (
    <TooltipProvider>
      <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-slate-200/50 p-6 mb-8">
        <h2 className="text-lg font-semibold text-slate-700 mb-4">
          AI Collaboration Patterns
        </h2>
        <p className="text-sm text-slate-500 mb-4">
          Aggregate usage of LLMs across all projects. Cell intensity indicates frequency.
        </p>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="p-2 text-left text-slate-500 font-medium border-b border-slate-200">
                  Model
                </th>
                {usedTasks.map(task => (
                  <th key={task} className="p-2 text-center border-b border-slate-200">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex flex-col items-center gap-0.5 cursor-help">
                          <span className="text-base">{AI_TASK_METADATA[task].icon}</span>
                          <span className="text-xs text-slate-400 font-normal">
                            {AI_TASK_METADATA[task].label}
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p className="font-semibold">{AI_TASK_METADATA[task].label}</p>
                        <p className="text-xs text-muted-foreground">{AI_TASK_METADATA[task].description}</p>
                        <p className="text-xs mt-1">Total uses: {taskTotals[task]}</p>
                      </TooltipContent>
                    </Tooltip>
                  </th>
                ))}
                <th className="p-2 text-center border-b border-slate-200 text-slate-400 font-normal text-xs">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {usedModels.map(model => (
                <tr key={model} className="hover:bg-slate-50/50">
                  <td className="p-2 border-b border-slate-100">
                    <span 
                      className="font-medium"
                      style={{ color: LLM_MODEL_METADATA[model].color }}
                    >
                      {LLM_MODEL_METADATA[model].label}
                    </span>
                  </td>
                  {usedTasks.map(task => {
                    const count = counts[model][task];
                    const opacity = maxCount > 0 ? Math.max(0.1, count / maxCount) : 0;
                    
                    return (
                      <td key={task} className="p-2 text-center border-b border-slate-100">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div 
                              className="w-8 h-8 rounded-lg mx-auto flex items-center justify-center transition-all cursor-help"
                              style={{ 
                                backgroundColor: count > 0 
                                  ? `${LLM_MODEL_METADATA[model].color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`
                                  : 'hsl(var(--muted) / 0.2)',
                              }}
                            >
                              {count > 0 && (
                                <span className="text-xs font-semibold text-white drop-shadow-sm">
                                  {count}
                                </span>
                              )}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            <p className="font-semibold">
                              {LLM_MODEL_METADATA[model].label} × {AI_TASK_METADATA[task].label}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Used in {count} project{count !== 1 ? 's' : ''}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </td>
                    );
                  })}
                  <td className="p-2 text-center border-b border-slate-100">
                    <span className="text-sm font-semibold text-slate-600">
                      {modelTotals[model]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-50/50">
                <td className="p-2 text-slate-500 font-medium text-xs">
                  Total
                </td>
                {usedTasks.map(task => (
                  <td key={task} className="p-2 text-center">
                    <span className="text-xs font-semibold text-slate-500">
                      {taskTotals[task]}
                    </span>
                  </td>
                ))}
                <td className="p-2 text-center">
                  <span className="text-sm font-bold text-slate-700">
                    {Object.values(modelTotals).reduce((a, b) => a + b, 0)}
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        
        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-500">
          <span className="font-medium">Models:</span>
          {usedModels.map(model => (
            <span 
              key={model}
              className="inline-flex items-center gap-1"
            >
              <div 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: LLM_MODEL_METADATA[model].color }}
              />
              {LLM_MODEL_METADATA[model].label}
            </span>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
}
