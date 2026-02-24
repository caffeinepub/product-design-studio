import { useState, useCallback } from 'react';
import type {
  DesignState,
  DesignElement,
  ProductType,
  ToolMode,
  ShapeKind,
  Position,
} from '../types/design';

function generateId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

const DEFAULT_STATE: DesignState = {
  productType: 'tShirt',
  baseColor: '#FFFFFF',
  elements: [],
  selectedElementId: null,
  toolMode: 'select',
  activeShapeKind: 'rectangle',
  projectName: 'My Design',
  projectId: null,
};

export function useDesignState() {
  const [state, setState] = useState<DesignState>(DEFAULT_STATE);

  const setProductType = useCallback((productType: ProductType) => {
    setState(s => ({ ...s, productType }));
  }, []);

  const setBaseColor = useCallback((baseColor: string) => {
    setState(s => ({ ...s, baseColor }));
  }, []);

  const setToolMode = useCallback((toolMode: ToolMode) => {
    setState(s => ({ ...s, toolMode }));
  }, []);

  const setActiveShapeKind = useCallback((activeShapeKind: ShapeKind) => {
    setState(s => ({ ...s, activeShapeKind }));
  }, []);

  const setProjectName = useCallback((projectName: string) => {
    setState(s => ({ ...s, projectName }));
  }, []);

  const setProjectId = useCallback((projectId: string | null) => {
    setState(s => ({ ...s, projectId }));
  }, []);

  const addTextElement = useCallback((position: Position) => {
    const el: DesignElement = {
      id: generateId(),
      kind: 'text',
      position,
      size: { width: 160, height: 40 },
      content: 'Your Text',
      fontSize: 20,
      color: '#222222',
    };
    setState(s => ({
      ...s,
      elements: [...s.elements, el],
      selectedElementId: el.id,
      toolMode: 'select',
    }));
    return el.id;
  }, []);

  const addShapeElement = useCallback((position: Position, shapeKind: ShapeKind) => {
    const el: DesignElement = {
      id: generateId(),
      kind: 'shape',
      position,
      size: { width: 80, height: 80 },
      shapeKind,
      color: '#F59E0B',
    };
    setState(s => ({
      ...s,
      elements: [...s.elements, el],
      selectedElementId: el.id,
      toolMode: 'select',
    }));
    return el.id;
  }, []);

  const updateElement = useCallback((id: string, updates: Partial<DesignElement>) => {
    setState(s => ({
      ...s,
      elements: s.elements.map(el => el.id === id ? { ...el, ...updates } : el),
    }));
  }, []);

  const deleteElement = useCallback((id: string) => {
    setState(s => ({
      ...s,
      elements: s.elements.filter(el => el.id !== id),
      selectedElementId: s.selectedElementId === id ? null : s.selectedElementId,
    }));
  }, []);

  const selectElement = useCallback((id: string | null) => {
    setState(s => ({ ...s, selectedElementId: id }));
  }, []);

  const loadProject = useCallback((project: {
    projectId: string;
    name: string;
    productType: ProductType;
    baseColor: string;
    elements: DesignElement[];
  }) => {
    setState({
      ...DEFAULT_STATE,
      projectId: project.projectId,
      projectName: project.name,
      productType: project.productType,
      baseColor: project.baseColor,
      elements: project.elements,
    });
  }, []);

  const resetDesign = useCallback(() => {
    setState({ ...DEFAULT_STATE, projectId: generateId() });
  }, []);

  const selectedElement = state.elements.find(el => el.id === state.selectedElementId) ?? null;

  return {
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
    resetDesign,
  };
}
