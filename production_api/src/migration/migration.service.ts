import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';



@Injectable()
export class MigrationService {
  private readonly logger = new Logger(MigrationService.name);

  constructor(
    @InjectDataSource('basic_arrivals') 
    private basicArrivalsDataSource: DataSource,

    @InjectDataSource('basic_journies') 
    private basicJourniesDataSource: DataSource,

    @InjectDataSource('basic_stops') 
    private basicStopsDataSource: DataSource,

    @InjectDataSource('live') 
    private liveDataSource: DataSource,
  ) {}

  async createStopsTable(): Promise<void>{
    this.logger.log('Setting up table stops in database Live');
    
    const queryRunner = this.liveDataSource.createQueryRunner();
    
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      // Check if log table exists, if not create it

      const stopsTableExists = await queryRunner.hasTable('stops');

      if (!stopsTableExists) {
        this.logger.log('Creating stops table in database Live...');
        await queryRunner.query(`
          CREATE TABLE "log" (
            "stop_id" INTEGER PRIMARY KEY AUTOINCREMENT,
            "stop_name" VARCHAR NOT NULL,
            "stop_api_id" INTEGER NOT NULL,
            "latitude" REAL NOT NULL,
            "longitude" REAL NOT NULL,
            "bearing" INTEGER NOT NULL
          )
        `);
        this.logger.log('stops table created successfully');
      } else {
        this.logger.log('stops table already exists');
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

  async createJourniesTable(): Promise<void>{
    this.logger.log('Setting up table journies in database Live');
    
    const queryRunner = this.liveDataSource.createQueryRunner();
    
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      // Check if log table exists, if not create it

      const journiesTableExists = await queryRunner.hasTable('journies');

      if (!journiesTableExists) {
        this.logger.log('Creating journies table in database Live...');
        await queryRunner.query(`
          CREATE TABLE "journies" (
            "journey_id" INTEGER PRIMARY KEY AUTOINCREMENT,
            "journey_name" VARCHAR NOT NULL,
            "service" VARCHAR NOT NULL,
            "description" VARCHAR NOT NULL,
            "destination" VARCHAR NOT REAL
          )
        `);
        this.logger.log('stops table created successfully');
      } else {
        this.logger.log('stops table already exists');
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
  
  async createLogsTable(): Promise<void>{
    this.logger.log('Setting up table logs in database Live');
    
    const queryRunner = this.liveDataSource.createQueryRunner();
    
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      // Check if log table exists, if not create it

      const logsTableExists = await queryRunner.hasTable('logs');

      if (!logsTableExists) {
        await queryRunner.query(`
          CREATE TABLE logs (
            log_id INTEGER PRIMARY KEY AUTOINCREMENT,
            stop_id INTEGER NOT NULL,
            journey_id INTEGER NOT NULL,
            stop_sequence INTEGER,
            direction TEXT,
            FOREIGN KEY (stop_id) REFERENCES stops(stop_id),
            FOREIGN KEY (journey_id) REFERENCES journies(journey_id),
            UNIQUE(stop_id, journey_id, direction)
          )
        `);
        this.logger.log('stops table created successfully');
      } else {
        this.logger.log('stops table already exists');
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

  async createArrivalsTable(): Promise<void>{
    this.logger.log('Setting up table arrivals in database Live');
    
    const queryRunner = this.liveDataSource.createQueryRunner();
    
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      // Check if log table exists, if not create it

      const arrivalsTableExists = await queryRunner.hasTable('arrivals');

      if (!arrivalsTableExists) {
        await queryRunner.query(`
          CREATE TABLE arrivals (
            arrival_id INTEGER PRIMARY KEY AUTOINCREMENT,
            log_id INTEGER NOT NULL,
            trip_id INTEGER NOT NULL,
            date INTEGER NOT NULL,
            time INTEGER NOT NULL,
            FOREIGN KEY (log_id) REFERENCES logs(log_id)
          )
        `);
        this.logger.log('stops table created successfully');
      } else {
        this.logger.log('stops table already exists');
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

  async performMigrationStops(): Promise<void>{
    return
  }

  async performMigrationJournies(): Promise<void>{
    return
  }

  async populateLogJunctions(): Promise<void>{
    return
  }

  async performMigrationArrivals(): Promise<void>{
    return
  }

  async performMigrationLog(): Promise<void> {
    try {
      this.logger.log('Starting Log database migration...');
      await this.setupNewDatabaseLog();
      let limit = 1000;
      let offset = 0
      let oldLog : any[];
      do{
        // Read from old database
        oldLog = await this.oldLogDataSource.query(
          'SELECT * FROM arrivals ORDER BY time LIMIT ? OFFSET ?',
          [limit, offset]
        );
        await this.migrateLog(oldLog);
        offset += limit
      } while (oldLog.length === limit)

      
      this.logger.log('Migration completed successfully!');
    } catch (error) {
      this.logger.error('Migration failed:', error);
      throw error;
    }
  }

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
            "date" INTEGER NOT NULL,
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

    async migrateLog(oldLog): Promise<void> {
    this.logger.log('Starting batch log migration...');
    try {


      // Insert into new database
      const values = oldLog.flatMap(log => 
        [log.trip_id, log.journey_id, log.stop_id, this.getDate(log.time), this.getTime(log.time)]
      );

      const placeholders = oldLog.map(() => '(?, ?, ?, ?, ?)').join(', ');

      await this.liveDataSource.query(
        `INSERT INTO log (trip_id, journey_id, stop_id, date, time) 
          VALUES ${placeholders}`, values
      );
      

      this.logger.log('✅ logs migrated successfully');
      
    } catch (error) {
      this.logger.error('Failed to migrate logs:', error);
      throw error;
    }
  }
  private getDate(unixTime : number): number{
      const date = new Date(unixTime * 1000); 
      const year = date.toLocaleString('en-US', { timeZone: 'Europe/London', year: 'numeric' });
      const month = date.toLocaleString('en-US', { timeZone: 'Europe/London', month: '2-digit' });
      const day = date.toLocaleString('en-US', { timeZone: 'Europe/London', day: '2-digit' });
      return Number(`${year}${month}${day}`)
  }

  private  getTime(unixTime : number): any{
      const date = new Date(unixTime * 1000); 
      const hour = date.toLocaleString('en-US', { timeZone: 'Europe/London', hour: 'numeric', hour12: false });
      const minute = date.toLocaleString('en-US', { timeZone: 'Europe/London', minute: 'numeric' });
      const second = date.toLocaleString('en-US', { timeZone: 'Europe/London', second: 'numeric' });
      return (Number(hour)*60*60) + (Number(minute) * 60) + Number(second)
  }
}