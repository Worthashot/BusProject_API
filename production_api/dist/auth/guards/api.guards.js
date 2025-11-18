"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiKeyGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const auth_service_1 = require("../auth.service");
const permission_enums_1 = require("../types/permission.enums");
const permission_decorator_1 = require("../decorators/permission.decorator");
let ApiKeyGuard = class ApiKeyGuard {
    authService;
    reflector;
    constructor(authService, reflector) {
        this.authService = authService;
        this.reflector = reflector;
    }
    async canActivate(context) {
        const requiredPermission = this.reflector.get(permission_decorator_1.REQUIRED_PERMISSION_KEY, context.getHandler()) ?? permission_enums_1.PermissionLevel.ADMIN;
        const request = context.switchToHttp().getRequest();
        const apiKey = request.headers['x-api-key'];
        if (!apiKey) {
            throw new common_1.ForbiddenException('API key required');
        }
        const keyData = await this.authService.validateApiKey(apiKey);
        if (!keyData) {
            throw new common_1.ForbiddenException('Invalid API key');
        }
        if (!this.hasPermission(keyData.permissionLevel, requiredPermission)) {
            throw new common_1.ForbiddenException('Insufficient permissions');
        }
        request.apiKey = keyData;
        return true;
    }
    hasPermission(userLevel, requiredLevel) {
        const hierarchy = {
            [permission_enums_1.PermissionLevel.PUBLIC]: 1,
            [permission_enums_1.PermissionLevel.PRIVATE]: 2,
            [permission_enums_1.PermissionLevel.ADMIN]: 3
        };
        return hierarchy[userLevel] >= hierarchy[requiredLevel];
    }
};
exports.ApiKeyGuard = ApiKeyGuard;
exports.ApiKeyGuard = ApiKeyGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        core_1.Reflector])
], ApiKeyGuard);
//# sourceMappingURL=api.guards.js.map