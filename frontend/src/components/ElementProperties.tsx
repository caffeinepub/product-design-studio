import React from 'react';
import type { DesignElement } from '../types/design';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import ColorPicker from './ColorPicker';

interface ElementPropertiesProps {
  element: DesignElement;
  onUpdate: (id: string, updates: Partial<DesignElement>) => void;
}

export default function ElementProperties({ element, onUpdate }: ElementPropertiesProps) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-widest text-sidebar-foreground/50 px-1">
        Properties
      </p>

      {element.kind === 'text' && (
        <>
          <div className="space-y-1.5">
            <Label className="text-xs text-sidebar-foreground/60">Text Content</Label>
            <Input
              value={element.content ?? ''}
              onChange={e => onUpdate(element.id, { content: e.target.value })}
              className="h-8 text-sm bg-sidebar-accent border-sidebar-border text-sidebar-foreground placeholder:text-sidebar-foreground/30"
              placeholder="Enter text..."
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-sidebar-foreground/60">
              Font Size: {element.fontSize ?? 20}px
            </Label>
            <Slider
              min={8}
              max={72}
              step={1}
              value={[element.fontSize ?? 20]}
              onValueChange={([v]) => onUpdate(element.id, { fontSize: v })}
              className="w-full"
            />
          </div>
        </>
      )}

      <ColorPicker
        label="Color"
        value={element.color}
        onChange={color => onUpdate(element.id, { color })}
      />

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <Label className="text-xs text-sidebar-foreground/60">Width</Label>
          <Input
            type="number"
            value={Math.round(element.size.width)}
            onChange={e => onUpdate(element.id, { size: { ...element.size, width: Number(e.target.value) } })}
            className="h-7 text-xs bg-sidebar-accent border-sidebar-border text-sidebar-foreground"
            min={10}
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-sidebar-foreground/60">Height</Label>
          <Input
            type="number"
            value={Math.round(element.size.height)}
            onChange={e => onUpdate(element.id, { size: { ...element.size, height: Number(e.target.value) } })}
            className="h-7 text-xs bg-sidebar-accent border-sidebar-border text-sidebar-foreground"
            min={10}
          />
        </div>
      </div>
    </div>
  );
}
