import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface CustomizelyProject {
    created: Timestamp;
    owner: Principal;
    name: string;
    designElements: Array<DesignElement>;
    baseColor: Color;
    productType: ProductType;
    projectId: string;
}
export type Timestamp = bigint;
export interface Position {
    x: number;
    y: number;
}
export interface Size {
    height: number;
    width: number;
}
export type Color = string;
export interface DesignElement {
    content: string;
    color: Color;
    size: Size;
    position: Position;
    elementType: DesignElementType;
}
export interface UserProfile {
    name: string;
}
export enum DesignElementType {
    text = "text",
    shape = "shape",
    image = "image"
}
export enum ProductType {
    hat = "hat",
    mug = "mug",
    custom = "custom",
    tShirt = "tShirt"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteProject(projectId: string): Promise<void>;
    getAllProjects(): Promise<Array<CustomizelyProject>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMyProjects(): Promise<Array<CustomizelyProject>>;
    getProject(projectId: string): Promise<CustomizelyProject | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveProject(projectId: string, productType: string, baseColor: Color, designElements: Array<DesignElement>, name: string): Promise<void>;
}
