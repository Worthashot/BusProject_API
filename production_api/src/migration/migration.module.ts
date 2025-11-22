import { Module } from '@nestjs/common';
import { MigrationController } from './migration.controller';
import { MigrationService } from './migration.service';
import { ApiKeyEntity } from '../auth/entities/apikey.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogEntity } from 'src/log/entities/log.entity';
@Module({
    imports: [
        TypeOrmModule.forFeature([ApiKeyEntity], 'old_api'),
        TypeOrmModule.forFeature([ApiKeyEntity], 'live'),
        TypeOrmModule.forFeature([LogEntity], 'old_log'),
        TypeOrmModule.forFeature([LogEntity], 'live'),

      ],

    controllers: [MigrationController],
    providers: [MigrationService],
})
export class MigrationModule {}