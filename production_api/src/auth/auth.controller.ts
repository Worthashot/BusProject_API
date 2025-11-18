
import { Controller, Get, Post, Req, Body, UseGuards, Delete } from '@nestjs/common';
import { ApiKeyEntity } from './entities/apikey.entity';
import { ApiKey } from './interfaces/api.interface';
import { AuthService } from './auth.service';
import { ApiKeyCacheItemDto } from './dto/apikey.cahe.item.dto';
import { ApiKeyCacheResponseDto } from './dto/apikey.cahe.response.dto';
import { Public, Private, Admin } from '../auth/decorators/permission.decorator'
import { ApiKeyNewDto } from './dto/apikey.new.dto';
import { ApiKeyDeleteDto } from './dto/apikey.delete.dto';
import { ApiKeyChangeStatusDto } from './dto/apikey.change.status.dto';

@Controller('auth')
export class AuthController {
  constructor (private authService: AuthService) {}

  @Get("all_keys")
  @Admin()
  async get_all_api_keys() : Promise<ApiKeyCacheResponseDto> {
     const api_map: Map<string, ApiKeyEntity> = this.authService.cached_keys();

      const cacheArray: ApiKeyCacheItemDto[] = Array.from(api_map).map(([cacheKey, apiKey]) => ({
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

  @Post("add_key")
  @Admin()
  async add_key(@Body() apiKeyNewDto: ApiKeyNewDto){
        this.authService.storeNewAPIKeys(apiKeyNewDto)
        this.authService.loadNewApiKeysIntoCache()
    }

  @Delete("remove_key")
  @Admin()
  async remove_key(@Body() apiKeyDeleteDto: ApiKeyDeleteDto){
      this.authService.deleteApiKey(apiKeyDeleteDto)
      this.authService.loadNewApiKeysIntoCache()
    } 

  @Post("change_key_status")
  @Admin()
  async change_status(@Body() apiChangeStatusDto : ApiKeyChangeStatusDto){
    this.authService.changeApiKeyStatus(apiChangeStatusDto)
    this.authService.loadNewApiKeysIntoCache()
  }


}