import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { Page } from 'puppeteer';
import { Browser } from 'puppeteer';
import { ScrapperQueryDto } from './dto/scrapper.dto';
@Injectable()
export class ScrapperService {

    private readonly googleUrl = `https://google.com/search?q=`
    private readonly linkedInUrl = `https://www.linkedin.com/`
    private page !: Page;

    async searchLinkedInProfile(query: ScrapperQueryDto): Promise<any> {
        const browser: Browser = await puppeteer.launch({
            headless: true,
            // args: ['--headless'],
        });
        this.page = await browser.newPage();
        await this.page.setViewport({ width: 1000, height: 926 })

        await this.page.goto(this.linkedInUrl);

        await this.page.type('#session_key', query.username);
        await this.page.type('#session_password', query.password);

        await this.page.click('.sign-in-form__submit-button');

        await this.waitUntil(3000);
        const result = []
        const googlinks = await this.openGoogle(query.search);
        for (let x = 0; x < googlinks.length; x++) {
            const link = googlinks[x];
            console.log('[ ' + x + ' ] ' + link)
            const objprofile = await this.scrapLinkedin(link)
            objprofile['link'] = link;
            result.push(objprofile);
        }
        await browser.close();
        return result;
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

    async scrapLinkedin(link: string) {
        await this.page.goto(link);
        await this.waitUntil(1000);
        const objprofile = await this.page.evaluate(async () => {
            const frameElem = document.querySelector(".ph5 .mt2");

            const nameElem = frameElem.querySelector('.pv-text-details__left-panel .text-heading-xlarge')
            const name = nameElem.textContent.trim()

            const headlineElem = frameElem.querySelector('.pv-text-details__left-panel .text-body-medium');
            const headline = headlineElem.textContent.trim()

            const formationList = Array.from(document.getElementById('education')
                .nextElementSibling
                .nextElementSibling
                .getElementsByTagName('ul')[0]
                .getElementsByTagName('li'))
            const formations = formationList.map(formation =>
                formation
                    .outerText
                    .replace(/\s+/g, ' ')
                    .trim()
            )


            const countryElem = frameElem.querySelector('.pb2 .text-body-small')
            const country = countryElem.textContent.trim();

            const obj = {
                name: name,
                country: country,
                headline: headline,
                formation: formations,
                email: ''
            }
            return obj;
        })
        const emailProfile = await this.grabTheEmail(link);
        objprofile.email = emailProfile
        return objprofile
    }

    private parseQuery(queryString): string {
        const queryEnconded: string = encodeURIComponent(queryString);

        return queryEnconded;
    }


    async grabTheEmail(link: string) {
        console.log(`grabTheEmail ======>${link}`);
        const linkModal = `${link.replace('br', 'www')}/overlay/contact-info/`
        console.log(`grabTheEmail linkModal ======>${linkModal}`);
        await this.page.goto(linkModal);

        await this.waitUntil(1000);
        const profileEmail = await this.page.evaluate(async () => {

            const emailElem = document.querySelector('#artdeco-modal-outlet .artdeco-modal__content .pv-profile-section .pv-profile-section__section-info .pv-contact-info__contact-type.ci-email .pv-contact-info__ci-container .pv-contact-info__contact-link')
            const email = emailElem.textContent.trim();

            return email;
        })
        return profileEmail;
    }

    private waitUntil(time) {
        return new Promise((r) => setTimeout(r, time))
    }

}
