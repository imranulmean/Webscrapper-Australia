import axios from 'axios';
import cheerio from 'cheerio';
import axiosRetry from 'axios-retry';
import fs from 'fs';

const mainDomain = 'https://www.coles.com.au';
const visitedURLs = [];
const paginationQueueURLsToVisit = ["/browse/dairy-eggs-fridge?pid=homepage_cat_explorer_dairy_eggs_fridge"];
const maxPages = 50;
const products = [];

// async function fetchProducts(subCategoryUrl, mainCategoryUrl, mainCategoryName, subCategoryName) {
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

//       // Product extraction logic
//         const productPromises = [];
//         while (paginationQueueURLsToVisit.length !== 0 && visitedURLs.length <= maxPages) {
//           const paginationURLRoot = paginationQueueURLsToVisit.pop();
//           // console.log(`Popping out page: ${paginationURLRoot}`);
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
//   }

async function fetchProducts(subCategoryUrl, mainCategoryUrl, mainCategoryName, subCategoryName, subCategoryUrl2) {
    try {
      const subCategoryPage = await axios.get(subCategoryUrl);
      const $subCategoryPageElement = cheerio.load(subCategoryPage.data);
  
      // Pagination logic
      const paginationPromises = $subCategoryPageElement('[data-testid="pagination"] li').map(async (index, element) => {
        const paginationPageUrl = $subCategoryPageElement(element).find("a").attr("href");
        if (paginationPageUrl && !visitedURLs.includes(paginationPageUrl) && !paginationQueueURLsToVisit.includes(paginationPageUrl)) {          
          paginationQueueURLsToVisit.push(paginationPageUrl);
        }
      });
  
      await Promise.all(paginationPromises);
      
        /// when there is no pagination get the products from subCategoryUrl
        if(paginationQueueURLsToVisit.length===0){
            paginationQueueURLsToVisit.push(subCategoryUrl2);
        }
        ///////////////////////////////////////////////////
      // Product extraction logic
        const productPromises = [];
        while (paginationQueueURLsToVisit.length !== 0 && visitedURLs.length <= maxPages) {
          const paginationURLRoot = paginationQueueURLsToVisit.pop();
          console.log(`Popping out page: ${paginationURLRoot}`);
          console.log(`Visiting ${mainDomain}${paginationURLRoot}`);
          const pageHTML1 = await axios.get(`${mainDomain}${paginationURLRoot}`);
          visitedURLs.push(paginationURLRoot);
          const $ = cheerio.load(pageHTML1.data);
    
          const productLinks = $('[data-testid="product-tile"]');
          productLinks.each((index, element) => {
            const productTitle = $(element).find('.product__title').text().trim();
            const productPrice = $(element).find('.price__value').text().trim();
            let cleanedPrice = productPrice.replace(/\$([0-9]+\.[0-9]+)\$\1/, '$$$1');
            const productUrl = 'https://www.coles.com.au' + $(element).find('.product__link').attr('href');
            const productImage = 'https://www.coles.com.au' + $(element).find('.product__image span img').attr('src');
    
            if (productTitle !== "" && productPrice !== "") {
              cleanedPrice = cleanedPrice.replace('$', '');
              cleanedPrice = parseFloat(cleanedPrice);
              let productInfo = {
                productTitle,
                productPrice: cleanedPrice,
                productUrl,
                paginationUrl: `${mainDomain}${paginationURLRoot}`,
                productImage,
                shop: "Coles", mainCategoryUrl, mainCategoryName, subCategoryUrl, subCategoryName
              };
              products.push(productInfo);
            }
          });
    
          // Process pagination links concurrently
          const paginationPromises = $('[data-testid="pagination"] li').map(async (index, element) => {
            const paginationPageUrl = $(element).find("a").attr("href");
            if (paginationPageUrl && !visitedURLs.includes(paginationPageUrl) && !paginationQueueURLsToVisit.includes(paginationPageUrl)) {
              paginationQueueURLsToVisit.push(paginationPageUrl);
            }
          });
    
          productPromises.push(...paginationPromises);
        }
    
        // Wait for all product and pagination promises to complete
        await Promise.all(productPromises);
      

    } catch (error) {
      console.error(`Error fetching sub-category: ${subCategoryUrl}`, error);
    }
}


async function fetchSubCategory(mainCategoryUrl, mainCategoryName) {
  try {
    const page = await axios.get(mainCategoryUrl);
    const $subCategoryLink = cheerio.load(page.data);
    const subCategoryLink = $subCategoryLink('[data-testid="navigation-container"] [data-testid="nav-link"]');

    // Process sub-categories concurrently using map
    const subCategoryPromises = Array.from(subCategoryLink).map(async (element2) => {
      const subCategoryUrl = 'https://www.coles.com.au' + $subCategoryLink(element2).attr('href');
      const subCategoryUrl2 = $subCategoryLink(element2).attr('href');
      const subCategoryName = $subCategoryLink(element2).find('.coles-targeting-NavLinkLabel').text().trim();
      if(subCategoryUrl != mainCategoryUrl){
        await fetchProducts(subCategoryUrl, mainCategoryUrl, mainCategoryName, subCategoryName, subCategoryUrl2);
      }
      
    });

    await Promise.all(subCategoryPromises);
  } catch (error) {
    console.error(`Error fetching main category: ${mainCategoryUrl}`, error);
  }
}

async function ColesWebSpiderCategories() {
  axiosRetry(axios, { retries: 10, retryDelay: axiosRetry.exponentialDelay });
  const paginationURLRoot = paginationQueueURLsToVisit.pop();
  const pageHTML1 = await axios.get(`${mainDomain}${paginationURLRoot}`);
  visitedURLs.push(paginationURLRoot);

  const $mainCategoryLink = cheerio.load(pageHTML1.data);
  const mainCategoryLink = $mainCategoryLink('[data-testid="navigation-container"] [data-testid="nav-link"]');
    
  // Process main categories concurrently using map
  const mainCategoryPromises = Array.from(mainCategoryLink).map(async (element) => {
    const mainCategoryUrl = 'https://www.coles.com.au' + $mainCategoryLink(element).attr('href');    
    const mainCategoryName = $mainCategoryLink(element).find('.coles-targeting-NavLinkLabel').text().trim();
    await fetchSubCategory(mainCategoryUrl, mainCategoryName);
  });
  

  await Promise.all(mainCategoryPromises);
  const productsString = JSON.stringify(products, null, 2);
  fs.writeFileSync('./ColesCategoriesProd3.json', productsString);
}

await ColesWebSpiderCategories();