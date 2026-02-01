import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Eye, EyeOff, Star, Trash2, ChevronDown, X } from 'lucide-react';
import type { ModeVisibility } from '@/data/types';

interface BulkActionsProps {
  selectedCount: number;
  onClearSelection: () => void;
  onSetVisibility: (visibility: ModeVisibility) => void;
  onToggleFeatured: (featured: boolean) => void;
  onDelete: () => void;
}

export function BulkActions({
  selectedCount,
  onClearSelection,
  onSetVisibility,
  onToggleFeatured,
  onDelete,
}: BulkActionsProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center gap-2 p-3 bg-primary/10 border border-primary/20 rounded-lg">
      <span className="text-sm font-medium">
        {selectedCount} selected
      </span>

      <div className="flex-1" />

      {/* Visibility dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1">
            <Eye className="w-4 h-4" />
            Visibility
            <ChevronDown className="w-3 h-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => onSetVisibility('academic')}>
            Academic Only
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSetVisibility('build')}>
            Build Only
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSetVisibility('both')}>
            Both Modes
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Featured dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1">
            <Star className="w-4 h-4" />
            Featured
            <ChevronDown className="w-3 h-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => onToggleFeatured(true)}>
            <Star className="w-4 h-4 mr-2 fill-amber-500 text-amber-500" />
            Mark as Featured
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onToggleFeatured(false)}>
            <Star className="w-4 h-4 mr-2" />
            Remove Featured
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete with confirmation */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" size="sm" className="gap-1">
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selectedCount} artifacts?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The artifacts will be removed from your local storage.
              To permanently delete them, you'll need to update your artifacts.json file.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Clear selection */}
      <Button variant="ghost" size="sm" onClick={onClearSelection}>
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
}
