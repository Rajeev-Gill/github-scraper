const puppeteer = require('puppeteer');

const CREDS = require('./creds');

const USERNAME_SELECTOR = '#login_field';
const PASSWORD_SELECTOR = '#password';
const LOGIN_BUTTON = '#login > form > div.auth-form-body.mt-3 > input.btn.btn-primary.btn-block';

const LIST_USERNAME_SELECTOR = '#user_search_results > div.user-list > div:nth-child(INDEX) > div.d-flex.flex-auto > div > a';
const LIST_EMAIL_SELECTOR = '#user_search_results > div.user-list > div:nth-child(INDEX) > div.d-flex.flex-auto > div > ul > li:nth-child(2) > a';
const USER_LIST_ITEM = 'user-list-item';

const userToSearch = 'rajeev';

const searchUrl = `https://github.com/search?q=${userToSearch}&type=Users`;

async function run() {
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();

    await page.goto('https://github.com/login');

    await page.click(USERNAME_SELECTOR);
    await page.keyboard.type(CREDS.username);

    await page.click(PASSWORD_SELECTOR);
    await page.keyboard.type(CREDS.password);

    await page.click(LOGIN_BUTTON);

    await page.goto(searchUrl);

    let listLength = await page.evaluate((selector) => {
        return document.getElementsByClassName(selector).length;
    }, USER_LIST_ITEM);
    
    console.log(listLength);

   for (let i = 1; i<= listLength; i++) {
        let usernameSelector = LIST_USERNAME_SELECTOR.replace("INDEX", i);
        let emailSelector = LIST_EMAIL_SELECTOR.replace("INDEX", i);

        let username = await page.evaluate((selector) => {
            return document.querySelector(selector).getAttribute('href').replace('/', '');
        }, usernameSelector);

        let email = await page.evaluate((selector) => {
            let element = document.querySelector(selector);
        }, emailSelector);

        if(!email){
            console.log(username, 'Email hidden');
            continue;
        }
    
        console.log(username, email);
   
    }

    setTimeout(() => {browser.close()}, 2000);
}

run();
