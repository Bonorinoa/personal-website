import { useNavigate } from 'react-router-dom';
import { useMode } from '@/hooks/useMode';
import { Switch } from '@/components/ui/switch';
import { BookOpen, Code } from 'lucide-react';

export function ModeToggle() {
  const { mode, toggleMode, isAcademic } = useMode();
  const navigate = useNavigate();

  const handleToggle = () => {
    toggleMode();
    navigate(isAcademic ? '/build' : '/academic');
  };

  if (!mode) return null;

  return (
    <div className="flex items-center gap-2">
      <BookOpen className={`w-4 h-4 transition-colors ${isAcademic ? 'text-amber-600' : 'text-muted-foreground'}`} />
      <Switch
        checked={!isAcademic}
        onCheckedChange={handleToggle}
        className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-amber-500"
      />
      <Code className={`w-4 h-4 transition-colors ${!isAcademic ? 'text-blue-600' : 'text-muted-foreground'}`} />
    </div>
  );
}
