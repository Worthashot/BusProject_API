import { Controller, Get, Post, Req, Body, UseGuards } from '@nestjs/common';
import { LogService } from './log.service';

@Controller('cats')
export class LogController {
    constructor (private logService: LogService) {}


}