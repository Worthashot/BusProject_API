import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class MigrationService {
  private readonly logger = new Logger(MigrationService.name);

  constructor(
    @InjectDataSource('old_api') 
    private oldApiDataSource: DataSource,
    
    @InjectDataSource('old_log') 
    private oldLogDataSource: DataSource,

    @InjectDataSource('live') 
    private liveDataSource: DataSource,
  ) {}

  async performMigrationApiKey(): Promise<void> {
    try {
      this.logger.log('Starting ApiKey database migration...');
      await this.setupNewDatabaseApiKey();
      await this.migrateApi();

      
      this.logger.log('Migration completed successfully!');
    } catch (error) {
      this.logger.error('Migration failed:', error);
      throw error;
    }
  }

    async performMigrationLog(): Promise<void> {
    try {
      this.logger.log('Starting Log database migration...');
      await this.setupNewDatabaseLog();
      await this.migrateLog();
      
      this.logger.log('Migration completed successfully!');
    } catch (error) {
      this.logger.error('Migration failed:', error);
      throw error;
    }
  }

  async setupNewDatabaseApiKey(): Promise<void> {
    this.logger.log('Setting up new database tables...');
    
    const queryRunner = this.liveDataSource.createQueryRunner();
    
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      // Check if api_keys table exists, if not create it
      const apiTableExists = await queryRunner.hasTable('api_keys');
      
      if (!apiTableExists) {
        this.logger.log('Creating api_keys table in new database...');
        await queryRunner.query(`
          CREATE TABLE "api_keys" (
            "id" INTEGER PRIMARY KEY AUTOINCREMENT,
            "key" VARCHAR NOT NULL UNIQUE,
            "name" VARCHAR NOT NULL,
            "permissionLevel" TEXT CHECK(permissionLevel IN ('ADMIN', 'PRIVATE', 'PUBLIC')) NOT NULL DEFAULT 'PUBLIC',
            "isActive" BOOLEAN BOOLEAN NOT NULL DEFAULT (1),
            "createdAt" DATETIME NOT NULL DEFAULT (CURRENT_TIMESTAMP)
          )
        `);
        this.logger.log('api_keys table created successfully');
      } else {
        this.logger.log('api_keys table already exists');
      }

      await queryRunner.commitTransaction();
      
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Failed to setup new database:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

    async setupNewDatabaseLog(): Promise<void> {
    this.logger.log('Setting up new database tables...');
    
    const queryRunner = this.liveDataSource.createQueryRunner();
    
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      // Check if log table exists, if not create it

      const logTableExists = await queryRunner.hasTable('log');

      if (!logTableExists) {
        this.logger.log('Creating log table in new database...');
        await queryRunner.query(`
          CREATE TABLE "log" (
            "id" INTEGER PRIMARY KEY AUTOINCREMENT,
            "trip_id" INTEGER NOT NULL,
            "journey_id" VARCHAR NOT NULL,
            "stop_id" INTEGER NOT NULL,
            "time" INTEGER NOT NULL
          )
        `);
        this.logger.log('log table created successfully');
      } else {
        this.logger.log('log table already exists');
      }


      await queryRunner.commitTransaction();
      
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Failed to setup new database:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async migrateApi(): Promise<void> {
    this.logger.log('Starting api migration...');
    try {
      // Read from old database
      const oldApiKeys = await this.oldApiDataSource.query(
        'SELECT * FROM api_keys WHERE isActive = ?', [1]
      );

      this.logger.log(`Found ${oldApiKeys.length} API keys to migrate`);

      // Insert into new database
      for (const oldKey of oldApiKeys) {
        await this.liveDataSource.query(
          `INSERT INTO api_keys (id, key, name, permissionLevel, isActive, createdAt) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            oldKey.id, 
            oldKey.key, 
            oldKey.name, 
            oldKey.permissionLevel, 
            oldKey.isActive, 
            oldKey.createdAt
          ]
        );
      }

      this.logger.log('✅ API keys migrated successfully');
      
    } catch (error) {
      this.logger.error('Failed to migrate API keys:', error);
      throw error;
    }
  }

    async migrateLog(): Promise<void> {
    this.logger.log('Starting log migration...');
    try {
      // Read from old database
      const oldLog = await this.oldLogDataSource.query(
        'SELECT * FROM arrivals'
      );

      this.logger.log(`Found ${oldLog.length} logs to migrate`);

      // Insert into new database
      
      const values = oldLog.flatMap(log => 
        [log.tripID, log.journeyID, log.stopID, log.date, log.time]
      );

      const placeholders = oldLog.map(() => '(?, ?, ?, ?, ?)').join(', ');

        await this.liveDataSource.query(
          `INSERT INTO log (trip_id, journey_id, stop_id, time) 
           VALUES ${placeholders}`, values
        );
      

      this.logger.log('✅ logs migrated successfully');
      
    } catch (error) {
      this.logger.error('Failed to migrate logs:', error);
      throw error;
    }
  }


}