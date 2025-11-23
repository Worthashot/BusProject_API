import { DataSource } from 'typeorm';
export declare class MigrationService {
    private oldApiDataSource;
    private oldLogDataSource;
    private liveDataSource;
    private readonly logger;
    constructor(oldApiDataSource: DataSource, oldLogDataSource: DataSource, liveDataSource: DataSource);
    performMigrationLog(): Promise<void>;
    performMigrationApiKey(): Promise<void>;
    setupNewDatabaseApiKey(): Promise<void>;
    setupNewDatabaseLog(): Promise<void>;
    migrateApi(): Promise<void>;
    migrateLog(oldLog: any): Promise<void>;
    private getDate;
    private getTime;
}
