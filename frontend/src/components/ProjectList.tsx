import React from 'react';
import { useGetMyProjects, useDeleteProject } from '../hooks/useQueries';
import type { CustomizelyProject } from '../backend';
import type { DesignElement, ProductType } from '../types/design';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { FolderOpen, Trash2, Loader2, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { PRODUCT_LABELS } from '../types/design';

interface ProjectListProps {
  onLoad: (project: {
    projectId: string;
    name: string;
    productType: ProductType;
    baseColor: string;
    elements: DesignElement[];
  }) => void;
}

function mapProductType(pt: { hat?: null; mug?: null; custom?: null; tShirt?: null } | string): ProductType {
  if (typeof pt === 'string') {
    if (pt === 'tShirt') return 'tShirt';
    if (pt === 'mug') return 'mug';
    if (pt === 'hat') return 'shirt';
    return 'jug';
  }
  const obj = pt as Record<string, unknown>;
  if ('tShirt' in obj) return 'tShirt';
  if ('mug' in obj) return 'mug';
  if ('hat' in obj) return 'shirt';
  return 'jug';
}

function mapElements(backendElements: CustomizelyProject['designElements']): DesignElement[] {
  return backendElements.map((el, i) => {
    const elType = el.elementType as unknown as Record<string, unknown>;
    const kind = 'text' in elType ? 'text' : 'shape';
    return {
      id: `loaded-${i}-${Date.now()}`,
      kind,
      position: { x: el.position.x, y: el.position.y },
      size: { width: el.size.width, height: el.size.height },
      content: el.content,
      fontSize: 20,
      color: el.color,
      shapeKind: 'rectangle',
    };
  });
}

export default function ProjectList({ onLoad }: ProjectListProps) {
  const { data: projects, isLoading } = useGetMyProjects();
  const deleteProject = useDeleteProject();

  const handleDelete = async (projectId: string, name: string) => {
    try {
      await deleteProject.mutateAsync(projectId);
      toast.success(`"${name}" deleted`);
    } catch {
      toast.error('Failed to delete project');
    }
  };

  const handleLoad = (project: CustomizelyProject) => {
    onLoad({
      projectId: project.projectId,
      name: project.name,
      productType: mapProductType(project.productType as unknown as string),
      baseColor: project.baseColor,
      elements: mapElements(project.designElements),
    });
    toast.success(`Loaded "${project.name}"`);
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map(i => (
          <Skeleton key={i} className="h-12 w-full bg-sidebar-accent" />
        ))}
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-6 text-sidebar-foreground/40">
        <FileText className="w-8 h-8" />
        <p className="text-xs text-center">No saved designs yet.<br />Save your first design!</p>
      </div>
    );
  }

  return (
    <ScrollArea className="max-h-64">
      <div className="space-y-1.5 pr-2">
        {projects.map(project => {
          const pt = mapProductType(project.productType as unknown as string);
          return (
            <div
              key={project.projectId}
              className="flex items-center gap-2 p-2 rounded-md bg-sidebar-accent/40 hover:bg-sidebar-accent/70 transition-colors group"
            >
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-sidebar-foreground truncate">{project.name}</p>
                <p className="text-xs text-sidebar-foreground/40">{PRODUCT_LABELS[pt] ?? pt}</p>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="icon"
                  variant="ghost"
                  className="w-6 h-6 text-sidebar-foreground/60 hover:text-accent hover:bg-transparent"
                  onClick={() => handleLoad(project)}
                  title="Load design"
                >
                  <FolderOpen className="w-3.5 h-3.5" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="w-6 h-6 text-sidebar-foreground/60 hover:text-destructive hover:bg-transparent"
                  onClick={() => handleDelete(project.projectId, project.name)}
                  disabled={deleteProject.isPending}
                  title="Delete design"
                >
                  {deleteProject.isPending ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}
