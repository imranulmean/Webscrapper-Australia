import puppeteer from 'puppeteer';
import fs from 'fs';

const mainDomain = "https://www.woolworths.com.au/";
const visitedURLs = [];
const paginationQueueURLsToVisit = ["shop/browse/dairy-eggs-fridge"];
const maxPages = 100;
const products=[];
//document.querySelector("wc-product-tile").shadowRoot.querySelector(".title").innerHTML
// const test= async () =>{ 
//     const browser = await puppeteer.launch({headless:false});
//     const page = await browser.newPage();
//     await page.setViewport({width: 1080, height: 1024});

//     while(paginationQueueURLsToVisit.length !== 0 && visitedURLs.length <= maxPages){
//       let onPageProducts=[];
//       const paginationURLRoot = paginationQueueURLsToVisit.pop();
//       console.log("Popping:", paginationURLRoot);
//       if(!paginationURLRoot || paginationURLRoot==='undefined' || paginationURLRoot===undefined){
//         break;
//       }
//       visitedURLs.push(paginationURLRoot);
//       await page.goto(`${mainDomain}${paginationURLRoot}`, { waitUntil: 'domcontentloaded' });
//       await page.waitForSelector('wc-product-tile', { visible: true, timeout: 10 * 60000, waitUntil: 'domcontentloaded' });
//       onPageProducts = await page.evaluate(() => {
//         const onPageProducts = [];
//         const wcProductTiles = document.querySelectorAll('wc-product-tile');      
//         wcProductTiles.forEach((wcProductTile) => {
//           const shadowRoot = wcProductTile.shadowRoot;
//           const titleElement = shadowRoot.querySelector('.title a');
//           const productTitle = titleElement ? titleElement.textContent.trim() : null;
//           const priceElement = shadowRoot.querySelector('.product-tile-price .primary');
//           let productPrice = priceElement ? priceElement.textContent.trim() : null;
          
//           const productUrl= 'https://www.woolworths.com.au'+titleElement.getAttribute('href');
//           const productImageElement=shadowRoot.querySelector('.product-tile-image img');
//           const productImage= productImageElement.getAttribute('src');
//           if(productPrice && (productPrice!="" || productPrice!=null)){
//             productPrice = productPrice.replace('$', '');
//             productPrice=parseFloat(productPrice);
//             onPageProducts.push({ productTitle, productPrice, productUrl, productImage});
//           }
        
//         });
//         return onPageProducts;
//       });
//       onPageProducts.map((product) =>{
//         product["paginationUrl"]=`${mainDomain}${paginationURLRoot}`;
//         products.push(product);
//       })
//       const productsString = JSON.stringify(products, null, 2);
//       fs.writeFileSync('./WoolsProducts2.json', productsString);

//       const navigationLinks = await page.$$eval('.paging-section a', (pages) => {
//         return pages.map((page) => page.getAttribute('href'));
//       });
//       navigationLinks.map(paginationPageUrl=>{
//         if(paginationPageUrl){
//           if(!visitedURLs.includes(paginationPageUrl) && !paginationQueueURLsToVisit.includes(paginationPageUrl)){
//             paginationQueueURLsToVisit.push(paginationPageUrl)
//           }
//         }
//       })
//     }
//     await browser.close();    

// }

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

removeDuplicate();

// Popping: shop/browse/dairy-eggs-fridge
// Popping: /shop/browse/dairy-eggs-fridge?pageNumber=78
// Popping: /shop/browse/dairy-eggs-fridge?pageNumber=76
// Popping: /shop/browse/dairy-eggs-fridge?pageNumber=75
// Popping: /shop/browse/dairy-eggs-fridge?pageNumber=74
// Popping: /shop/browse/dairy-eggs-fridge?pageNumber=73
// Popping: /shop/browse/dairy-eggs-fridge?pageNumber=72
// Popping: /shop/browse/dairy-eggs-fridge?pageNumber=71
// Popping: /shop/browse/dairy-eggs-fridge?pageNumber=70
// Popping: /shop/browse/dairy-eggs-fridge?pageNumber=69
// Popping: /shop/browse/dairy-eggs-fridge?pageNumber=68
// Popping: /shop/browse/dairy-eggs-fridge?pageNumber=67
// Popping: /shop/browse/dairy-eggs-fridge?pageNumber=66
// Popping: /shop/browse/dairy-eggs-fridge?pageNumber=65
// Popping: /shop/browse/dairy-eggs-fridge?pageNumber=64
// Popping: /shop/browse/dairy-eggs-fridge?pageNumber=63
// Popping: /shop/browse/dairy-eggs-fridge?pageNumber=62
// Popping: /shop/browse/dairy-eggs-fridge?pageNumber=61
// Popping: /shop/browse/dairy-eggs-fridge?pageNumber=60
// Popping: /shop/browse/dairy-eggs-fridge?pageNumber=59
// Popping: /shop/browse/dairy-eggs-fridge?pageNumber=58
// Popping: /shop/browse/dairy-eggs-fridge?pageNumber=57
// Popping: /shop/browse/dairy-eggs-fridge?pageNumber=56
// Popping: /shop/browse/dairy-eggs-fridge?pageNumber=55
// Popping: /shop/browse/dairy-eggs-fridge?pageNumber=54
// Popping: /shop/browse/dairy-eggs-fridge?pageNumber=53
// Popping: /shop/browse/dairy-eggs-fridge?pageNumber=52
// Popping: /shop/browse/dairy-eggs-fridge?pageNumber=51
// Popping: /shop/browse/dairy-eggs-fridge?pageNumber=50
// Popping: /shop/browse/dairy-eggs-fridge?pageNumber=49
// Popping: /shop/browse/dairy-eggs-fridge?pageNumber=48
// Popping: /shop/browse/dairy-eggs-fridge?pageNumber=47
// Popping: /shop/browse/dairy-eggs-fridge?pageNumber=46
// Popping: /shop/browse/dairy-eggs-fridge?pageNumber=45
// Popping: /shop/browse/dairy-eggs-fridge?pageNumber=44
// Popping: /shop/browse/dairy-eggs-fridge?pageNumber=43
// Popping: /shop/browse/dairy-eggs-fridge?pageNumber=42
// Popping: /shop/browse/dairy-eggs-fridge?pageNumber=41
// Popping: /shop/browse/dairy-eggs-fridge?pageNumber=40
// Popping: /shop/browse/dairy-eggs-fridge?pageNumber=39
// Popping: /shop/browse/dairy-eggs-fridge?pageNumber=38
// Popping: /shop/browse/dairy-eggs-fridge?pageNumber=37
// Popping: /shop/browse/dairy-eggs-fridge?pageNumber=36
// Popping: /shop/browse/dairy-eggs-fridge?pageNumber=35
// Popping: /shop/browse/dairy-eggs-fridge?pageNumber=34
// Popping: /shop/browse/dairy-eggs-fridge?pageNumber=33
// Popping: /shop/browse/dairy-eggs-fridge?pageNumber=32
// Popping: /shop/browse/dairy-eggs-fridge?pageNumber=31
// Popping: /shop/browse/dairy-eggs-fridge?pageNumber=30
// Popping: /shop/browse/dairy-eggs-fridge?pageNumber=29
// Popping: /shop/browse/dairy-eggs-fridge?pageNumber=28
// Popping: /shop/browse/dairy-eggs-fridge?pageNumber=27
// Popping: /shop/browse/dairy-eggs-fridge?pageNumber=26