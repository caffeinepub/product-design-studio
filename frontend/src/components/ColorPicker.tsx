import React from 'react';
import { Label } from '@/components/ui/label';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
  presets?: string[];
}

const DEFAULT_PRESETS = [
  '#FFFFFF', '#F5F5F5', '#E5E7EB', '#9CA3AF',
  '#374151', '#111827', '#000000',
  '#EF4444', '#F97316', '#F59E0B', '#EAB308',
  '#22C55E', '#14B8A6', '#3B82F6', '#8B5CF6',
  '#EC4899', '#F43F5E',
];

export default function ColorPicker({ label, value, onChange, presets = DEFAULT_PRESETS }: ColorPickerProps) {
  return (
    <div className="space-y-2">
      <Label className="text-xs font-semibold uppercase tracking-widest text-sidebar-foreground/50">
        {label}
      </Label>
      <div className="flex items-center gap-2">
        <div className="relative">
          <input
            type="color"
            value={value}
            onChange={e => onChange(e.target.value)}
            className="w-8 h-8 rounded cursor-pointer border border-sidebar-border bg-transparent p-0.5"
            title="Pick a color"
          />
        </div>
        <span className="text-xs font-mono text-sidebar-foreground/60 uppercase">{value}</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {presets.map(color => (
          <button
            key={color}
            onClick={() => onChange(color)}
            className={`w-5 h-5 rounded-sm border transition-transform hover:scale-110 ${
              value.toLowerCase() === color.toLowerCase()
                ? 'border-accent scale-110 ring-1 ring-accent ring-offset-1 ring-offset-sidebar'
                : 'border-sidebar-border/50'
            }`}
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>
    </div>
  );
}
