import React from 'react';
import type { ProductType } from '../types/design';
import { PRODUCT_LABELS, PRODUCT_IMAGES } from '../types/design';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface ProductSelectorProps {
  selected: ProductType;
  onSelect: (type: ProductType) => void;
}

const PRODUCTS: ProductType[] = ['tShirt', 'shirt', 'mug', 'jug'];

export default function ProductSelector({ selected, onSelect }: ProductSelectorProps) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-semibold uppercase tracking-widest text-sidebar-foreground/50 px-1 mb-2">
        Product
      </p>
      <div className="grid grid-cols-2 gap-2">
        {PRODUCTS.map(type => (
          <Tooltip key={type}>
            <TooltipTrigger asChild>
              <button
                onClick={() => onSelect(type)}
                className={`
                  relative flex flex-col items-center gap-1.5 p-2 rounded-lg border transition-all duration-150
                  ${selected === type
                    ? 'border-accent bg-accent/15 shadow-sm'
                    : 'border-sidebar-border bg-sidebar-accent/30 hover:bg-sidebar-accent/60 hover:border-sidebar-foreground/30'
                  }
                `}
              >
                <div className="w-14 h-14 flex items-center justify-center overflow-hidden">
                  <img
                    src={PRODUCT_IMAGES[type]}
                    alt={PRODUCT_LABELS[type]}
                    className="w-full h-full object-contain"
                    style={{ filter: selected === type ? 'none' : 'brightness(0) invert(0.7)' }}
                  />
                </div>
                <span className={`text-xs font-medium ${selected === type ? 'text-accent' : 'text-sidebar-foreground/70'}`}>
                  {PRODUCT_LABELS[type]}
                </span>
                {selected === type && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-accent" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Design a {PRODUCT_LABELS[type]}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </div>
  );
}
