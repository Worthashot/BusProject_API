import { DataSource } from 'typeorm';
import { Log } from './interfaces/log.interface';
export declare class LogService {
    private liveDataSource;
    private readonly logger;
    constructor(liveDataSource: DataSource);
    storeNewLogs(logs: Log[]): Promise<void>;
}
