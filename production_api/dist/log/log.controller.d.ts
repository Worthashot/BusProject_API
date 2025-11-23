import { LogService } from './log.service';
import { LogAddElementDto } from './dto/log.add.element.dto';
export declare class LogController {
    private logService;
    constructor(logService: LogService);
    private readonly logger;
    testNumberConversion(): Promise<any[]>;
    runMigrationLogs(logAddListDto: LogAddElementDto[]): Promise<void>;
    private getDate;
    private getTime;
}
