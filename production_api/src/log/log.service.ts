import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository, InjectDataSource} from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Log } from './interfaces/log.interface';

@Injectable()
export class LogService {
  private readonly logger = new Logger(LogService.name);

  constructor(
    @InjectDataSource('live') 
    private liveDataSource: DataSource,
  ) {}  

  async storeNewLogs(logs : Log[]): Promise<void>{
    this.logger.log('Storing new Logs...');
    const queryRunner = this.liveDataSource.createQueryRunner();

    try {
      if (logs.length === 0) {
        await queryRunner.commitTransaction();
        return;
      }
    }catch (error) {
      this.logger.error('Failed to store API keys:', error);
      queryRunner.rollbackTransaction();
    } finally{
      await queryRunner.release();
    }


    try{
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const values = logs.flatMap(log => 
        [log.tripID, log.journeyID, log.stopID, log.date, log.time]
      );

      const placeholders = logs.map(() => '(?, ?, ?, ?, ?)').join(', ');

      // Insert into new database
      for (const log of logs){
        await queryRunner.query(
          `INSERT INTO log (trip_id, journey_id, stop_id, date, time) 
            VALUES ${placeholders}`, values
        );
      }
    

      this.logger.log('✅ API keys stored successfully');
      
    }catch (error) {
      this.logger.error('Failed to store API keys:', error);
      queryRunner.rollbackTransaction();
    } finally{
      await queryRunner.release();
    }        
  }
}
