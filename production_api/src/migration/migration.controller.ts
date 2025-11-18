// migration.controller.ts
import { Controller, Post } from '@nestjs/common';
import { MigrationService } from './migration.service';

import { Public, Private, Admin } from '../auth/decorators/permission.decorator'

@Controller('migration')
export class MigrationController {
  constructor(private readonly migrationService: MigrationService) {}
  @Admin()
  @Post('keys')
  async runMigrationApiKey() {
    return await this.migrationService.performMigrationApiKey();
  }
  @Admin()
  @Post('logs')
  async runMigrationLogs() {
    return await this.migrationService.performMigrationLog();
  }

}