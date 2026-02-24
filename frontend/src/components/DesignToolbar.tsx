import React from 'react';
import type { ToolMode, ShapeKind } from '../types/design';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  MousePointer2,
  Type,
  Square,
  Circle,
  Triangle,
  Trash2,
} from 'lucide-react';

interface DesignToolbarProps {
  toolMode: ToolMode;
  activeShapeKind: ShapeKind;
  selectedElementId: string | null;
  onToolChange: (mode: ToolMode) => void;
  onShapeKindChange: (kind: ShapeKind) => void;
  onDeleteSelected: () => void;
}

const TOOLS: { mode: ToolMode; icon: React.ReactNode; label: string }[] = [
  { mode: 'select', icon: <MousePointer2 className="w-4 h-4" />, label: 'Select & Move' },
  { mode: 'addText', icon: <Type className="w-4 h-4" />, label: 'Add Text' },
  { mode: 'addShape', icon: <Square className="w-4 h-4" />, label: 'Add Shape' },
];

const SHAPES: { kind: ShapeKind; icon: React.ReactNode; label: string }[] = [
  { kind: 'rectangle', icon: <Square className="w-3.5 h-3.5" />, label: 'Rectangle' },
  { kind: 'circle', icon: <Circle className="w-3.5 h-3.5" />, label: 'Circle' },
  { kind: 'triangle', icon: <Triangle className="w-3.5 h-3.5" />, label: 'Triangle' },
];

export default function DesignToolbar({
  toolMode,
  activeShapeKind,
  selectedElementId,
  onToolChange,
  onShapeKindChange,
  onDeleteSelected,
}: DesignToolbarProps) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-semibold uppercase tracking-widest text-sidebar-foreground/50 px-1 mb-2">
        Tools
      </p>
      <div className="flex flex-col gap-1">
        {TOOLS.map(tool => (
          <Tooltip key={tool.mode}>
            <TooltipTrigger asChild>
              <button
                onClick={() => onToolChange(tool.mode)}
                className={`
                  flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-all
                  ${toolMode === tool.mode
                    ? 'bg-accent text-accent-foreground shadow-sm'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                  }
                `}
              >
                {tool.icon}
                {tool.label}
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">{tool.label}</TooltipContent>
          </Tooltip>
        ))}
      </div>

      {toolMode === 'addShape' && (
        <div className="mt-2 pl-2">
          <p className="text-xs text-sidebar-foreground/40 mb-1.5">Shape type</p>
          <div className="flex gap-1.5">
            {SHAPES.map(shape => (
              <Tooltip key={shape.kind}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => onShapeKindChange(shape.kind)}
                    className={`
                      p-2 rounded-md border transition-all
                      ${activeShapeKind === shape.kind
                        ? 'border-accent bg-accent/15 text-accent'
                        : 'border-sidebar-border text-sidebar-foreground/50 hover:border-sidebar-foreground/30 hover:text-sidebar-foreground/80'
                      }
                    `}
                  >
                    {shape.icon}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom">{shape.label}</TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>
      )}

      {selectedElementId && (
        <div className="mt-2 pt-2 border-t border-sidebar-border">
          <button
            onClick={onDeleteSelected}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-destructive hover:bg-destructive/10 transition-all w-full"
          >
            <Trash2 className="w-4 h-4" />
            Delete Selected
          </button>
        </div>
      )}
    </div>
  );
}
