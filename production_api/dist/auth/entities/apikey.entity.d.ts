import { PermissionLevel } from '../types/permission.enums';
export declare class ApiKey {
    id: number;
    key: string;
    name: string;
    permissionLevel: PermissionLevel;
    isActive: boolean;
    createdAt: Date;
}
