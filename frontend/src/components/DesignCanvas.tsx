import React, { useRef, useCallback, useEffect, useState } from 'react';
import type { DesignElement, DesignState, Position } from '../types/design';
import { PRODUCT_IMAGES } from '../types/design';

interface DesignCanvasProps {
  state: DesignState;
  onAddText: (pos: Position) => void;
  onAddShape: (pos: Position) => void;
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (id: string, updates: Partial<DesignElement>) => void;
  onDeleteElement: (id: string) => void;
}

interface DragState {
  elementId: string;
  startMouseX: number;
  startMouseY: number;
  startElemX: number;
  startElemY: number;
}

interface ResizeState {
  elementId: string;
  handle: 'se' | 'sw' | 'ne' | 'nw';
  startMouseX: number;
  startMouseY: number;
  startWidth: number;
  startHeight: number;
  startX: number;
  startY: number;
}

export default function DesignCanvas({
  state,
  onAddText,
  onAddShape,
  onSelectElement,
  onUpdateElement,
  onDeleteElement,
}: DesignCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState | null>(null);
  const resizeRef = useRef<ResizeState | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const getRelativePos = useCallback((e: React.MouseEvent | MouseEvent): Position => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }, []);

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (isDragging) return;
    if (e.target !== containerRef.current && !(e.target as HTMLElement).classList.contains('canvas-bg')) {
      return;
    }
    const pos = getRelativePos(e);
    if (state.toolMode === 'addText') {
      onAddText({ x: pos.x - 80, y: pos.y - 20 });
    } else if (state.toolMode === 'addShape') {
      onAddShape({ x: pos.x - 40, y: pos.y - 40 });
    } else {
      onSelectElement(null);
    }
  }, [state.toolMode, isDragging, getRelativePos, onAddText, onAddShape, onSelectElement]);

  const handleElementMouseDown = useCallback((e: React.MouseEvent, elementId: string) => {
    e.stopPropagation();
    if (state.toolMode !== 'select') return;
    onSelectElement(elementId);
    const el = state.elements.find(el => el.id === elementId);
    if (!el) return;
    dragRef.current = {
      elementId,
      startMouseX: e.clientX,
      startMouseY: e.clientY,
      startElemX: el.position.x,
      startElemY: el.position.y,
    };
    setIsDragging(false);
  }, [state.toolMode, state.elements, onSelectElement]);

  const handleResizeMouseDown = useCallback((
    e: React.MouseEvent,
    elementId: string,
    handle: 'se' | 'sw' | 'ne' | 'nw'
  ) => {
    e.stopPropagation();
    e.preventDefault();
    const el = state.elements.find(el => el.id === elementId);
    if (!el) return;
    resizeRef.current = {
      elementId,
      handle,
      startMouseX: e.clientX,
      startMouseY: e.clientY,
      startWidth: el.size.width,
      startHeight: el.size.height,
      startX: el.position.x,
      startY: el.position.y,
    };
  }, [state.elements]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (dragRef.current) {
        const dx = e.clientX - dragRef.current.startMouseX;
        const dy = e.clientY - dragRef.current.startMouseY;
        if (Math.abs(dx) > 2 || Math.abs(dy) > 2) setIsDragging(true);
        onUpdateElement(dragRef.current.elementId, {
          position: {
            x: dragRef.current.startElemX + dx,
            y: dragRef.current.startElemY + dy,
          },
        });
      }
      if (resizeRef.current) {
        const r = resizeRef.current;
        const dx = e.clientX - r.startMouseX;
        const dy = e.clientY - r.startMouseY;
        let newW = r.startWidth;
        let newH = r.startHeight;
        let newX = r.startX;
        let newY = r.startY;

        if (r.handle === 'se') {
          newW = Math.max(20, r.startWidth + dx);
          newH = Math.max(20, r.startHeight + dy);
        } else if (r.handle === 'sw') {
          newW = Math.max(20, r.startWidth - dx);
          newH = Math.max(20, r.startHeight + dy);
          newX = r.startX + (r.startWidth - newW);
        } else if (r.handle === 'ne') {
          newW = Math.max(20, r.startWidth + dx);
          newH = Math.max(20, r.startHeight - dy);
          newY = r.startY + (r.startHeight - newH);
        } else if (r.handle === 'nw') {
          newW = Math.max(20, r.startWidth - dx);
          newH = Math.max(20, r.startHeight - dy);
          newX = r.startX + (r.startWidth - newW);
          newY = r.startY + (r.startHeight - newH);
        }

        onUpdateElement(r.elementId, {
          size: { width: newW, height: newH },
          position: { x: newX, y: newY },
        });
      }
    };

    const handleMouseUp = () => {
      dragRef.current = null;
      resizeRef.current = null;
      setTimeout(() => setIsDragging(false), 50);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [onUpdateElement]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && state.selectedElementId) {
        const target = e.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;
        onDeleteElement(state.selectedElementId);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.selectedElementId, onDeleteElement]);

  const getCursor = () => {
    if (state.toolMode === 'addText') return 'text';
    if (state.toolMode === 'addShape') return 'crosshair';
    return 'default';
  };

  const renderShape = (el: DesignElement) => {
    const { shapeKind = 'rectangle', color, size } = el;
    if (shapeKind === 'circle') {
      return (
        <div
          className="w-full h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      );
    }
    if (shapeKind === 'triangle') {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <svg width={size.width} height={size.height} viewBox={`0 0 ${size.width} ${size.height}`}>
            <polygon
              points={`${size.width / 2},0 ${size.width},${size.height} 0,${size.height}`}
              fill={color}
            />
          </svg>
        </div>
      );
    }
    return (
      <div
        className="w-full h-full rounded-sm"
        style={{ backgroundColor: color }}
      />
    );
  };

  const renderElement = (el: DesignElement) => {
    const isSelected = state.selectedElementId === el.id;
    const isSelectMode = state.toolMode === 'select';

    return (
      <div
        key={el.id}
        style={{
          position: 'absolute',
          left: el.position.x,
          top: el.position.y,
          width: el.size.width,
          height: el.size.height,
          cursor: isSelectMode ? (isSelected ? 'move' : 'pointer') : 'default',
          userSelect: 'none',
          zIndex: isSelected ? 10 : 1,
        }}
        onMouseDown={e => handleElementMouseDown(e, el.id)}
        onClick={e => { e.stopPropagation(); if (!isDragging) onSelectElement(el.id); }}
      >
        {/* Selection border */}
        {isSelected && (
          <div
            className="absolute inset-0 border-2 border-accent rounded-sm pointer-events-none"
            style={{ zIndex: 2 }}
          />
        )}

        {/* Element content */}
        {el.kind === 'text' ? (
          <div
            className="w-full h-full flex items-center overflow-hidden"
            style={{
              color: el.color,
              fontSize: el.fontSize ?? 20,
              fontFamily: 'DM Sans, sans-serif',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
            }}
          >
            {el.content || 'Your Text'}
          </div>
        ) : (
          <div className="w-full h-full pointer-events-none">
            {renderShape(el)}
          </div>
        )}

        {/* Resize handles */}
        {isSelected && isSelectMode && (
          <>
            {(['nw', 'ne', 'sw', 'se'] as const).map(handle => (
              <div
                key={handle}
                onMouseDown={e => handleResizeMouseDown(e, el.id, handle)}
                className="absolute w-3 h-3 bg-white border-2 border-accent rounded-sm cursor-nwse-resize"
                style={{
                  zIndex: 3,
                  top: handle.includes('n') ? -6 : undefined,
                  bottom: handle.includes('s') ? -6 : undefined,
                  left: handle.includes('w') ? -6 : undefined,
                  right: handle.includes('e') ? -6 : undefined,
                  cursor: handle === 'nw' || handle === 'se' ? 'nwse-resize' : 'nesw-resize',
                }}
              />
            ))}
          </>
        )}
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className="canvas-bg relative w-full h-full canvas-grid overflow-hidden"
      style={{ cursor: getCursor() }}
      onClick={handleCanvasClick}
    >
      {/* Product image with color overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative w-[420px] h-[420px]">
          {/* Color tint layer */}
          <div
            className="absolute inset-0 rounded-lg"
            style={{
              backgroundColor: state.baseColor,
              mixBlendMode: 'multiply',
              opacity: state.baseColor === '#FFFFFF' ? 0 : 0.6,
            }}
          />
          <img
            src={PRODUCT_IMAGES[state.productType]}
            alt="Product"
            className="w-full h-full object-contain"
            draggable={false}
          />
        </div>
      </div>

      {/* Design elements */}
      {state.elements.map(renderElement)}

      {/* Tool hint */}
      {(state.toolMode === 'addText' || state.toolMode === 'addShape') && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-foreground/80 text-background text-xs px-3 py-1.5 rounded-full pointer-events-none">
          Click anywhere to place {state.toolMode === 'addText' ? 'text' : 'shape'}
        </div>
      )}
    </div>
  );
}
