import { DataSource } from 'typeorm';
export declare class MigrationService {
    private oldApiDataSource;
    private oldLogDataSource;
    private liveDataSource;
    private readonly logger;
    constructor(oldApiDataSource: DataSource, oldLogDataSource: DataSource, liveDataSource: DataSource);
    performMigrationApiKey(): Promise<void>;
    performMigrationLog(): Promise<void>;
    setupNewDatabaseApiKey(): Promise<void>;
    setupNewDatabaseLog(): Promise<void>;
    migrateApi(): Promise<void>;
    migrateLog(): Promise<void>;
}
