import { Module } from '@nestjs/common';
import { MigrationController } from './migration.controller';
import { MigrationService } from './migration.service';
import { ApiKey } from '../auth/entities/apikey.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Log } from 'src/log/entities/log.entity';
@Module({
    imports: [
        TypeOrmModule.forFeature([ApiKey], 'old_api'),
        TypeOrmModule.forFeature([ApiKey], 'live'),
        TypeOrmModule.forFeature([Log], 'old_log'),
        TypeOrmModule.forFeature([Log], 'live'),

      ],

    controllers: [MigrationController],
    providers: [MigrationService],
})
export class MigrationModule {}