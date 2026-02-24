import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import ProductSelector from './ProductSelector';
import DesignToolbar from './DesignToolbar';
import ColorPicker from './ColorPicker';
import ElementProperties from './ElementProperties';
import SaveDesignButton from './SaveDesignButton';
import ProjectList from './ProjectList';
import LoginButton from './LoginButton';
import type { DesignState, DesignElement, ProductType, ToolMode, ShapeKind } from '../types/design';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { User } from 'lucide-react';

interface AppSidebarProps {
  state: DesignState;
  selectedElement: DesignElement | null;
  onProductChange: (type: ProductType) => void;
  onBaseColorChange: (color: string) => void;
  onToolChange: (mode: ToolMode) => void;
  onShapeKindChange: (kind: ShapeKind) => void;
  onUpdateElement: (id: string, updates: Partial<DesignElement>) => void;
  onDeleteSelected: () => void;
  onProjectIdSet: (id: string) => void;
  onProjectNameSet: (name: string) => void;
  onLoadProject: (project: {
    projectId: string;
    name: string;
    productType: ProductType;
    baseColor: string;
    elements: DesignElement[];
  }) => void;
}

export default function AppSidebar({
  state,
  selectedElement,
  onProductChange,
  onBaseColorChange,
  onToolChange,
  onShapeKindChange,
  onUpdateElement,
  onDeleteSelected,
  onProjectIdSet,
  onProjectNameSet,
  onLoadProject,
}: AppSidebarProps) {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: userProfile } = useGetCallerUserProfile();

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col h-full sidebar-dark border-r border-sidebar-border">
      {/* Header */}
      <div className="px-4 py-4 border-b border-sidebar-border">
        <img
          src="/assets/generated/logo-wordmark.dim_400x80.png"
          alt="DesignCraft Studio"
          className="h-8 w-auto object-contain"
          onError={e => {
            (e.target as HTMLImageElement).style.display = 'none';
            const parent = (e.target as HTMLImageElement).parentElement;
            if (parent) {
              const fallback = document.createElement('span');
              fallback.className = 'font-serif text-lg font-bold text-sidebar-foreground';
              fallback.textContent = 'DesignCraft';
              parent.appendChild(fallback);
            }
          }}
        />
      </div>

      <ScrollArea className="flex-1">
        <div className="px-3 py-4 space-y-5">
          {/* Product Selector */}
          <ProductSelector
            selected={state.productType}
            onSelect={onProductChange}
          />

          <Separator className="bg-sidebar-border" />

          {/* Tools */}
          <DesignToolbar
            toolMode={state.toolMode}
            activeShapeKind={state.activeShapeKind}
            selectedElementId={state.selectedElementId}
            onToolChange={onToolChange}
            onShapeKindChange={onShapeKindChange}
            onDeleteSelected={onDeleteSelected}
          />

          <Separator className="bg-sidebar-border" />

          {/* Product Color */}
          <ColorPicker
            label="Product Color"
            value={state.baseColor}
            onChange={onBaseColorChange}
          />

          {/* Element Properties */}
          {selectedElement && (
            <>
              <Separator className="bg-sidebar-border" />
              <ElementProperties
                element={selectedElement}
                onUpdate={onUpdateElement}
              />
            </>
          )}

          {/* Projects (auth only) */}
          {isAuthenticated && (
            <>
              <Separator className="bg-sidebar-border" />
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-sidebar-foreground/50 px-1">
                  My Designs
                </p>
                <SaveDesignButton
                  state={state}
                  onProjectIdSet={onProjectIdSet}
                  onProjectNameSet={onProjectNameSet}
                />
                <ProjectList onLoad={onLoadProject} />
              </div>
            </>
          )}
        </div>
      </ScrollArea>

      {/* Footer: User + Login */}
      <div className="px-3 py-3 border-t border-sidebar-border space-y-2">
        {isAuthenticated && userProfile && (
          <div className="flex items-center gap-2 px-1">
            <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-accent" />
            </div>
            <span className="text-xs text-sidebar-foreground/70 truncate">{userProfile.name}</span>
          </div>
        )}
        <LoginButton />
        {!isAuthenticated && (
          <p className="text-xs text-sidebar-foreground/40 text-center px-1">
            Login to save your designs
          </p>
        )}
      </div>
    </aside>
  );
}
