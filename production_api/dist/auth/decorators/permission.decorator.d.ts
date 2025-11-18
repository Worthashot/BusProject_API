import { PermissionLevel } from '../types/permission.enums';
export declare const REQUIRED_PERMISSION_KEY = "requiredPermission";
export declare const RequiredPermission: (level: PermissionLevel) => import("@nestjs/common").CustomDecorator<string>;
export declare const Public: () => import("@nestjs/common").CustomDecorator<string>;
export declare const Private: () => import("@nestjs/common").CustomDecorator<string>;
export declare const Admin: () => import("@nestjs/common").CustomDecorator<string>;
