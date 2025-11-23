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
var LogController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogController = void 0;
const common_1 = require("@nestjs/common");
const log_service_1 = require("./log.service");
const permission_decorator_1 = require("../auth/decorators/permission.decorator");
let LogController = LogController_1 = class LogController {
    logService;
    constructor(logService) {
        this.logService = logService;
    }
    logger = new common_1.Logger(LogController_1.name);
    async testNumberConversion() {
        const testNumber = 100000;
        return ([this.getDate(testNumber), this.getTime(testNumber)]);
    }
    async runMigrationLogs(logAddListDto) {
        try {
            const logs = logAddListDto.map(logAddElementDto => ({
                tripID: logAddElementDto.trip_id,
                journeyID: logAddElementDto.journey_id,
                stopID: logAddElementDto.stop_id,
                date: this.getDate(logAddElementDto.time),
                time: this.getTime(logAddElementDto.time)
            }));
            return await this.logService.storeNewLogs(logs);
        }
        catch (error) {
            this.logger.log('Error, input Log not correct form');
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
exports.LogController = LogController;
__decorate([
    (0, permission_decorator_1.Admin)(),
    (0, common_1.Get)('test_number_conversion'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LogController.prototype, "testNumberConversion", null);
__decorate([
    (0, permission_decorator_1.Admin)(),
    (0, common_1.Post)('new'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], LogController.prototype, "runMigrationLogs", null);
exports.LogController = LogController = LogController_1 = __decorate([
    (0, common_1.Controller)('log'),
    __metadata("design:paramtypes", [log_service_1.LogService])
], LogController);
//# sourceMappingURL=log.controller.js.map