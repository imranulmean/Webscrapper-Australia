import puppeteer from 'puppeteer';
import fs from 'fs';
import axios from 'axios';
import cheerio from 'cheerio';

const mainDomain = "https://www.woolworths.com.au/";
const visitedURLs = [];
const paginationQueueURLsToVisit = ["shop/browse/dairy-eggs-fridge"];
const maxPages = 100;
const products=[];
//document.querySelector("wc-product-tile").shadowRoot.querySelector(".title").innerHTML
const test= async () =>{ 
    // const pageHTML1 = await axios.get('https://www.woolworths.com.au/shop/browse/dairy-eggs-fridge?pageNumber=2');
    const browser = await puppeteer.launch({headless:false});
    const page = await browser.newPage();
    await page.setViewport({width: 1080, height: 1024});

    while(paginationQueueURLsToVisit.length !== 0 && visitedURLs.length <= maxPages){
      let onPageProducts=[];
      const paginationURLRoot = paginationQueueURLsToVisit.pop();
      if(!paginationURLRoot || paginationURLRoot==='undefined' || paginationURLRoot===undefined){
        break;
      }
      visitedURLs.push(paginationURLRoot);

      await page.goto(`${mainDomain}${paginationURLRoot}`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('wc-product-tile', { visible: true, timeout: 2 * 60000 });
      onPageProducts = await page.evaluate(() => {
        const onPageProducts = [];
        const shadowRoots=[];
        const wcProductTiles = document.querySelectorAll('wc-product-tile');      
        wcProductTiles.forEach((wcProductTile) => {
          const shadowRoot = wcProductTile.shadowRoot;
          const titleElement = shadowRoot.querySelector('.title a');
          const title = titleElement ? titleElement.textContent.trim() : null;
    // Extracting price logic
          const priceElement = shadowRoot.querySelector('.product-tile-price .primary');
          const productPrice = priceElement ? priceElement.textContent.trim() : null;
          const productUrl= titleElement.getAttribute('href')
          if(productPrice!==null)
            onPageProducts.push({ title, productPrice, productUrl });
          
        });
        return onPageProducts;
      });      
      console.log('onPageProducts:', onPageProducts);
      let paginationObj={
        "paginationUrl":`${mainDomain}${paginationURLRoot}`
      };
      paginationObj['onPageProducts']=onPageProducts;
      products.push(paginationObj);
      const navigationLinks = await page.$$eval('.paging-section a', (pages) => {
        return pages.map((page) => page.getAttribute('href'));
      });
      // console.log(navigationLinks);
      navigationLinks.map(paginationPageUrl=>{
        if(!visitedURLs.includes(paginationPageUrl) && !paginationQueueURLsToVisit.includes(paginationPageUrl)){
          paginationQueueURLsToVisit.push(paginationPageUrl)
        }
      })
    }
    await browser.close();    
    const productsString = JSON.stringify(products, null, 2);
    fs.writeFileSync('./WoolsProducts.json', productsString);
}
test();


