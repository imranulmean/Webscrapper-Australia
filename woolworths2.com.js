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
    await page.goto(`https://www.woolworths.com.au/shop/browse/dairy-eggs-fridge?pageNumber=2`, { waitUntil: 'domcontentloaded' });
    // Wait for the wc-product-tile element to be present
    await page.waitForSelector('wc-product-tile', { visible: true });

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

    const navigationLinks = await page.$$eval('.paging-pageNumber', (pages) => {
      return pages.map((page) => {
        const pageNumber = page.querySelector('.title a');
        return pageNumber ? pageNumber.innerHTML : null;
      });
    });    
    console.log(navigationLinks);
  
    await browser.close();
}
test();

const getPageXHRs = async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
  
    try {
      await page.goto(`${mainDomain}${paginationURLRoot}`, { waitUntil: 'domcontentloaded' });
      await page.setViewport({width: 1080, height: 1024});
      // Intercept network requests
      await page.setRequestInterception(true);
  
      page.on('request', async(request) => {

        if (request.resourceType() === 'xhr' || request.resourceType() === 'fetch') {    
            console.log('XHR/Fetch URL:', request.url());      
          if(request.url().includes("apis/ui/browse/category")){
            console.log('XHR/Fetch URL:', request.url());
            console.log("Getting")
            // const pageHTML = await page.content();
            const pageHTML1 = await axios.get(`${mainDomain}${paginationURLRoot}`);      
            fs.writeFileSync('./wool.txt', pageHTML1.data);
        }          
        }
        request.continue();
      });
  
      // Wait for a specific network request
      await page.waitForResponse(async response => {
        // console.log('XHR/Fetch URL (Wait):', response.url());
      });
  
    } catch (error) {
      console.error('Error:', error);
    } finally {
      await browser.close();
    }
  };
  

//   getPageXHRs();

// const getPageHTMLAndWaitForAPICall = async () => {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();

//   try {
//     await page.goto(`${mainDomain}${paginationURLRoot}`, { waitUntil: 'domcontentloaded' });

//     // Wait for a specific element to appear on the page
//     //  await page.waitForSelector('.ng-star-inserted');

//     // Or wait for a specific network request
//     // await page.waitForResponse(response => response.url().includes('apis/ui/browse/category'));
//     await page.waitForResponse(response => {
//         console.log(response.url());
//     });

//     // Grab the page HTML
//     // const pageHTML = await page.content();
//     // console.log('Page HTML:', pageHTML);
//     fs.writeFileSync('./wool.txt', pageHTML);
//   } catch (error) {
//     console.error('Error:', error);
//   } finally {
//     await browser.close();
//   }
// };

// // Call the function
// getPageHTMLAndWaitForAPICall();