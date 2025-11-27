import { Module } from '@nestjs/common';
import { MigrationController } from './migration.controller';
import { MigrationService } from './migration.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogEntity } from 'src/log/entities/log.entity';
import { ArrivalEntity } from 'src/log/entities/arrival.entity';
import { StopEntity } from 'src/stop/entities/stop.entity';
import { JourneyEntity } from 'src/journey/entities/journey.entity';
import { ArrivalBasicEntity} from './entities/arrival.basic.entity';
import { JourneyBasicEntity } from './entities/journey.basic.entity';
import { StopBasicEntity } from './entities/stop.basic.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([ArrivalBasicEntity], 'basic_arrivals'),
        TypeOrmModule.forFeature([JourneyBasicEntity], 'basic_journies'),
        TypeOrmModule.forFeature([StopBasicEntity], 'basic_stops'),
        TypeOrmModule.forFeature([LogEntity, ArrivalEntity, StopEntity, JourneyEntity], 'live'),

      ],

    controllers: [MigrationController],
    providers: [MigrationService],
})
export class MigrationModule {}