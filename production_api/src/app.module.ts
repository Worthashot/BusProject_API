import { Module } from '@nestjs/common';
import { MigrationModule } from './migration/migration.module';
import {AuthModule} from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiKeyEntity } from './auth/entities/apikey.entity';
import { LogEntityOld } from './log/entities/log_old.entity';
import { LogEntity } from './log/entities/log.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LogModule } from './log/log.module';

@Module({
  imports: [
    ConfigModule.forRoot(),

    // TODO add config service to all these
    TypeOrmModule.forRootAsync({
      name: "old_api",
      useFactory: () => ({
      type: 'sqlite',
      database: 'old_api.db', 
      entities: [ApiKeyEntity],
      synchronize: false, 
      })
    }),

    TypeOrmModule.forRootAsync({
      name: "old_log",
      useFactory: () => ({
      type: 'sqlite',
      database: 'old_log.db', 
      entities: [LogEntityOld],
      synchronize: false, 
      })
    }),

    TypeOrmModule.forRootAsync({
      name: "live",
      useFactory: () => ({
      type: 'sqlite',
      database: 'live.db', 
      entities: [ApiKeyEntity, LogEntity],
      synchronize: false, 
      })
    }),

    //LogModule,
    MigrationModule,
    AuthModule,
  ],
})
export class AppModule {}
