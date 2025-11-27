import { TypeOrmModule } from '@nestjs/typeorm';
import { LogEntity } from './entities/log.entity';
import { ArrivalEntity } from './entities/arrival.entity';
import { JourneyEntity } from 'src/journey/entities/journey.entity';
import { StopEntity } from 'src/stop/entities/stop.entity';
import { Module } from '@nestjs/common';
import { LogService } from './log.service';
import { LogController } from './log.controller';

@Module({
imports: [
    TypeOrmModule.forFeature([LogEntity, ArrivalEntity, JourneyEntity, StopEntity], 'live'), // Register entity for this module
  ],

    controllers: [LogController],
    providers: [LogService],
})
export class LogModule {}
