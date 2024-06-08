import axios from 'axios';
import cheerio from 'cheerio';
import axiosRetry from 'axios-retry';
import fs from 'fs';

// const mainDomain = 'https://www.coles.com.au';
// const visitedURLs = [];
// const paginationQueueURLsToVisit = ["/browse/dairy-eggs-fridge?pid=homepage_cat_explorer_dairy_eggs_fridge"];
// const maxPages = 50;
// const products = [];

// async function fetchProducts(subCategoryUrl, mainCategoryUrl, mainCategoryName, subCategoryName, subCategoryUrl2) {
//     try {
//       const subCategoryPage = await axios.get(subCategoryUrl);
//       const $subCategoryPageElement = cheerio.load(subCategoryPage.data);
  
//       // Pagination logic
//       const paginationPromises = $subCategoryPageElement('[data-testid="pagination"] li').map(async (index, element) => {
//         const paginationPageUrl = $subCategoryPageElement(element).find("a").attr("href");
//         if (paginationPageUrl && !visitedURLs.includes(paginationPageUrl) && !paginationQueueURLsToVisit.includes(paginationPageUrl)) {          
//           paginationQueueURLsToVisit.push(paginationPageUrl);
//         }
//       });
  
//       await Promise.all(paginationPromises);
      
//         /// when there is no pagination get the products from subCategoryUrl
//         if(paginationQueueURLsToVisit.length===0){
//             paginationQueueURLsToVisit.push(subCategoryUrl2);
//         }
//         ///////////////////////////////////////////////////
//       // Product extraction logic
//         const productPromises = [];
//         while (paginationQueueURLsToVisit.length !== 0 && visitedURLs.length <= maxPages) {
//           const paginationURLRoot = paginationQueueURLsToVisit.pop();
//           console.log(`Popping out page: ${paginationURLRoot}`);
//           console.log(`Visiting ${mainDomain}${paginationURLRoot}`);
//           const pageHTML1 = await axios.get(`${mainDomain}${paginationURLRoot}`);
//           visitedURLs.push(paginationURLRoot);
//           const $ = cheerio.load(pageHTML1.data);
    
//           const productLinks = $('[data-testid="product-tile"]');
//           productLinks.each((index, element) => {
//             const productTitle = $(element).find('.product__title').text().trim();
//             const productPrice = $(element).find('.price__value').text().trim();
//             let cleanedPrice = productPrice.replace(/\$([0-9]+\.[0-9]+)\$\1/, '$$$1');
//             const productUrl = 'https://www.coles.com.au' + $(element).find('.product__link').attr('href');
//             const productImage = 'https://www.coles.com.au' + $(element).find('.product__image span img').attr('src');
    
//             if (productTitle !== "" && productPrice !== "") {
//               cleanedPrice = cleanedPrice.replace('$', '');
//               cleanedPrice = parseFloat(cleanedPrice);
//               let productInfo = {
//                 productTitle,
//                 productPrice: cleanedPrice,
//                 productUrl,
//                 paginationUrl: `${mainDomain}${paginationURLRoot}`,
//                 productImage,
//                 shop: "Coles", mainCategoryUrl, mainCategoryName, subCategoryUrl, subCategoryName
//               };
//               products.push(productInfo);
//             }
//           });
    
//           // Process pagination links concurrently
//           const paginationPromises = $('[data-testid="pagination"] li').map(async (index, element) => {
//             const paginationPageUrl = $(element).find("a").attr("href");
//             if (paginationPageUrl && !visitedURLs.includes(paginationPageUrl) && !paginationQueueURLsToVisit.includes(paginationPageUrl)) {
//               paginationQueueURLsToVisit.push(paginationPageUrl);
//             }
//           });
    
//           productPromises.push(...paginationPromises);
//         }
    
//         // Wait for all product and pagination promises to complete
//         await Promise.all(productPromises);
      

//     } catch (error) {
//       console.error(`Error fetching sub-category: ${subCategoryUrl}`, error);
//     }
// }


// async function fetchSubCategory(mainCategoryUrl, mainCategoryName) {
//   try {
//     const page = await axios.get(mainCategoryUrl);
//     const $subCategoryLink = cheerio.load(page.data);
//     const subCategoryLink = $subCategoryLink('[data-testid="navigation-container"] [data-testid="nav-link"]');

//     // Process sub-categories concurrently using map
//     const subCategoryPromises = Array.from(subCategoryLink).map(async (element2) => {
//       const subCategoryUrl = 'https://www.coles.com.au' + $subCategoryLink(element2).attr('href');
//       const subCategoryUrl2 = $subCategoryLink(element2).attr('href');
//       const subCategoryName = $subCategoryLink(element2).find('.coles-targeting-NavLinkLabel').text().trim();
//       if(subCategoryUrl != mainCategoryUrl){
//         await fetchProducts(subCategoryUrl, mainCategoryUrl, mainCategoryName, subCategoryName, subCategoryUrl2);
//       }
      
//     });

//     await Promise.all(subCategoryPromises);
//   } catch (error) {
//     console.error(`Error fetching main category: ${mainCategoryUrl}`, error);
//   }
// }

// async function ColesWebSpiderCategories() {
//   axiosRetry(axios, { retries: 10, retryDelay: axiosRetry.exponentialDelay });
//   const paginationURLRoot = paginationQueueURLsToVisit.pop();
//   const pageHTML1 = await axios.get(`${mainDomain}${paginationURLRoot}`);
//   visitedURLs.push(paginationURLRoot);

//   const $mainCategoryLink = cheerio.load(pageHTML1.data);
//   const mainCategoryLink = $mainCategoryLink('[data-testid="navigation-container"] [data-testid="nav-link"]');
    
//   // Process main categories concurrently using map
//   const mainCategoryPromises = Array.from(mainCategoryLink).map(async (element) => {
//     const mainCategoryUrl = 'https://www.coles.com.au' + $mainCategoryLink(element).attr('href');    
//     const mainCategoryName = $mainCategoryLink(element).find('.coles-targeting-NavLinkLabel').text().trim();
//     await fetchSubCategory(mainCategoryUrl, mainCategoryName);
//   });
  

//   await Promise.all(mainCategoryPromises);
//   const productsString = JSON.stringify(products, null, 2);
//   fs.writeFileSync('./ColesCategoriesProd3.json', productsString);
// }

// await ColesWebSpiderCategories();

import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

const userAgents = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
  'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:54.0) Gecko/20100101 Firefox/54.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.1 Safari/605.1.15'
];

const getRandomUserAgent = () => userAgents[Math.floor(Math.random() * userAgents.length)];

//Chocolate Bars, Chocolate Blocks, Chocolate Box

const fetchProducts = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1024 });

  await page.setUserAgent(getRandomUserAgent());

  let products = [];

  try {
    for(let i=1; i<2 ; i++){
      const pageUrl=`https://www.coles.com.au/browse/pantry/confectionery/boxed-chocolate?page=${i}`    
      await page.goto(pageUrl, { waitUntil: 'domcontentloaded', timeout: 10 * 60000 });
      console.log('Please solve the CAPTCHA manually...');

      // Wait for a specific selector that is only present on the main page
      await page.waitForSelector('.sc-abaa9c69-7', { timeout: 0 });

      // Delay to ensure the main page loads completely
      // await page.waitForTimeout(3000*10);

      const onPageProducts = await page.evaluate(() => {
        console.log("Inside page")
        const products = [];
        const wcProductTiles = document.querySelectorAll('.sc-abaa9c69-7');
        
        wcProductTiles.forEach(productTile => {        
          const titleElement = productTile.querySelector('.product__title');
          const priceElements = productTile.querySelectorAll('.price__value');
          const productUrlElement = productTile.querySelector('.product__link');
          const productImageElements = productTile.querySelector('.product__image span img');

          const productTitle = titleElement ? titleElement.textContent.trim() : null;
          const productPrice = priceElements.length > 1 ? priceElements[1].textContent.trim().replace('$', '') : null;
          const productUrl = productUrlElement ? `https://www.coles.com.au${productUrlElement.getAttribute('href')}` : null;
          const productImage = productImageElements ? `https://www.coles.com.au${productImageElements.getAttribute('src')}` : null;

          console.log("productTitle: ", productTitle);
          console.log("productPrice: ", productPrice);
          console.log("productUrl: ", productUrl);
          console.log("productImage: ", productImage);

          if (productTitle && productPrice && productUrl && productImage) {
            products.push({
              productTitle,
              productPrice: parseFloat(productPrice),
              productUrl,
              productImage,
              shop: "Coles"
            });
          }
        });

        return products;
      });

      onPageProducts.forEach(product => {
        product.paginationUrl = pageUrl;
        product.mainCategoryUrl = 'https://www.coles.com.au/browse/pantry/confectionery/';
        product.mainCategoryName = 'Confectionary';
        product.subCategoryName = 'Chocolate Box';
        products.push(product);
      });
    }
    // console.log(products);
    const productsString = JSON.stringify(products, null, 2);
    console.log("Writing to file");
    fs.writeFileSync('./Coles_ChocolateBox_Products.json', productsString);
  } catch (error) {
    console.error('Error fetching sub-category:', error);
  } finally {
    // await browser.close();
  }
};

fetchProducts();