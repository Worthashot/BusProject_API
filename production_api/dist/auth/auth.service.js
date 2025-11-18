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
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const apikey_entity_1 = require("./entities/apikey.entity");
let AuthService = AuthService_1 = class AuthService {
    apiKeyRepository;
    logger = new common_1.Logger(AuthService_1.name);
    apiKeyCache = new Map();
    cacheLoaded = false;
    constructor(apiKeyRepository) {
        this.apiKeyRepository = apiKeyRepository;
    }
    async onApplicationBootstrap() {
        this.logger.log('Application bootstrapped, loading API keys...');
        await this.loadApiKeysIntoCache();
    }
    async loadApiKeysIntoCache() {
        const maxRetries = 3;
        let retryCount = 0;
        while (retryCount < maxRetries) {
            try {
                this.logger.log(`Loading API keys from database (attempt ${retryCount + 1})...`);
                const activeApiKeys = await this.apiKeyRepository.find({
                    where: { isActive: true },
                    select: ['id', 'key', 'name', 'permissionLevel', 'createdAt', 'isActive']
                });
                this.apiKeyCache.clear();
                let validKeyCount = 0;
                activeApiKeys.forEach(apiKey => {
                    this.apiKeyCache.set(apiKey.key, apiKey);
                    validKeyCount++;
                });
                this.cacheLoaded = true;
                this.logger.log(`✅ Successfully loaded ${validKeyCount} API keys into memory cache`);
                this.logger.debug(`Cache size: ${this.apiKeyCache.size} keys`);
                return;
            }
            catch (error) {
                retryCount++;
                this.logger.error(`Failed to load API keys (attempt ${retryCount}/${maxRetries}):`, error.message);
                if (retryCount >= maxRetries) {
                    this.logger.error('CRITICAL: All retries failed. Application cannot start without API keys.');
                    throw new Error(`Failed to load API keys after ${maxRetries} attempts: ${error.message}`);
                }
                const waitTime = 1000 * retryCount;
                this.logger.log(`Retrying in ${waitTime}ms...`);
                await this.delay(waitTime);
            }
        }
    }
    async isValidApiKeyFormat(key) {
        return true;
    }
    async validateApiKey(key) {
        if (!this.cacheLoaded) {
            this.logger.warn('API key cache not loaded yet, attempting to load...');
            await this.loadApiKeysIntoCache();
        }
        const apiKey = this.apiKeyCache.get(key);
        if (!apiKey) {
            return null;
        }
        if (!apiKey.isActive) {
            this.apiKeyCache.delete(key);
            return null;
        }
        return apiKey;
    }
    async createApiKey(keyData) {
        const apiKey = this.apiKeyRepository.create(keyData);
        return this.apiKeyRepository.save(apiKey);
    }
    async deactivateApiKey(key) {
        await this.apiKeyRepository.update({ key }, { isActive: false });
    }
    cached_keys() {
        return this.apiKeyCache;
    }
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(apikey_entity_1.ApiKey, "old_api")),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AuthService);
//# sourceMappingURL=auth.service.js.map