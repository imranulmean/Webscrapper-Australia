import puppeteer from 'puppeteer';
import fs from 'fs';
import axios from 'axios';
import cheerio from 'cheerio';

const mainDomain = "https://www.woolworths.com.au/";
const paginationURLRoot = "shop/browse/dairy-eggs-fridge";
// document.querySelector("wc-product-tile").shadowRoot.querySelector(".title").innerHTML
const test= async () =>{ 
    // const pageHTML1 = await axios.get('https://www.woolworths.com.au/shop/browse/dairy-eggs-fridge?pageNumber=2');
    const browser = await puppeteer.launch({headless:false});
    const page = await browser.newPage();
    await page.setViewport({width: 1080, height: 1024});
    await page.goto(`https://www.woolworths.com.au/shop/browse/dairy-eggs-fridge?pageNumber=2`, { waitUntil: 'domcontentloaded' });
    // Wait for the wc-product-tile element to be present
    await page.waitForSelector('wc-product-tile', { visible: true, timeout: 60000 });
    page.on('console', message => console.log(message.text()));
    // Evaluate within the browser context to get the product titles
    const productTitles = await page.$$eval('wc-product-tile', (wcProductTiles) => {
      return wcProductTiles.map((wcProductTile) => {
        const shadowRoot = wcProductTile.shadowRoot;
        const titleElement = shadowRoot.querySelector('.title a');
        return titleElement ? titleElement.innerHTML : null;
      });
    });
  
    // Log the product titles
    console.log('Product Titles:', productTitles);

    const navigationLinks = await page.$$eval('.paging-section a', (pages) => {
      return pages.map((page) => page.getAttribute('href'));
    });    
    console.log(navigationLinks);
  
    await browser.close();
}
test();


