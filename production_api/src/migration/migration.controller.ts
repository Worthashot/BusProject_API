// migration.controller.ts
import { Controller, Post, Logger } from '@nestjs/common';
import { MigrationService } from './migration.service';

import { Public, Private, Admin } from '../auth/decorators/permission.decorator'

@Controller('migration')
export class MigrationController {
  constructor(private readonly migrationService: MigrationService) {}
  private readonly logger = new Logger(MigrationService.name);
  @Admin()
  @Post('start')
  async runMigrationLogs() {
    this.logger.log('Starting database migration...');
    await this.migrationService.createStopsTable()
    await this.migrationService.createJourniesTable()
    await this.migrationService.createLogsTable()
    await this.migrationService.createArrivalsTable()

    await this.migrationService.performMigrationStops();
    await this.migrationService.performMigrationJournies();
    await this.migrationService.populateLogJunctions();
    await this.migrationService.performMigrationArrivals();
    return
  }

}