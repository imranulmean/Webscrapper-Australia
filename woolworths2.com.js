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
      const paginationURLRoot = paginationQueueURLsToVisit.shift();
      console.log("Popping:", paginationURLRoot);
      if(!paginationURLRoot || paginationURLRoot==='undefined' || paginationURLRoot===undefined){
        break;
      }
      visitedURLs.push(paginationURLRoot);

      await page.goto(`${mainDomain}${paginationURLRoot}`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('wc-product-tile', { visible: true, timeout: 5 * 60000 });
      onPageProducts = await page.evaluate(() => {
        const onPageProducts = [];
        const shadowRoots=[];
        const wcProductTiles = document.querySelectorAll('wc-product-tile');      
        wcProductTiles.forEach((wcProductTile) => {
          const shadowRoot = wcProductTile.shadowRoot;
          const titleElement = shadowRoot.querySelector('.title a');
          const productTitle = titleElement ? titleElement.textContent.trim() : null;
    // Extracting price logic
          const priceElement = shadowRoot.querySelector('.product-tile-price .primary');
          let productPrice = priceElement ? priceElement.textContent.trim() : "";
          
          const productUrl= 'https://www.woolworths.com.au'+titleElement.getAttribute('href');
          const productImageElement=shadowRoot.querySelector('.product-tile-image img');
          const productImage= productImageElement.getAttribute('src');
          if(productPrice && productPrice!=="")
            productPrice = productPrice.replace('$', '');
            productPrice=parseFloat(productPrice);
            onPageProducts.push({ productTitle, productPrice, productUrl, productImage });          
        });
        return onPageProducts;
      });      
      // console.log('onPageProducts:', onPageProducts);
      let paginationObj={
        "paginationUrl":`${mainDomain}${paginationURLRoot}`
      };
      // paginationObj['onPageProducts']=onPageProducts;
      // products.push(paginationObj);
      onPageProducts.map((product) =>{
        product["paginationUrl"]=`${mainDomain}${paginationURLRoot}`;
        products.push(product);
      })
      const productsString = JSON.stringify(products, null, 2);
      fs.writeFileSync('./WoolsProducts.json', productsString);

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

}
test();


