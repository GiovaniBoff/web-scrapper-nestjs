import { Injectable } from '@nestjs/common';
import { Client } from 'linkedin-private-api';

@Injectable()
export class LinkedPrivateApiService {

    private client = new Client();

}
