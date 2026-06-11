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
      <div className="hairline p-6 mb-8 bg-background">
        <p className="text-sm text-muted-foreground mb-6 max-w-2xl">
          Aggregate usage of LLMs across all projects. Cell intensity indicates frequency.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="p-2 text-left font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground hairline-b">
                  Model
                </th>
                {usedTasks.map((task) => (
                  <th key={task} className="p-2 text-center hairline-b">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex flex-col items-center gap-0.5 cursor-help">
                          <span className="text-base">{AI_TASK_METADATA[task].icon}</span>
                          <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
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
                <th className="p-2 text-center hairline-b font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {usedModels.map((model) => (
                <tr key={model} className="hover:bg-secondary/40">
                  <td className="p-2 hairline-b">
                    <span className="font-mono text-xs uppercase tracking-[0.1em]">
                      {LLM_MODEL_METADATA[model].label}
                    </span>
                  </td>
                  {usedTasks.map((task) => {
                    const count = counts[model][task];
                    const opacity = maxCount > 0 ? Math.max(0.1, count / maxCount) : 0;
                    return (
                      <td key={task} className="p-2 text-center hairline-b">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div
                              className="w-8 h-8 mx-auto flex items-center justify-center transition-all cursor-help font-mono text-xs"
                              style={{
                                backgroundColor:
                                  count > 0
                                    ? `hsl(var(--cobalt) / ${opacity})`
                                    : 'hsl(var(--muted) / 0.4)',
                                color: count > 0 && opacity > 0.4 ? 'white' : 'hsl(var(--foreground))',
                              }}
                            >
                              {count > 0 ? count : ''}
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
                  <td className="p-2 text-center hairline-b">
                    <span className="text-sm font-medium tabular-nums">{modelTotals[model]}</span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td className="p-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  Total
                </td>
                {usedTasks.map((task) => (
                  <td key={task} className="p-2 text-center text-xs tabular-nums">
                    {taskTotals[task]}
                  </td>
                ))}
                <td className="p-2 text-center text-sm font-semibold tabular-nums">
                  {Object.values(modelTotals).reduce((a, b) => a + b, 0)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </TooltipProvider>
  );
}
