import { PermissionLevel } from '../types/permission.enums';
export declare class ApiKeyEntity {
    id: number;
    key: string;
    name: string;
    permissionLevel: PermissionLevel;
    isActive: boolean;
    createdAt: Date;
}
