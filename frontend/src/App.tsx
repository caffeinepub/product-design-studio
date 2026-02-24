import React from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import { useDesignState } from './hooks/useDesignState';
import AppSidebar from './components/AppSidebar';
import DesignCanvas from './components/DesignCanvas';
import ProfileSetupModal from './components/ProfileSetupModal';
import type { DesignElement, ProductType } from './types/design';
import { Palette } from 'lucide-react';

function DesignStudio() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: userProfile, isLoading: profileLoading, isFetched: profileFetched } = useGetCallerUserProfile();

  const {
    state,
    selectedElement,
    setProductType,
    setBaseColor,
    setToolMode,
    setActiveShapeKind,
    setProjectName,
    setProjectId,
    addTextElement,
    addShapeElement,
    updateElement,
    deleteElement,
    selectElement,
    loadProject,
  } = useDesignState();

  const showProfileSetup = isAuthenticated && !profileLoading && profileFetched && userProfile === null;

  const handleDeleteSelected = () => {
    if (state.selectedElementId) {
      deleteElement(state.selectedElementId);
    }
  };

  const handleLoadProject = (project: {
    projectId: string;
    name: string;
    productType: ProductType;
    baseColor: string;
    elements: DesignElement[];
  }) => {
    loadProject(project);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <AppSidebar
        state={state}
        selectedElement={selectedElement}
        onProductChange={setProductType}
        onBaseColorChange={setBaseColor}
        onToolChange={setToolMode}
        onShapeKindChange={setActiveShapeKind}
        onUpdateElement={updateElement}
        onDeleteSelected={handleDeleteSelected}
        onProjectIdSet={setProjectId}
        onProjectNameSet={setProjectName}
        onLoadProject={handleLoadProject}
      />

      {/* Main Canvas Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-12 flex items-center justify-between px-5 border-b border-border bg-card/80 backdrop-blur-sm flex-shrink-0">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-foreground/70">
              {state.projectName}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="capitalize">
              {state.toolMode === 'select' ? 'Select mode' :
               state.toolMode === 'addText' ? 'Click to add text' :
               state.toolMode === 'addShape' ? `Click to add ${state.activeShapeKind}` :
               state.toolMode}
            </span>
            <span className="text-border">|</span>
            <span>{state.elements.length} element{state.elements.length !== 1 ? 's' : ''}</span>
          </div>
        </header>

        {/* Canvas */}
        <div className="flex-1 overflow-hidden">
          <DesignCanvas
            state={state}
            onAddText={addTextElement}
            onAddShape={(pos) => addShapeElement(pos, state.activeShapeKind)}
            onSelectElement={selectElement}
            onUpdateElement={updateElement}
            onDeleteElement={deleteElement}
          />
        </div>
      </main>

      {/* Profile Setup Modal */}
      <ProfileSetupModal open={showProfileSetup} />

      <Toaster richColors position="bottom-right" />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <TooltipProvider>
        <DesignStudio />
        {/* Footer attribution */}
        <footer className="fixed bottom-0 left-0 right-0 pointer-events-none z-50">
          <div className="flex justify-center pb-1">
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== 'undefined' ? window.location.hostname : 'designcraft-studio')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="pointer-events-auto text-xs text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors"
            >
              Built with <span className="text-accent">♥</span> using caffeine.ai
            </a>
          </div>
        </footer>
      </TooltipProvider>
    </ThemeProvider>
  );
}
