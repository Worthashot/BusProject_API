import { OnApplicationBootstrap } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ApiKey } from './entities/apikey.entity';
export declare class AuthService implements OnApplicationBootstrap {
    private apiKeyRepository;
    private readonly logger;
    private apiKeyCache;
    private cacheLoaded;
    constructor(apiKeyRepository: Repository<ApiKey>);
    onApplicationBootstrap(): Promise<void>;
    private loadApiKeysIntoCache;
    isValidApiKeyFormat(key: ApiKey): Promise<Boolean>;
    validateApiKey(key: string): Promise<ApiKey | null>;
    createApiKey(keyData: Partial<ApiKey>): Promise<ApiKey>;
    deactivateApiKey(key: string): Promise<void>;
    cached_keys(): Map<string, ApiKey>;
    private delay;
}
