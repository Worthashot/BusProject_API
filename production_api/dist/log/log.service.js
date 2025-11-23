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
var LogService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let LogService = LogService_1 = class LogService {
    liveDataSource;
    logger = new common_1.Logger(LogService_1.name);
    constructor(liveDataSource) {
        this.liveDataSource = liveDataSource;
    }
    async storeNewLogs(logs) {
        this.logger.log('Storing new Logs...');
        const queryRunner = this.liveDataSource.createQueryRunner();
        try {
            if (logs.length === 0) {
                await queryRunner.commitTransaction();
                return;
            }
        }
        catch (error) {
            this.logger.error('Failed to store API keys:', error);
            queryRunner.rollbackTransaction();
        }
        finally {
            await queryRunner.release();
        }
        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();
            const values = logs.flatMap(log => [log.tripID, log.journeyID, log.stopID, log.date, log.time]);
            const placeholders = logs.map(() => '(?, ?, ?, ?, ?)').join(', ');
            for (const log of logs) {
                await queryRunner.query(`INSERT INTO log (trip_id, journey_id, stop_id, date, time) 
            VALUES ${placeholders}`, values);
            }
            this.logger.log('✅ API keys stored successfully');
        }
        catch (error) {
            this.logger.error('Failed to store API keys:', error);
            queryRunner.rollbackTransaction();
        }
        finally {
            await queryRunner.release();
        }
    }
};
exports.LogService = LogService;
exports.LogService = LogService = LogService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)('live')),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], LogService);
//# sourceMappingURL=log.service.js.map