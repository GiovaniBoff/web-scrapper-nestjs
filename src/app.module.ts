import { Module } from '@nestjs/common';
import { ScrapperModule } from './scrapper/scrapper.module';
import { LinkedPrivateApiModule } from './linked-private-api/linked-private-api.module';

@Module({
  imports: [ScrapperModule, LinkedPrivateApiModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
