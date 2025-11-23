"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var MigrationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MigrationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let MigrationService = MigrationService_1 = class MigrationService {
    oldApiDataSource;
    oldLogDataSource;
    liveDataSource;
    logger = new common_1.Logger(MigrationService_1.name);
    constructor(oldApiDataSource, oldLogDataSource, liveDataSource) {
        this.oldApiDataSource = oldApiDataSource;
        this.oldLogDataSource = oldLogDataSource;
        this.liveDataSource = liveDataSource;
    }
    async performMigrationLog() {
        try {
            this.logger.log('Starting Log database migration...');
            await this.setupNewDatabaseLog();
            let limit = 1000;
            let offset = 0;
            let oldLog;
            do {
                oldLog = await this.oldLogDataSource.query('SELECT * FROM arrivals ORDER BY time LIMIT ? OFFSET ?', [limit, offset]);
                await this.migrateLog(oldLog);
                offset += limit;
            } while (oldLog.length === limit);
            this.logger.log('Migration completed successfully!');
        }
        catch (error) {
            this.logger.error('Migration failed:', error);
            throw error;
        }
    }
    async performMigrationApiKey() {
        try {
            this.logger.log('Starting ApiKey database migration...');
            await this.setupNewDatabaseApiKey();
            await this.migrateApi();
            this.logger.log('Migration completed successfully!');
        }
        catch (error) {
            this.logger.error('Migration failed:', error);
            throw error;
        }
    }
    async setupNewDatabaseApiKey() {
        this.logger.log('Setting up new database tables...');
        const queryRunner = this.liveDataSource.createQueryRunner();
        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();
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
            }
            else {
                this.logger.log('api_keys table already exists');
            }
            await queryRunner.commitTransaction();
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            this.logger.error('Failed to setup new database:', error);
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async setupNewDatabaseLog() {
        this.logger.log('Setting up new database tables...');
        const queryRunner = this.liveDataSource.createQueryRunner();
        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();
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
            }
            else {
                this.logger.log('log table already exists');
            }
            await queryRunner.commitTransaction();
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            this.logger.error('Failed to setup new database:', error);
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async migrateApi() {
        this.logger.log('Starting api migration...');
        try {
            const oldApiKeys = await this.oldApiDataSource.query('SELECT * FROM api_keys WHERE isActive = ?', [1]);
            this.logger.log(`Found ${oldApiKeys.length} API keys to migrate`);
            for (const oldKey of oldApiKeys) {
                await this.liveDataSource.query(`INSERT INTO api_keys (id, key, name, permissionLevel, isActive, createdAt) 
           VALUES (?, ?, ?, ?, ?, ?)`, [
                    oldKey.id,
                    oldKey.key,
                    oldKey.name,
                    oldKey.permissionLevel,
                    oldKey.isActive,
                    oldKey.createdAt
                ]);
            }
            this.logger.log('✅ API keys migrated successfully');
        }
        catch (error) {
            this.logger.error('Failed to migrate API keys:', error);
            throw error;
        }
    }
    async migrateLog(oldLog) {
        this.logger.log('Starting batch log migration...');
        try {
            const values = oldLog.flatMap(log => [log.trip_id, log.journey_id, log.stop_id, this.getDate(log.time), this.getTime(log.time)]);
            const placeholders = oldLog.map(() => '(?, ?, ?, ?, ?)').join(', ');
            await this.liveDataSource.query(`INSERT INTO log (trip_id, journey_id, stop_id, date, time) 
          VALUES ${placeholders}`, values);
            this.logger.log('✅ logs migrated successfully');
        }
        catch (error) {
            this.logger.error('Failed to migrate logs:', error);
            throw error;
        }
    }
    getDate(unixTime) {
        const date = new Date(unixTime * 1000);
        const year = date.toLocaleString('en-US', { timeZone: 'Europe/London', year: 'numeric' });
        const month = date.toLocaleString('en-US', { timeZone: 'Europe/London', month: '2-digit' });
        const day = date.toLocaleString('en-US', { timeZone: 'Europe/London', day: '2-digit' });
        return Number(`${year}${month}${day}`);
    }
    getTime(unixTime) {
        const date = new Date(unixTime * 1000);
        const hour = date.toLocaleString('en-US', { timeZone: 'Europe/London', hour: 'numeric', hour12: false });
        const minute = date.toLocaleString('en-US', { timeZone: 'Europe/London', minute: 'numeric' });
        const second = date.toLocaleString('en-US', { timeZone: 'Europe/London', second: 'numeric' });
        return (Number(hour) * 60 * 60) + (Number(minute) * 60) + Number(second);
    }
};
exports.MigrationService = MigrationService;
exports.MigrationService = MigrationService = MigrationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)('old_api')),
    __param(1, (0, typeorm_1.InjectDataSource)('old_log')),
    __param(2, (0, typeorm_1.InjectDataSource)('live')),
    __metadata("design:paramtypes", [typeorm_2.DataSource,
        typeorm_2.DataSource,
        typeorm_2.DataSource])
], MigrationService);
//# sourceMappingURL=migration.service.js.map