
import { Controller, Get, Post, Req, Body, UseGuards } from '@nestjs/common';
import { ApiKey } from './entities/apikey.entity';
import { AuthService } from './auth.service';
import { ApiKeyCacheItemDto } from './dto/apikey.cahe.item.dto';
import { ApiKeyCacheResponseDto } from './dto/apikey.cahe.response.dto';
import { Public, Private, Admin } from '../auth/decorators/permission.decorator'

@Controller('auth')
export class AuthController {
  constructor (private authService: AuthService) {}

  @Get("all_keys")
  @Admin()
  async get_all_api_keys() : Promise<ApiKeyCacheResponseDto> {
     const api_map: Map<string, ApiKey> = this.authService.cached_keys();
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


}