import axios from 'axios';
import cheerio from 'cheerio';
import fs from 'fs';
import puppeteer from 'puppeteer';

const mainDomain="https://www.woolworths.com.au/";
const visitedURLs = []; 
const productURLs = new Set(); 
 const paginationQueueURLsToVisit = ["shop/browse/fruit-veg"];
const maxPages = 50;
const products=[];


async function scrapeWoolworths() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
  
    try {
      // Navigate to the Woolworths Fruit & Veg page
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
      await page.goto('https://www.woolworths.com.au/shop/browse/fruit-veg', {
        waitUntil: 'networkidle2',
      });
      await page.waitForResponse(async response =>  {        
        if(response.status() == 200){
          console.log(response.status())
          await page.screenshot({ path: 'example.png' });
          const html = await page.content();
          const $ = cheerio.load(html);
          console.log($("div .product-title-container .title").text());
        }
        
      }); 

      
      return;
      // Get the HTML content of the page after dynamic content has loaded
      const html = await page.content();
      fs.writeFileSync('./wools2.txt', html);      
      // Load the HTML into Cheerio
      const $ = cheerio.load(html);
  
      // Extract data using Cheerio selectors
      console.log($(".title").length);
      
  
      // Print the scraped data
      for (let i = 0; i < productTitles.length; i++) {
        console.log(`Product Title: ${productTitles[i]}, Price: ${productPrices[i]}`);
      }
    } catch (error) {
      console.error('Error:', error.message);
    } finally {
      // Close the browser
      await browser.close();
    }
  }
  
  // Run the scraper function
  scrapeWoolworths();


