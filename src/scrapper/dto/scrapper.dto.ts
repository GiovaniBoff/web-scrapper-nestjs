import { ApiProperty } from "@nestjs/swagger";

export class ScrapperQueryDto {
    @ApiProperty({ example: `site:linkedin.com/in/ AND "Moscow" AND "golang developer"` })
    search: string;
}