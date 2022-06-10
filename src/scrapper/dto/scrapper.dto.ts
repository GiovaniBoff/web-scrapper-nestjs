import { ApiProperty } from "@nestjs/swagger";

export class ScrapperQueryDto {
    @ApiProperty()
    queries: string;
}