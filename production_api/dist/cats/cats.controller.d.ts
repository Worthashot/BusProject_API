import { CreateCatDto } from './dto/create-cat.dto';
import { Cat } from './interfaces/cat.interface';
import { CatsService } from './cats.service';
export declare class CatsController {
    private catsService;
    constructor(catsService: CatsService);
    findAll(): Promise<Cat[]>;
    create(createCatDto: CreateCatDto): Promise<void>;
}
