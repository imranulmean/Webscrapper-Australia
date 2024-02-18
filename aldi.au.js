import axios from 'axios';
import cheerio from 'cheerio';
import fs from 'fs';

const url = 'https://www.coles.com.au/browse/dairy-eggs-fridge?pid=homepage_cat_explorer_dairy_eggs_fridge';
const mainDomain="https://www.aldi.com.au/";
const visitedURLs = []; 
const productURLs = new Set(); 
 const paginationQueueURLsToVisit = ["groceries/fresh-produce/dairy-eggs/"];
const maxPages = 50;
let products=[];


async function webSpider() {     
  let count=0;
  console.log("Starting Crawling");
    ////////////////Get the Paginations//////////////    
    while(paginationQueueURLsToVisit.length !== 0 && visitedURLs.length <= maxPages  ){        
      const paginationURLRoot = paginationQueueURLsToVisit.pop();
      const pageHTML1 = await axios.get(`${mainDomain}${paginationURLRoot}`,{
          'headers':{
            'Content-Type': 'application/json',
          }
      });
      visitedURLs.push(paginationURLRoot);
      const $ = cheerio.load(pageHTML1.data);
      ///////////// Get Products Information ////////////
        const productLinks = $('.ym-gl');
        let onPageProducts=[];
        let paginationObj={
            "paginationUrl":`${mainDomain}${paginationURLRoot}`
          };
        productLinks.each((index, element) => {
          const productTitle = $(element).find('.box--description--header').text().trim();
          const productPrice = $(element).find('.box--price .box--value').text().trim();
          const decimalPrice = $(element).find('.box--price .box--decimal').text().trim();
          const productUrl=$(element).attr('href');
          if(productUrl){
            let productInfo={productTitle, productPrice:`${productPrice}${decimalPrice}`,productUrl};
            onPageProducts.push(productInfo);
          }

      });
      paginationObj['onPageProducts']=onPageProducts;
      products.push(paginationObj);
    } 

    const productsString = JSON.stringify(products, null, 2);
     fs.writeFileSync('./AldiProducts.json', productsString);
}
    

 await webSpider();