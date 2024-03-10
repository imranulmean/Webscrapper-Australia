import puppeteer from 'puppeteer';
import fs from 'fs';

const mainDomain = "https://www.woolworths.com.au/";
const visitedURLs = [];
const paginationQueueURLsToVisit = ["shop/browse/dairy-eggs-fridge"];
const maxPages = 100;
const products=[];
//document.querySelector("wc-product-tile").shadowRoot.querySelector(".title").innerHTML

const test= async () =>{ 
    const browser = await puppeteer.launch({headless:false});
    const page = await browser.newPage();
    await page.setViewport({width: 1080, height: 1024});

    while(paginationQueueURLsToVisit.length !== 0 && visitedURLs.length <= maxPages){
      let onPageProducts=[];
      const paginationURLRoot = paginationQueueURLsToVisit.pop();
      console.log("Popping:", paginationURLRoot);
      if(!paginationURLRoot || paginationURLRoot==='undefined' || paginationURLRoot===undefined){
        break;
      }
      visitedURLs.push(paginationURLRoot);
      await page.goto(`${mainDomain}${paginationURLRoot}`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('wc-product-tile', { visible: true, timeout: 10 * 60000, waitUntil: 'domcontentloaded' });
      onPageProducts = await page.evaluate(() => {
        const onPageProducts = [];
        const wcProductTiles = document.querySelectorAll('wc-product-tile');      
        wcProductTiles.forEach((wcProductTile) => {
          const shadowRoot = wcProductTile.shadowRoot;
          const titleElement = shadowRoot.querySelector('.title a');
          const productTitle = titleElement ? titleElement.textContent.trim() : null;
          const priceElement = shadowRoot.querySelector('.product-tile-price .primary');
          let productPrice = priceElement ? priceElement.textContent.trim() : null;
          
          const productUrl= 'https://www.woolworths.com.au'+titleElement.getAttribute('href');
          const productImageElement=shadowRoot.querySelector('.product-tile-image img');
          const productImage= productImageElement.getAttribute('src');
          if(productPrice && (productPrice!="" || productPrice!=null)){
            productPrice = productPrice.replace('$', '');
            productPrice=parseFloat(productPrice);
            onPageProducts.push({ productTitle, productPrice, productUrl, productImage});
          }
        
        });
        return onPageProducts;
      });
      onPageProducts.map((product) =>{
        product["paginationUrl"]=`${mainDomain}${paginationURLRoot}`;
        products.push(product);
      })
      const productsString = JSON.stringify(products, null, 2);
      fs.writeFileSync('./WoolsProducts2.json', productsString);

      const navigationLinks = await page.$$eval('.paging-section a', (pages) => {
        return pages.map((page) => page.getAttribute('href'));
      });
      navigationLinks.map(paginationPageUrl=>{
        if(paginationPageUrl){
          if(!visitedURLs.includes(paginationPageUrl) && !paginationQueueURLsToVisit.includes(paginationPageUrl)){
            paginationQueueURLsToVisit.push(paginationPageUrl)
          }
        }
      })
    }
    await browser.close();

}

// const test= async () =>{ 
//   let paginationQueueURLsToVisit = [];
//   // for(let i=2;i<=26;i++){
//     paginationQueueURLsToVisit.push(`/shop/browse/dairy-eggs-fridge?pageNumber=1`);
//   // }
//   const browser = await puppeteer.launch({headless:false});
//   const page = await browser.newPage();
//   await page.setViewport({width: 1080, height: 1024});

//   while(paginationQueueURLsToVisit.length !== 0 && visitedURLs.length <= maxPages){
//     let onPageProducts=[];
//     const paginationURLRoot = paginationQueueURLsToVisit.pop();
//     console.log("Popping:", paginationURLRoot);
//     if(!paginationURLRoot || paginationURLRoot==='undefined' || paginationURLRoot===undefined){
//       break;
//     }
//     visitedURLs.push(paginationURLRoot);
//     await page.goto(`${mainDomain}${paginationURLRoot}`, { waitUntil: 'domcontentloaded' });
//     await page.waitForSelector('wc-product-tile', { visible: true, timeout: 10 * 60000, waitUntil: 'domcontentloaded' });
//     onPageProducts = await page.evaluate(() => {
//       const onPageProducts = [];
//       const wcProductTiles = document.querySelectorAll('wc-product-tile');      
//       wcProductTiles.forEach((wcProductTile) => {
//         const shadowRoot = wcProductTile.shadowRoot;
//         const titleElement = shadowRoot.querySelector('.title a');
//         const productTitle = titleElement ? titleElement.textContent.trim() : null;
//         const priceElement = shadowRoot.querySelector('.product-tile-price .primary');
//         let productPrice = priceElement ? priceElement.textContent.trim() : null;
        
//         const productUrl= 'https://www.woolworths.com.au'+titleElement.getAttribute('href');
//         const productImageElement=shadowRoot.querySelector('.product-tile-image img');
//         const productImage= productImageElement.getAttribute('src');
//         if(productPrice && (productPrice!="" || productPrice!=null)){
//           productPrice = productPrice.replace('$', '');
//           productPrice=parseFloat(productPrice);
//           onPageProducts.push({ productTitle, productPrice, productUrl, productImage});
//         }
      
//       });
//       return onPageProducts;
//     });
//     onPageProducts.map((product) =>{
//       product["paginationUrl"]=`${mainDomain}${paginationURLRoot}`;
//       products.push(product);
//     })
//     const productsString = JSON.stringify(products, null, 2);
//     fs.writeFileSync('./WoolsProducts4.json', productsString);
//   }
//   await browser.close();    

// }
// test();
function removeDuplicate(){
  const woolsProducts = JSON.parse(fs.readFileSync('./WoolsProducts.json', 'utf8'));
  console.log(woolsProducts.length);
  const uniqueProductUrls = new Set();
  const uniqueProducts = [];    
  for (let i = 0; i < woolsProducts.length; i++) {
    if (!uniqueProductUrls.has(woolsProducts[i].productUrl)) {
      uniqueProductUrls.add(woolsProducts[i].productUrl);
      uniqueProducts.push(woolsProducts[i]);
    }
  }
  const productsString = JSON.stringify(uniqueProducts, null, 2);
  fs.writeFileSync('./WoolsProducts.json', productsString);
}

// removeDuplicate();
