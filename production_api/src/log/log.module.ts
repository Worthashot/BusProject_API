import { TypeOrmModule } from '@nestjs/typeorm';
import { LogEntity } from './entities/log.entity';
import { Module } from '@nestjs/common';
import { LogService } from './log.service';
import { LogController } from './log.controller';

@Module({
imports: [
    TypeOrmModule.forFeature([LogEntity], 'live'), // Register entity for this module
  ],

    controllers: [LogController],
    providers: [LogService],
})
export class LogModule {}
