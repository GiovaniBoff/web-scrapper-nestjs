import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
@Injectable()
export class ScrapperService {
    constructor() { }

    async search() {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto('https://www.globo.com/');
        await page.screenshot({ path: 'example.png' });

        await browser.close();
    }
}
