import { PermissionLevel } from '../types/permission.enums';
export declare class ApiKeyChangeStatusDto {
    readonly key: string;
    readonly name: string;
    permissionLevel: PermissionLevel;
    isActive: boolean;
    createdAt: Date;
}
