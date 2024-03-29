import axios from 'axios';
import cheerio from 'cheerio';
import fs from 'fs';

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
        const productLinks = $('a.ym-gl');
        productLinks.each((index, element) => {
          const productTitle = $(element).find('.box--description--header').text().trim();
          let productPrice = $(element).find('.box--price .box--value').text().trim();
          const decimalPrice = $(element).find('.box--price .box--decimal').text().trim();
          productPrice=`${productPrice}${decimalPrice}`;
          productPrice=productPrice.replace('$', '');          
          const productUrl=$(element).attr('href');
          const productImage=$(element).find('img').attr('src');
          if(productUrl){
            productPrice= parseFloat(productPrice);
            let productInfo={
                              productTitle, productPrice,productUrl, 
                              "paginationUrl":`${mainDomain}${paginationURLRoot}`,
                              productImage
                            };
            products.push(productInfo);
          }

      });
    } 

    const productsString = JSON.stringify(products, null, 2);
     fs.writeFileSync('./AldiProducts2.json', productsString);
}
    

 await webSpider();
