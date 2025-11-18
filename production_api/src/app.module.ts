import { Module } from '@nestjs/common';
import { CatsModule } from './cats/cats.module';
import { MigrationModule } from './migration/migration.module';
import {AuthModule} from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiKey } from './auth/entities/apikey.entity';
import { Log } from './log/entities/log.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),

    // TODO add config service to all these
    TypeOrmModule.forRootAsync({
      name: "old_api",
      useFactory: () => ({
      type: 'sqlite',
      database: 'old_api.db', 
      entities: [ApiKey],
      synchronize: false, 
      })
    }),

    TypeOrmModule.forRootAsync({
      name: "old_log",
      useFactory: () => ({
      type: 'sqlite',
      database: 'old_log.db', 
      entities: [Log],
      synchronize: false, 
      })
    }),

    TypeOrmModule.forRootAsync({
      name: "live",
      useFactory: () => ({
      type: 'sqlite',
      database: 'live.db', 
      entities: [ApiKey, Log],
      synchronize: false, 
      })
    }),

    CatsModule,
    MigrationModule,
    AuthModule,
  ],
})
export class AppModule {}
