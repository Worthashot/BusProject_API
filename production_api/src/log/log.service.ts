import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository, InjectDataSource} from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Log } from './interfaces/log.interface';
import { HistogramCreate } from './interfaces/histogram.create.interface';
import { Histogram } from './interfaces/histogram.interface';
import { spawn } from 'child_process';

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

    //Return if logs is empty
    try {
      if (logs.length === 0) {
        await queryRunner.commitTransaction();
        return;
      }
    }catch (error) {
      this.logger.error('Failed to release database after not needing to store logs (SHOULD NOT HAPPEN)', error);
      queryRunner.rollbackTransaction();
    } finally{
      await queryRunner.release();
    }

    try{
      await queryRunner.connect();
      await queryRunner.startTransaction();
      for (let i =0; i<logs.length; i += 1000){
        this.logger.log('Storing Log batch...');
        let logsBatch = logs.slice(i, i+1000);
        let values = logsBatch.flatMap(log => 
          [log.tripID, log.journeyID, log.stopID, log.date, log.time]
        );

        let placeholders = logsBatch.map(() => '(?, ?, ?, ?, ?)').join(', ');

        // Insert into new database
        await queryRunner.query(
          `INSERT INTO log (trip_id, journey_id, stop_id, date, time) 
            VALUES ${placeholders}`, values
        );
        this.logger.log('Log batch stored successfully');

        
      }
      this.logger.log('✅ Logs stored successfully');
    }catch (error) {
      this.logger.error('Failed to store Logs:', error);
      queryRunner.rollbackTransaction();
    } finally{
      await queryRunner.release();
    }        
  }

  async createHistogram(histogramCreate : HistogramCreate): Promise<Histogram>{
    const startTime = histogramCreate.timeRangeStart
    const endTime = histogramCreate.timeRangeEnd
    const samples = await this.getSamples(histogramCreate.journeyId, 
      histogramCreate.stopId, 
      startTime,
      endTime) 

    if (!this.isLog(samples)) {
      throw new Error('Unable to create samples');
    }

    const output = this.generateHistogramPython(samples.time, startTime, endTime)
    if (!this.isHistogram(output)){
      throw new Error('Unable to form histogram');
    }
    return output
  }
  private async getSamples(journeyId, stopId, timeRangeStart, timeRangeEnd): Promise<Log | void>{
    const queryString = `
    SELECT trip_id, journey_id, stop_id, date, time 
    FROM log 
    WHERE journey_id = ? 
    AND stop_id = ? 
    AND time BETWEEN ? AND ?
    `;

    const parameters = [journeyId, stopId, timeRangeStart, timeRangeEnd];

    this.logger.log('Loading data from histogram');
    
    const queryRunner = this.liveDataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const histogram = await queryRunner.query(queryString, parameters);
      this.logger.log('✅ histogram data loaded successfully');
      return histogram
    } catch (error) {
      this.logger.error('Failed to load histogram:', error);
      queryRunner.rollbackTransaction();
    } finally{
      await queryRunner.release();
    }    
  }

  private async generateHistogramPython(times, startTime, endTime): Promise<any> {
    return new Promise((resolve, reject) => {
      const inputData = JSON.stringify({times, startTime, endTime});
      const pythonProcess = spawn('python3', ['path/to/your_script.py', inputData]);
      
      let result = '';
      let error = '';

      pythonProcess.stdout.on('data', (data) => {
        result += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        error += data.toString();
      });

      pythonProcess.on('close', (code) => {
        if (code === 0) {
          try {
            resolve(JSON.parse(result));
          } catch (e) {
            reject(new Error('Failed to parse Python output'));
          }
        } else {
          reject(new Error(`Python process failed: ${error}`));
        }
      });
    });
  }


  private isLog(sample: any): sample is Log {
    return (
      sample !== null &&
      sample !== undefined &&
      typeof sample === 'object' &&
      typeof sample.tripID === 'number' &&
      typeof sample.journeyID === 'string' &&
      typeof sample.stopID === 'number' &&
      typeof sample.date === 'number' &&
      typeof sample.time === 'number'
    );
  }

  private isHistogram(sample : any): sample is Histogram {
    return (
        sample !== null &&
        sample !== undefined &&
        typeof sample.counts === 'number' &&
        Array.isArray(sample.bins) &&
        sample.bins.every(item => typeof item === 'number' && !isNaN(item))
    )
  }

}
