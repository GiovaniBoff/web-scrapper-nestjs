import { Controller, Get } from '@nestjs/common';
import { ScrapperService } from './scrapper.service';

@Controller('scrapper')
export class ScrapperController {
    constructor(private readonly service: ScrapperService) { }

    @Get()
    async search() {
        return this.service.search();
    }
}
