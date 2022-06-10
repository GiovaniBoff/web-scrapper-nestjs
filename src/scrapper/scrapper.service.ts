import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { Page } from 'puppeteer';
import { Browser } from 'puppeteer';
import { ScrapperQueryDto } from './dto/scrapper.dto';
@Injectable()
export class ScrapperService {

    private readonly googleUrl = `https://google.com/search?q=`
    private page !: Page;

    async searchLinkedInProfile(query: ScrapperQueryDto): Promise<void> {
        const browser: Browser = await puppeteer.launch({
            headless: false,
            args: ['--headless'],
        });
        this.page = await browser.newPage();
        await this.page.setViewport({ width: 1000, height: 926 })

        const result = []
        const googlinks = await this.openGoogle(query.queries);
        for (let x = 0; x < googlinks.length; x++) {
            const link = googlinks[x];
            console.log('[ ' + x + ' ] ' + link)
            const objprofile = await this.scrapLinkedin(link)
            objprofile['link'] = link;
            result.push(objprofile);
        }

        await browser.close();
    }


    async openGoogle(query: string): Promise<any> {
        await this.page.goto(`${this.googleUrl}${this.parseQuery(query)}`, { waitUntil: 'networkidle2' });

        await this.waitUntil(1000);

        const googleLinks = await this.page.evaluate(() => {
            const listGresult = document.querySelectorAll('.g');
            const linkresult = []
            for (let x = 0; x < listGresult.length; x++) {
                const aElem = listGresult[x].getElementsByTagName('a');
                for (let i = 0; i < aElem.length; i++) {
                    const href = aElem[i].getAttribute('href');
                    if (href != null && href.indexOf("linkedin.com") > 1 && href.indexOf("translate.google") < 0) {
                        linkresult.push(href)
                    }
                }
            }
            return linkresult;
        })
        return googleLinks;
    }

    async scrapLinkedin(link) {
        await this.page.goto(link);
        await this.waitUntil(1000);
        const objprofile = await this.page.evaluate(() => {
            const frameElem = document.querySelector(".ph5 .mt2");

            const nameElem = frameElem.querySelector('.pv-text-details__left-panel .text-heading-xlarge')
            const name = nameElem.textContent.trim()

            const headlineElem = frameElem.querySelector('.pv-text-details__left-panel .text-body-medium');
            const headline = headlineElem.textContent.trim()


            const countryElem = frameElem.querySelector('.pb2 .text-body-small')
            const country = countryElem.textContent.trim();

            const obj = {
                name: name,
                country: country,
                headline: headline,
            }
            return obj;
        })

        return objprofile;
    }

    private parseQuery(queryString): string {
        const queryEnconded: string = encodeURIComponent(queryString);

        return queryEnconded;
    }

    private waitUntil(time) {
        return new Promise((r) => setTimeout(r, time))
    }

}
