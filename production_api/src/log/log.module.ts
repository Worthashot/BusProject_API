import { TypeOrmModule } from '@nestjs/typeorm';
import { LogEntity } from '../log/entities/log.entity';
import { Module } from '@nestjs/common';


@Module({
imports: [
    TypeOrmModule.forFeature([LogEntity]), // Register entity for this module
  ],


})
export class LogModule {}
