import { TypeOrmModule } from '@nestjs/typeorm';
import { Log } from '../log/entities/log.entity';
import { Module } from '@nestjs/common';


@Module({
imports: [
    TypeOrmModule.forFeature([Log]), // Register entity for this module
  ],


})
export class LogModule {}
