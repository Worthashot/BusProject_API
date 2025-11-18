import { Injectable, OnModuleInit, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiKey } from './entities/apikey.entity';

@Injectable()
export class AuthService implements OnApplicationBootstrap{
  private readonly logger = new Logger(AuthService.name);

  private apiKeyCache: Map<string, ApiKey> = new Map();
  private cacheLoaded: boolean = false;

  constructor(
    @InjectRepository(ApiKey, "old_api")
    private apiKeyRepository: Repository<ApiKey>,
  ) {}

  async onApplicationBootstrap() {
    this.logger.log('Application bootstrapped, loading API keys...');
    await this.loadApiKeysIntoCache();
  }

  private async loadApiKeysIntoCache(): Promise<void> {
    const maxRetries = 3;
    let retryCount = 0;

    while (retryCount < maxRetries) {
      try {
        this.logger.log(`Loading API keys from database (attempt ${retryCount + 1})...`);

        // Fetch only active API keys
        const activeApiKeys = await this.apiKeyRepository.find({
          where: { isActive: true },
          select: ['id', 'key', 'name', 'permissionLevel', 'createdAt', 'isActive'] // Only select needed fields
        });

        // Clear existing cache
        this.apiKeyCache.clear();

        // Populate the cache
        let validKeyCount = 0;
        activeApiKeys.forEach(apiKey => {
          // Validate key format before caching
          // if (this.isValidApiKeyFormat(apiKey.key)) {
          this.apiKeyCache.set(apiKey.key, apiKey);
          validKeyCount++;
          // } else {
          //   this.logger.warn(`Skipping invalid API key format for key ID: ${apiKey.id}`);
          // }
        // });
        });

        this.cacheLoaded = true;
        
        this.logger.log(`✅ Successfully loaded ${validKeyCount} API keys into memory cache`);
        this.logger.debug(`Cache size: ${this.apiKeyCache.size} keys`);
        
        // Log some statistics
        // this.logCacheStatistics();
        return; // Success - exit retry loop

      } catch (error) {
        retryCount++;
        this.logger.error(`Failed to load API keys (attempt ${retryCount}/${maxRetries}):`, error.message);

        if (retryCount >= maxRetries) {
          this.logger.error('CRITICAL: All retries failed. Application cannot start without API keys.');
          throw new Error(`Failed to load API keys after ${maxRetries} attempts: ${error.message}`);
        }

        // Wait before retrying (exponential backoff)
        const waitTime = 1000 * retryCount;
        this.logger.log(`Retrying in ${waitTime}ms...`);
        await this.delay(waitTime);
      }
    }
  }  

  // TODO validation
  async isValidApiKeyFormat(key: ApiKey): Promise<Boolean> {
    return true
  }
  async validateApiKey(key: string): Promise<ApiKey | null> {
    // Safety check - ensure cache is loaded
    if (!this.cacheLoaded) {
      this.logger.warn('API key cache not loaded yet, attempting to load...');
      await this.loadApiKeysIntoCache();
    }

    // Fast in-memory lookup
    const apiKey = this.apiKeyCache.get(key);
    
    if (!apiKey) {
      return null; // Key not found
    }

    // Check if key is still active (in case cache hasn't been refreshed)
    if (!apiKey.isActive) {
      this.apiKeyCache.delete(key); // Clean up cache
      return null;
    }


    return apiKey;
  }

  // Optional: Methods to manage API keys
  async createApiKey(keyData: Partial<ApiKey>): Promise<ApiKey> {
    const apiKey = this.apiKeyRepository.create(keyData);
    return this.apiKeyRepository.save(apiKey);
  }

  async deactivateApiKey(key: string): Promise<void> {
    await this.apiKeyRepository.update(
      { key }, 
      { isActive: false }
    );
  }

  cached_keys(): Map<string, ApiKey>{
     return this.apiKeyCache;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // private logCacheStatistics(): void {
  //  const stats = this.getCacheStats();
  //  this.logger.log(`API Key Cache Statistics: ${stats.totalKeys} keys, ${stats.expiredKeysInCache} expired`);
  // }


}

