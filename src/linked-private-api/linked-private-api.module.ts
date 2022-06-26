import { Module } from '@nestjs/common';
import { LinkedPrivateApiController } from './linked-private-api.controller';
import { LinkedPrivateApiService } from './linked-private-api.service';

@Module({
  controllers: [LinkedPrivateApiController],
  providers: [LinkedPrivateApiService]
})
export class LinkedPrivateApiModule {}
