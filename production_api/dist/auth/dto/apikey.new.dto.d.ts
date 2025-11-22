import { PermissionLevel } from '../types/permission.enums';
export declare class ApiKeyNewDto {
    readonly key: string;
    readonly name: string;
    permissionLevel: PermissionLevel;
    isActive: boolean;
    createdAt: Date;
}
