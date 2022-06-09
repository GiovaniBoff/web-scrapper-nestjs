import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { Page } from 'puppeteer';
import { Browser } from 'puppeteer';
@Injectable()
export class ScrapperService {

    private readonly googleUrl = `https://google.com/search?q=`

    async searchLinkedInProfile(query: string): Promise<void> {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        const result = []
        const googlinks = await this.openGoogle(page, query);
        for (let x = 0; x < googlinks.length; x++) {
            const link = googlinks[x];
            console.log('[ ' + x + ' ] ' + link)
            const objprofile = await this.scrapLinkedin(page, link)
            objprofile.link = link;
            result.push(objprofile);
        }

        await browser.close();
    }


    async openGoogle(page: Page, query: string): Promise<any> {
        await page.goto(`${this.googleUrl}${this.parseQuery(query)}`, { waitUntil: 'networkidle2' });

        const googleLinks = await page.evaluate(() => {
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

    async scrapLinkedin(page: Page, link) {
        const objprofile = await page.evaluate(() => {
            const frameElem = document.querySelector(".display-flex.mt2");

            const nameElem = frameElem.querySelector('.pv-top-card--list.align-items-center>li')
            const name = nameElem.textContent.trim()

            const headlineElem = frameElem.querySelector('h2');
            const headline = headlineElem.textContent.trim()


            const countryElem = frameElem.querySelector('.pv-top-card--list.pv-top-card--list-bullet.mt1>li')
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

}
