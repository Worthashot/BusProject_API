import { Controller, Get, Post, Req, Body, UseGuards,Logger } from '@nestjs/common';
import { LogService } from './log.service';
import { Public, Private, Admin } from '../auth/decorators/permission.decorator'
import { LogAddElementDto } from './dto/log.add.element.dto';
import { GetHistogramDto } from './dto/log.get.histogram.dto';
import { Log } from './interfaces/log.interface';

@Controller('log')
export class LogController {
    constructor (private logService: LogService) {}
    private readonly logger = new Logger(LogController.name);

    @Admin()
    @Get('test_number_conversion')
    async testNumberConversion(){
        const testNumber = 100000
        return([this.getDate(testNumber), this.getTime(testNumber)])
    }

    @Admin()
    @Post('new')
    async runMigrationLogs(@Body() logAddListDto : LogAddElementDto[]) {
        try{ 
            const logs:Log[] = logAddListDto.map(logAddElementDto =>({
                tripID:logAddElementDto.trip_id, 
                journeyID:logAddElementDto.journey_id, 
                stopID:logAddElementDto.stop_id, 
                date:this.getDate(logAddElementDto.time), 
                time:this.getTime(logAddElementDto.time)
            }));
            return await this.logService.storeNewLogs(logs);
        } catch(error){
            this.logger.log('Error, input Log not correct form');
        }
        
    }

    @Public()
    @Get('hist')
    async getHistogram(@Body() getHistogramDto : GetHistogramDto){
        try{
            return this.logService.createHistogram(getHistogramDto)
        } catch (error){
            return
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

