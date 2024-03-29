import axios from 'axios';
import cheerio from 'cheerio';
import fs from 'fs';
import axiosRetry from 'axios-retry';

const url = 'https://www.coles.com.au/browse/dairy-eggs-fridge?pid=homepage_cat_explorer_dairy_eggs_fridge';
const mainDomain="https://www.coles.com.au/";
const visitedURLs = []; 
const productURLs = new Set(); 
 const paginationQueueURLsToVisit = ["browse/dairy-eggs-fridge?pid=homepage_cat_explorer_dairy_eggs_fridge"];
const maxPages = 50;
const products=[];

async function webSpider() {     
  let count=0;
    ////////////////Get the Paginations//////////////    
    while(paginationQueueURLsToVisit.length !== 0 && visitedURLs.length <= maxPages  ){
      const paginationURLRoot = paginationQueueURLsToVisit.pop();
      console.log(`Popping out page:${paginationURLRoot}`)
      if(!paginationURLRoot || paginationURLRoot==='undefined' || paginationURLRoot===undefined){
        break;
      }
      const pageHTML1 = await axios.get(`${mainDomain}${paginationURLRoot}`);
      visitedURLs.push(paginationURLRoot);
      const $ = cheerio.load(pageHTML1.data);     
      ///////////// Get Products Information ////////////
        const productLinks = $('[data-testid="product-tile"]');
        productLinks.each((index, element) => {
          const productTitle = $(element).find('.product__title').text().trim();
          const productPrice = $(element).find('.price__value').text().trim();
          let cleanedPrice = productPrice.replace(/\$([0-9]+\.[0-9]+)\$\1/, '$$$1');
          const productUrl='https://www.coles.com.au'+$(element).find('.product__link').attr('href');
          const productImage='https://www.coles.com.au'+$(element).find('.product__image span img').attr('src');
          // console.log(`Product Title ${index + 1}: ${productTitle} Price: ${cleanedPrice}`);
          //  console.log("productImage:", productImage);
          
          if(productTitle!=="" &&  productPrice!==""){
            cleanedPrice=cleanedPrice.replace('$', '');
            cleanedPrice=parseFloat(cleanedPrice);
            let productInfo={
              productTitle, productPrice:cleanedPrice, productUrl, 
              "paginationUrl":`${mainDomain}${paginationURLRoot}`,
              productImage, shop:"Coles"
            };
            products.push(productInfo);
          }
          const productsString = JSON.stringify(products, null, 2);
          fs.writeFileSync('./ColesProducts2.json', productsString);
      });      
      ///////////Now Get the Paginations Number //////////
      $('[data-testid="pagination"] li').each((index, element) => {
        const paginationPageUrl = $(element).find("a").attr("href");
        if(paginationPageUrl){
          if(!visitedURLs.includes(paginationPageUrl) && !paginationQueueURLsToVisit.includes(paginationPageUrl)){
            paginationQueueURLsToVisit.push(paginationPageUrl)
          }
        }
      });
    }     
    const productsString = JSON.stringify(products, null, 2);
     fs.writeFileSync('./ColesProducts2.json', productsString);
}

//  webSpider();

async function getPublicIP() {
    try {
      const response = await axios.get('https://api64.ipify.org?format=json');
      const ipAddress = response.data;
      console.log('Your public IP address is:', ipAddress);
    } catch (error) {
      console.error('Error fetching public IP:', error.message);
    }
  }
  
  getPublicIP();

  function removeDuplicate(){
    const colesProducts = JSON.parse(fs.readFileSync('./ColesProducts.json', 'utf8'));
    console.log(colesProducts.length);
    const uniqueProductUrls = new Set();
    const uniqueProducts = [];    
    for (let i = 0; i < colesProducts.length; i++) {
      if (!uniqueProductUrls.has(colesProducts[i].productUrl)) {
        uniqueProductUrls.add(colesProducts[i].productUrl);
        uniqueProducts.push(colesProducts[i]);
      }
    }
    const productsString = JSON.stringify(uniqueProducts, null, 2);
    fs.writeFileSync('./ColesProducts.json', productsString);
  }
  // removeDuplicate();
// ---------------------------------------------





