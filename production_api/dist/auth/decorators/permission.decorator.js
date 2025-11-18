"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Admin = exports.Private = exports.Public = exports.RequiredPermission = exports.REQUIRED_PERMISSION_KEY = void 0;
const common_1 = require("@nestjs/common");
const permission_enums_1 = require("../types/permission.enums");
exports.REQUIRED_PERMISSION_KEY = 'requiredPermission';
const RequiredPermission = (level) => (0, common_1.SetMetadata)(exports.REQUIRED_PERMISSION_KEY, level);
exports.RequiredPermission = RequiredPermission;
const Public = () => (0, exports.RequiredPermission)(permission_enums_1.PermissionLevel.PUBLIC);
exports.Public = Public;
const Private = () => (0, exports.RequiredPermission)(permission_enums_1.PermissionLevel.PRIVATE);
exports.Private = Private;
const Admin = () => (0, exports.RequiredPermission)(permission_enums_1.PermissionLevel.ADMIN);
exports.Admin = Admin;
//# sourceMappingURL=permission.decorator.js.map