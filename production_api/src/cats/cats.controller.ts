
import { Controller, Get, Post, Req, Body, UseGuards } from '@nestjs/common';
import {CreateCatDto} from './dto/create-cat.dto';
import { Cat } from './interfaces/cat.interface';
import { CatsService } from './cats.service';

import { Public, Private, Admin } from '../auth/decorators/permission.decorator'

@Controller('cats')
export class CatsController {
    constructor (private catsService: CatsService) {}

    @Get()
    @Public()
    async findAll(): Promise<Cat[]> {
        return this.catsService.findAll();
    }


    @Post()
    @Public()
    async create(@Body() createCatDto: CreateCatDto) {
        this.catsService.create(createCatDto)
    }

}
