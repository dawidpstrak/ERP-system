const puppeteer = require('puppeteer');
const { expect } = require('chai');

const seedDatabase = require('../../../backend/tests/helpers/seedDatabase');
const truncateDatabase = require('../../../backend/tests/helpers/truncateDatabase');
const getLocalStorage = require('./utils/getLocalStorage');
const config = require('../../src/config');

let browser, page;

beforeAll(async () => {
    await seedDatabase();
});

afterAll(async () => {
    await truncateDatabase();
});

beforeEach(async () => {
    browser = await puppeteer.launch({ headless: false, args: ['--start-fullscreen'] });
    const pages = await browser.pages();

    // by default chromium opening one tab on init, so i use this tab here instead of creating new one
    page = pages[0];

    await page.setViewport({ width: window.screen.width, height: window.screen.height });

    await page.goto(config.clientUrl);
});

afterEach(async () => {
    await browser.close();
});

describe('authorization tests', () => {
    it('signing in properly with CORRECT CREDENTIALS AS USER', async () => {
        let ls = await getLocalStorage(page);

        expect(ls).to.not.have.property('token');
        expect(ls).to.not.have.property('loggedUser');

        await page.click('input#input-18');
        await page.type('input#input-18', 'user@erpsystem.test');
        await page.click('input#input-22');
        await page.type('input#input-22', 'password');
        await page.click('span.v-btn__content');

        await page.waitForNavigation({ waitUntil: 'networkidle0' });

        ls = await getLocalStorage(page);

        expect(ls).to.have.property('token');
        expect(ls).to.have.property('loggedUser');
    });

    it('signing in properly with CORRECT CREDENTIALS AS ADMIN', async () => {
        let ls = await getLocalStorage(page);

        expect(ls).to.not.have.property('token');
        expect(ls).to.not.have.property('loggedUser');

        await page.click('input#input-18');
        await page.type('input#input-18', 'admin@erpsystem.test');
        await page.click('input#input-22');
        await page.type('input#input-22', 'password');
        await page.click('span.v-btn__content');

        await page.waitForNavigation({ waitUntil: 'networkidle0' });

        ls = await getLocalStorage(page);

        expect(ls).to.have.property('token');
        expect(ls).to.have.property('loggedUser');
    });

    it('fail to signing in with WRONG CREDENTIALS', async () => {
        let ls = await getLocalStorage(page);

        expect(ls).to.not.have.property('token');
        expect(ls).to.not.have.property('loggedUser');

        await page.click('input#input-18');
        await page.type('input#input-18', 'wrong@email.com');
        await page.click('input#input-22');
        await page.type('input#input-22', 'wrong-password');
        await page.click('span.v-btn__content');

        ls = await getLocalStorage(page);

        expect(ls).to.not.have.property('token');
        expect(ls).to.not.have.property('loggedUser');
    });
});
