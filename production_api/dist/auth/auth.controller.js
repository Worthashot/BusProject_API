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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const permission_decorator_1 = require("../auth/decorators/permission.decorator");
const apikey_new_dto_1 = require("./dto/apikey.new.dto");
const apikey_delete_dto_1 = require("./dto/apikey.delete.dto");
const apikey_change_status_dto_1 = require("./dto/apikey.change.status.dto");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    logger = new common_1.Logger(auth_service_1.AuthService.name);
    async get_all_api_keys() {
        const api_map = this.authService.cached_keys();
        const cacheArray = Array.from(api_map).map(([cacheKey, apiKey]) => ({
            cacheKey,
            id: apiKey.id,
            key: apiKey.key,
            name: apiKey.name,
            permissionLevel: apiKey.permissionLevel,
            isActive: apiKey.isActive,
            createdAt: apiKey.createdAt,
        }));
        return {
            count: cacheArray.length,
            keys: cacheArray,
        };
    }
    async add_key(apiKeyNewDto) {
        this.authService.storeNewAPIKeys(apiKeyNewDto);
    }
    async remove_key(apiKeyDeleteDto) {
        this.logger.log('Removing Api Key '.concat(apiKeyDeleteDto.key));
        this.authService.deleteApiKey(apiKeyDeleteDto);
    }
    async change_status(apiChangeStatusDto) {
        this.authService.changeApiKeyStatus(apiChangeStatusDto);
    }
    async set_live() {
        this.authService.loadLiveApiKeysIntoCache();
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Get)("all_keys"),
    (0, permission_decorator_1.Admin)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "get_all_api_keys", null);
__decorate([
    (0, common_1.Post)("add_key"),
    (0, permission_decorator_1.Admin)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [apikey_new_dto_1.ApiKeyNewDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "add_key", null);
__decorate([
    (0, common_1.Delete)("remove_key"),
    (0, permission_decorator_1.Admin)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [apikey_delete_dto_1.ApiKeyDeleteDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "remove_key", null);
__decorate([
    (0, common_1.Post)("change_key_status"),
    (0, permission_decorator_1.Admin)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [apikey_change_status_dto_1.ApiKeyChangeStatusDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "change_status", null);
__decorate([
    (0, common_1.Post)("update_apikey_cache"),
    (0, permission_decorator_1.Admin)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "set_live", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map