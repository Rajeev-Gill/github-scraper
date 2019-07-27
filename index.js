//Import puppeteer library
const puppeteer = require('puppeteer');

//import user credentials
const CREDS = require('./creds');

//Dom element selectors
const USERNAME_SELECTOR = '#login_field';
const PASSWORD_SELECTOR = '#password';
const LOGIN_BUTTON = '#login > form > div.auth-form-body.mt-3 > input.btn.btn-primary.btn-block';

//Add index to each selector as we will need to loop through all selectors
const LIST_USERNAME_SELECTOR = '#user_search_results > div.user-list > div:nth-child(INDEX) > div.d-flex.flex-auto > div > a';
const LIST_EMAIL_SELECTOR = '#user_search_results > div.user-list > div:nth-child(INDEX) > div.d-flex.flex-auto > div > ul > li:nth-child(2) > a';
const LENGTH_SELECTOR_CLASS = 'user-list-item';

const userToSearch = 'rajeev';

//Github search URL
const searchUrl = `https://github.com/search?q=${userToSearch}&type=Users`; //Use backticks to enable template literal syntax

//Declare async function
async function run() {
    
    //Open a non-headless browser
    const browser = await puppeteer.launch({
        headless: false
    });

    //Add new page to the browser
    const page = await browser.newPage();

    //To to github.com/login in page
    await page.goto('https://github.com/login');

    await page.click(USERNAME_SELECTOR);
    await page.keyboard.type(CREDS.username);

    await page.click(PASSWORD_SELECTOR);
    await page.keyboard.type(CREDS.password);

    await page.click(LOGIN_BUTTON);

    await page.goto(searchUrl);

    let listLength = await page.evaluate((selector) => {
        return document.getElementsByClassName(selector).length;
    }, LENGTH_SELECTOR_CLASS);
    
    console.log(listLength);

   for (let i = 1; i<= listLength; i++) {
        //Change index to next child
        let usernameSelector = LIST_USERNAME_SELECTOR.replace("INDEX", i);
        let emailSelector = LIST_EMAIL_SELECTOR.replace("INDEX", i);

        let username = await page.evaluate((selector) => {
            return document.querySelector(selector).getAttribute('href').replace('/', '');
            //return document.querySelector(selector).innerHTML;
        }, usernameSelector);

        let email = await page.evaluate((selector) => {
            let element = document.querySelector(selector);
            //return element? element.innerHTML: null;
        }, emailSelector);

        //If there is no email log email hidden and skip on to next
        if(!email){
            console.log(username, 'Email hidden');
            continue;
        }
    
        console.log(username, email);
   
    }

    //Close browser after 2s so I can see whats going on
    setTimeout(() => {browser.close()}, 2000);
}

//Execute async function
run();

//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//--//
//Notes

//Open a headless browser
//const browser = await puppeteer.launch();

//Take screenshot of github and store in screenshots folder
//await page.screenshot({ path: 'screenshots/github-login.png' });

//Close browser
//browser.close();

//Login and wait for navigation
// await page.click(LOGIN_BUTTON);
// await page.waitForNavigation();

//Code below this will only execute once BOTH the click and the load have resolved
//https://stackoverflow.com/questions/52211871/how-to-get-puppeteer-waitfornavigation-working-after-click/52212395 
// await Promise.all([
//     page.click(LOGIN_BUTTON),
//     await page.waitForNavigation()
// ])

//Execute a function in context of page
// let listLength = await page.evaluate(function(){
//     //code to be executed in context of page
// }, //Arguments to be passed into function)

// //Grabbing and storing selectors for later use
// const LIST_USERNAME_SELECTOR = '#user_search_results > div.user-list > div:nth-child(1) > div.d-flex.flex-auto > div > a';
// const LIST_EMAIL_SELECTOR = '#user_search_results > div.user-list > div:nth-child(1) > div.d-flex.flex-auto > div > ul > li:nth-child(2) > a';