export type ProductType = 'tShirt' | 'shirt' | 'mug' | 'jug';

export type DesignElementKind = 'text' | 'shape';

export type ShapeKind = 'rectangle' | 'circle' | 'triangle';

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface DesignElement {
  id: string;
  kind: DesignElementKind;
  position: Position;
  size: Size;
  // For text
  content?: string;
  fontSize?: number;
  // For shape
  shapeKind?: ShapeKind;
  // Common
  color: string;
  rotation?: number;
}

export type ToolMode = 'select' | 'addText' | 'addShape' | 'colorPicker';

export interface DesignState {
  productType: ProductType;
  baseColor: string;
  elements: DesignElement[];
  selectedElementId: string | null;
  toolMode: ToolMode;
  activeShapeKind: ShapeKind;
  projectName: string;
  projectId: string | null;
}

export const PRODUCT_LABELS: Record<ProductType, string> = {
  tShirt: 'T-Shirt',
  shirt: 'Shirt',
  mug: 'Cup',
  jug: 'Jug',
};

export const PRODUCT_IMAGES: Record<ProductType, string> = {
  tShirt: '/assets/generated/product-tshirt.dim_600x600.png',
  shirt: '/assets/generated/product-shirt.dim_600x600.png',
  mug: '/assets/generated/product-cup.dim_600x600.png',
  jug: '/assets/generated/product-jug.dim_600x600.png',
};
