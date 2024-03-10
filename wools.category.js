import puppeteer from 'puppeteer';
import fs from 'fs';
import axios from 'axios';
import cheerio from 'cheerio';

const mainDomain = "https://www.woolworths.com.au";
const visitedURLs = [];
const paginationQueueURLsToVisit = ["/shop/browse/dairy-eggs-fridge"];
const maxPages = 100;
const products=[];

// const browser = await puppeteer.launch({headless:false});
// const page = await browser.newPage();
// await page.setViewport({width: 1080, height: 1024});

// async function fetchProducts(subCategoryUrl, mainCategoryUrl, mainCategoryName, subCategoryName, subCategoryUrl2) {
//     await page.goto(subCategoryUrl, { waitUntil: 'domcontentloaded',timeout: 10 * 60000 });
//     await page.waitForSelector('wc-product-tile', { visible: true, timeout: 10 * 60000, waitUntil: 'domcontentloaded' });
    
//     const navigationLinks = await page.$$eval('.paging-section a', (pages) => {
//         return pages.map((page) => page.getAttribute('href'));
//       });
//       navigationLinks.map(paginationPageUrl=>{
//         if(paginationPageUrl){
//           if(!visitedURLs.includes(paginationPageUrl) && !paginationQueueURLsToVisit.includes(paginationPageUrl)){
//             paginationQueueURLsToVisit.push(paginationPageUrl)
//           }
//         }
//       })
//     /// when there is no pagination get the products from subCategoryUrl
//         if(paginationQueueURLsToVisit.length===0){
//             paginationQueueURLsToVisit.push(subCategoryUrl2);
//         }
//         ///////////////////////////////////////////////////
//       while(paginationQueueURLsToVisit.length !== 0 && visitedURLs.length <= maxPages){
//             const paginationURLRoot = paginationQueueURLsToVisit.pop();
//             console.log("Popping:", paginationURLRoot);
//             visitedURLs.push(paginationURLRoot);
//             console.log(`Visiting ${mainDomain}${paginationURLRoot}`);
//             await page.goto(`${mainDomain}${paginationURLRoot}`, { waitUntil: 'domcontentloaded',timeout: 10 * 60000 });
//             await page.waitForSelector('wc-product-tile', { visible: true, timeout: 10 * 60000, waitUntil: 'domcontentloaded' });
//             let productPromises= await page.evaluate(() => {
//                 const onPageProducts = [];
//                 const wcProductTiles = document.querySelectorAll('wc-product-tile');      
//                 wcProductTiles.forEach((wcProductTile) => {
//                 const shadowRoot = wcProductTile.shadowRoot;
//                 const titleElement = shadowRoot.querySelector('.title a');
//                 const productTitle = titleElement ? titleElement.textContent.trim() : null;
//                 const priceElement = shadowRoot.querySelector('.product-tile-price .primary');
//                 let productPrice = priceElement ? priceElement.textContent.trim() : null;
                
//                 const productUrl= 'https://www.woolworths.com.au'+titleElement.getAttribute('href');
//                 const productImageElement=shadowRoot.querySelector('.product-tile-image img');
//                 const productImage= productImageElement.getAttribute('src');
//                 if(productPrice && (productPrice!="" || productPrice!=null)){
//                     productPrice = productPrice.replace('$', '');
//                     productPrice=parseFloat(productPrice);
//                     onPageProducts.push({ productTitle, productPrice, productUrl, productImage});
//                 }
                
//                 });
//                 return onPageProducts;
//             });
//             productPromises.map((product) =>{
//                 product["paginationUrl"]=`${mainDomain}${paginationURLRoot}`;
//                 product["mainCategoryUrl"]=mainCategoryUrl;
//                 product["mainCategoryName"]=mainCategoryName; 
//                 product["subCategoryName"]=subCategoryName;
//                 products.push(product);
//             });

//             const productsString = JSON.stringify(products, null, 2);
//             // fs.writeFileSync('./WoolsCategoriesProd2.json', productsString);

//             const navigationLinks = await page.$$eval('.paging-section a', (pages) => {
//                 return pages.map((page) => page.getAttribute('href'));
//             });
//             navigationLinks.map(paginationPageUrl=>{
//                 if(paginationPageUrl){
//                 if(!visitedURLs.includes(paginationPageUrl) && !paginationQueueURLsToVisit.includes(paginationPageUrl)){
//                     paginationQueueURLsToVisit.push(paginationPageUrl)
//                 }
//                 }
//             })            
//         }
//   }

// async function fetchSubCategory(mainCategoryUrl, mainCategoryName) {
//     await page.goto(`${mainCategoryUrl}`, { waitUntil: 'domcontentloaded',timeout: 10 * 60000 });
//     await page.waitForSelector('wc-product-tile', { visible: true, timeout: 10 * 60000, waitUntil: 'domcontentloaded' });
//     let subCategoryPromises = await page.evaluate(() => {
//         let subCategoryArray=[];
//         const subCategoryButtons = document.querySelectorAll('.chip-list .chip-list-item');      
//         subCategoryButtons.forEach(async(subCategoryElement) => {
//             let subCategoryUrlElement=subCategoryElement.querySelector('wow-category-chip a');
//             if(subCategoryUrlElement){               
//                     let subCategoryUrl= "https://www.woolworths.com.au" + subCategoryUrlElement.getAttribute('href');
//                     let subCategoryUrl2= subCategoryUrlElement.getAttribute('href');
//                     let subCategoryName=subCategoryUrlElement.querySelector('.chip-text-container .chip-text').textContent.trim()
//                     let obj={subCategoryUrl, subCategoryName, subCategoryUrl2}
//                     subCategoryArray.push(obj);                    
//             }            
//         });
//         return subCategoryArray;
//       });
      
//       console.log(subCategoryPromises);
//       /////// Now Get the Products ////////
//       for(let i=2; i< subCategoryPromises.length; i++){
//         await fetchProducts(subCategoryPromises[i].subCategoryUrl, mainCategoryUrl, mainCategoryName, subCategoryPromises[i].subCategoryName, subCategoryPromises[i].subCategoryUrl2);
//       }      
// }

// async function WoolsWebSpiderCategories() {
//     const paginationURLRoot = paginationQueueURLsToVisit.pop();
//     visitedURLs.push(paginationURLRoot);
//     await page.goto(`${mainDomain}${paginationURLRoot}`, { waitUntil: 'domcontentloaded' });
//     await page.waitForSelector('wc-product-tile', { visible: true, timeout: 10 * 60000, waitUntil: 'domcontentloaded' });

//     let mainCategoryPromises = await page.evaluate(() => {
//         let mainCategoryArray=[];
//         const mainCategoryButtons = document.querySelectorAll('.chip-list .chip-list-item');      
//         mainCategoryButtons.forEach((mainCategoryElement) => {
//             let mainCategoryUrlElement=mainCategoryElement.querySelector('wow-category-chip a');
//             if(mainCategoryUrlElement){
               
//                     let mainCategoryUrl= "https://www.woolworths.com.au" + mainCategoryUrlElement.getAttribute('href');
//                     let mainCategoryName=mainCategoryUrlElement.querySelector('.chip-text-container .chip-text').textContent.trim()
//                     let obj={mainCategoryUrl, mainCategoryName}
//                     mainCategoryArray.push(obj);
                                    
//             }            
//         });
//         return mainCategoryArray;
//       });
      
//       console.log(mainCategoryPromises);
//       ///////// Now Get the Sub Categories for Each Main Category ////////
//       for(let i=2; i< mainCategoryPromises.length; i++){
//         await fetchSubCategory(mainCategoryPromises[i].mainCategoryUrl, mainCategoryPromises[i].mainCategoryName);
//       }
//       await browser.close();
// }

// await WoolsWebSpiderCategories();

// const woolsProducts = JSON.parse(fs.readFileSync('./webscarpper.woolsCategorizedProducts.json', 'utf8'));
// console.log(woolsProducts.length);
// for (let i=0; i< woolsProducts.length; i++){
//   const pageHTML1 = await axios.get(woolsProducts[i].productUrl);
//   const $ = cheerio.load(pageHTML1.data);
//   const title= $('.ar-product-detail-panel').find('.shelfProductTile-title').text().trim();
//   console.log(title);
// }

const pageHTML1 = await axios.get("https://www.woolworths.com.au/shop/productdetails/40709/bega-farmers-tasty-cheese");
fs.writeFileSync('./TestWools.html', pageHTML1.data);

