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
const typeorm_3 = require("@nestjs/typeorm");
const typeorm_4 = require("typeorm");
let AuthService = AuthService_1 = class AuthService {
    apiKeyRepository;
    liveDataSource;
    logger = new common_1.Logger(AuthService_1.name);
    apiKeyCache = new Map();
    cacheLoaded = false;
    constructor(apiKeyRepository, liveDataSource) {
        this.apiKeyRepository = apiKeyRepository;
        this.liveDataSource = liveDataSource;
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
    async storeNewAPIKeys(apiKey) {
        this.logger.log('Storing New ApiKeys...');
        const queryRunner = this.liveDataSource.createQueryRunner();
        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();
            await queryRunner.query(`INSERT INTO api_keys (key, name, permissionLevel, isActive) 
          VALUES (?, ?, ?, ?)`, [
                apiKey.key,
                apiKey.name,
                apiKey.permissionLevel,
                apiKey.isActive,
            ]);
            this.logger.log('✅ API keys stored successfully');
        }
        catch (error) {
            this.logger.error('Failed to store API keys:', error);
            queryRunner.rollbackTransaction();
        }
        finally {
            await queryRunner.release();
        }
    }
    async loadLiveApiKeysIntoCache() {
        const maxRetries = 3;
        let retryCount = 0;
        const queryRunner = this.liveDataSource.createQueryRunner();
        while (retryCount < maxRetries) {
            try {
                this.logger.log(`Loading API keys from database (attempt ${retryCount + 1})...`);
                await queryRunner.connect();
                await queryRunner.startTransaction();
                const activeApiKeys = await queryRunner.query(`
          SELECT * FROM api_keys WHERE isActive = 1;
          )
        `);
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
    async deleteApiKey(apiKey) {
        this.logger.log('Deleting ApiKey...');
        const queryRunner = this.liveDataSource.createQueryRunner();
        await queryRunner.connect();
        try {
            await queryRunner.startTransaction();
            await queryRunner.query('DELETE FROM api_keys WHERE key = ?', [
                apiKey.key
            ]);
            await queryRunner.commitTransaction();
            this.logger.log('✅ API keys deleted successfully');
        }
        catch (error) {
            this.logger.error('Failed to delete API keys:', error);
            await queryRunner.rollbackTransaction();
        }
        finally {
            await queryRunner.release();
        }
    }
    async changeApiKeyStatus(apiKey) {
        this.logger.log('changing ApiKeys Status...');
        const queryRunner = this.liveDataSource.createQueryRunner();
        await queryRunner.connect();
        try {
            await queryRunner.startTransaction();
            await queryRunner.query(`UPDATE api_keys 
         SET isActive = ?
         WHERE key = ?`, [
                apiKey.isActive,
                apiKey.key
            ]);
            await queryRunner.commitTransaction();
            this.logger.log('✅ API key status changed successfully');
        }
        catch (error) {
            this.logger.error('Failed to change API key status:', error);
            await queryRunner.rollbackTransaction();
        }
        finally {
            await queryRunner.release();
        }
    }
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(apikey_entity_1.ApiKeyEntity, "old_api")),
    __param(1, (0, typeorm_3.InjectDataSource)('live')),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_4.DataSource])
], AuthService);
//# sourceMappingURL=auth.service.js.map