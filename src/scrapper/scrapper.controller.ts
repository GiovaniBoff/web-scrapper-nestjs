import { Controller, Get, Query } from '@nestjs/common';
import { ScrapperQueryDto } from './dto/scrapper.dto';
import { ScrapperService } from './scrapper.service';

@Controller('scrapper')
export class ScrapperController {
    constructor(private readonly service: ScrapperService) { }

    @Get()
    async search(@Query() query: ScrapperQueryDto): Promise<any> {
        return this.service.searchLinkedInProfile(query);
    }
}
