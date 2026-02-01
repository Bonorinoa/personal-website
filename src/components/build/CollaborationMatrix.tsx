import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { TaskUsage } from '@/data/types';
import { AI_TASK_METADATA, LLM_MODEL_METADATA, ALL_TASKS, type AITask, type LLMModel } from '@/data/llm-tasks';

interface CollaborationMatrixProps {
  matrix: TaskUsage[];
  compact?: boolean;
}

export function CollaborationMatrix({ matrix, compact = false }: CollaborationMatrixProps) {
  // Get only models that are used in this project
  const usedModels = matrix.map(m => m.model);
  
  // Get only tasks that are used in this project
  const usedTasks = new Set<AITask>();
  matrix.forEach(m => m.tasks.forEach(t => usedTasks.add(t)));
  const tasksArray = ALL_TASKS.filter(t => usedTasks.has(t));
  
  if (compact) {
    return (
      <TooltipProvider>
        <div className="flex flex-wrap gap-1">
          {matrix.map(({ model, tasks }) => (
            <Tooltip key={model}>
              <TooltipTrigger asChild>
                <div 
                  className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-medium"
                  style={{ 
                    backgroundColor: `${LLM_MODEL_METADATA[model].color}20`,
                    color: LLM_MODEL_METADATA[model].color
                  }}
                >
                  <span>{LLM_MODEL_METADATA[model].label}</span>
                  <span className="opacity-60">×{tasks.length}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <p className="font-semibold mb-1">{LLM_MODEL_METADATA[model].label}</p>
                <p className="text-xs text-muted-foreground">
                  {tasks.map(t => AI_TASK_METADATA[t].label).join(', ')}
                </p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <div className="overflow-x-auto">
        <table className="text-xs border-collapse">
          <thead>
            <tr>
              <th className="p-1 text-left text-muted-foreground font-normal"></th>
              {tasksArray.map(task => (
                <th key={task} className="p-1 text-center">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="cursor-help">{AI_TASK_METADATA[task].icon}</span>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p className="font-semibold">{AI_TASK_METADATA[task].label}</p>
                      <p className="text-xs text-muted-foreground">{AI_TASK_METADATA[task].description}</p>
                    </TooltipContent>
                  </Tooltip>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {usedModels.map(model => {
              const modelTasks = matrix.find(m => m.model === model)?.tasks || [];
              return (
                <tr key={model}>
                  <td 
                    className="p-1 font-medium whitespace-nowrap"
                    style={{ color: LLM_MODEL_METADATA[model].color }}
                  >
                    {LLM_MODEL_METADATA[model].label}
                  </td>
                  {tasksArray.map(task => (
                    <td key={task} className="p-1 text-center">
                      {modelTasks.includes(task) ? (
                        <div 
                          className="w-3 h-3 rounded-full mx-auto"
                          style={{ backgroundColor: LLM_MODEL_METADATA[model].color }}
                        />
                      ) : (
                        <div className="w-3 h-3 rounded-full mx-auto bg-muted/30" />
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </TooltipProvider>
  );
}
