import { MigrationService } from './migration.service';
export declare class MigrationController {
    private readonly migrationService;
    constructor(migrationService: MigrationService);
    runMigrationApiKey(): Promise<void>;
    runMigrationLogs(): Promise<void>;
}
