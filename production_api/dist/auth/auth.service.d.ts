import { OnApplicationBootstrap } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ApiKeyEntity } from './entities/apikey.entity';
import { ApiKey } from './interfaces/api.interface';
import { DataSource } from 'typeorm';
export declare class AuthService implements OnApplicationBootstrap {
    private apiKeyRepository;
    private liveDataSource;
    private readonly logger;
    private apiKeyCache;
    private cacheLoaded;
    constructor(apiKeyRepository: Repository<ApiKeyEntity>, liveDataSource: DataSource);
    onApplicationBootstrap(): Promise<void>;
    private loadApiKeysIntoCache;
    isValidApiKeyFormat(key: ApiKeyEntity): Promise<Boolean>;
    validateApiKey(key: string): Promise<ApiKey | null>;
    createApiKey(keyData: Partial<ApiKeyEntity>): Promise<ApiKeyEntity>;
    deactivateApiKey(key: string): Promise<void>;
    cached_keys(): Map<string, ApiKeyEntity>;
    storeNewAPIKeys(apiKey: ApiKey): Promise<void>;
    loadLiveApiKeysIntoCache(): Promise<void>;
    deleteApiKey(apiKey: ApiKey): Promise<void>;
    changeApiKeyStatus(apiKey: ApiKey): Promise<void>;
    private delay;
}
