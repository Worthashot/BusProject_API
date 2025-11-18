import { ApiKeyGuard } from './guards/api.guards';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import{AuthService} from './auth.service'
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiKey } from '../auth/entities/apikey.entity';
import { AuthController } from './auth.controller';

@Module({
imports: [
    TypeOrmModule.forFeature([ApiKey], 'old_api'),
    TypeOrmModule.forFeature([ApiKey], 'live'),
  ],

  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: ApiKeyGuard,
    },
  ],

  controllers: [AuthController],

})
export class AuthModule {}
