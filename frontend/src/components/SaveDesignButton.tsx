import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { useSaveProject } from '../hooks/useQueries';
import type { DesignState } from '../types/design';
import type { DesignElement as BackendDesignElement } from '../backend';
import { DesignElementType } from '../backend';
import { Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface SaveDesignButtonProps {
  state: DesignState;
  onProjectIdSet: (id: string) => void;
  onProjectNameSet: (name: string) => void;
}

function generateId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export default function SaveDesignButton({ state, onProjectIdSet, onProjectNameSet }: SaveDesignButtonProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(state.projectName);
  const saveProject = useSaveProject();

  const handleSave = async () => {
    const projectId = state.projectId ?? generateId();
    const projectName = name.trim() || 'My Design';

    const backendElements: BackendDesignElement[] = state.elements.map(el => ({
      elementType: el.kind === 'text' ? DesignElementType.text : DesignElementType.shape,
      position: { x: el.position.x, y: el.position.y },
      size: { width: el.size.width, height: el.size.height },
      content: el.content ?? el.shapeKind ?? '',
      color: el.color,
    }));

    try {
      await saveProject.mutateAsync({
        projectId,
        productType: state.productType,
        baseColor: state.baseColor,
        designElements: backendElements,
        name: projectName,
      });
      onProjectIdSet(projectId);
      onProjectNameSet(projectName);
      toast.success(`"${projectName}" saved successfully!`);
      setOpen(false);
    } catch (err) {
      toast.error('Failed to save design. Please try again.');
    }
  };

  return (
    <>
      <Button
        onClick={() => { setName(state.projectName); setOpen(true); }}
        className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold"
        size="sm"
      >
        <Save className="w-4 h-4 mr-2" />
        Save Design
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-serif">Save Design</DialogTitle>
            <DialogDescription>Give your design a name to save it.</DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <Label htmlFor="design-name" className="text-sm font-medium mb-2 block">
              Design Name
            </Label>
            <Input
              id="design-name"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
              placeholder="e.g. Summer Collection Tee"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button
              onClick={handleSave}
              disabled={saveProject.isPending}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              {saveProject.isPending ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</>
              ) : (
                <><Save className="w-4 h-4 mr-2" />Save</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
