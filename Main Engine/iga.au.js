import axios from 'axios';
import cheerio from 'cheerio';
import axiosRetry from 'axios-retry';
import fs from 'fs';
import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({headless:false});
const page = await browser.newPage();
await page.setViewport({width: 1080, height: 1024});
const products = [];

async function fetchProducts() {
    try {
        ///////////////////////////////////////////////////
        for(let i=1; i<7 ; i++){
            const pageUrl=`https://www.igashop.com.au/categories/dairy-eggs-and-fridge/milk-and-cream/${i}`
            await page.goto(pageUrl, { waitUntil: 'domcontentloaded',timeout: 10 * 60000 });
            const productPromises=await page.evaluate(() => {
                    console.log("Inside page")
                    const onPageProducts = [];                    
                    const wcProductTiles = document.querySelectorAll('.c-jttMQm');
                    wcProductTiles.forEach((productTile)=>{
                        // console.log(productTile);
                        const titleElement = productTile.querySelector('.line-clamp-3.truncate a');
                        const productTitle = titleElement ? titleElement.textContent.trim() : null;
                        const priceElement = productTile.querySelectorAll('.font-bold.capsize');
                        let productPrice= priceElement.length>1 ? priceElement[1].textContent.trim() : null;
                        const productUrlElement=productTile.querySelector('a');
                        let productUrl = productUrlElement ? productUrlElement.getAttribute('href') : null;
                        const productImageElement=productTile.querySelectorAll('img[alt]');
                        const productImage= productImageElement.length > 1 ? productImageElement[1].getAttribute('src') : null;
                        console.log(productImage)
                        if(productTitle && productTitle!==null && productPrice && productPrice !==null && productUrl && productUrl !==null
                            && productImage && productImage!==null ){
                            productPrice = productPrice.replace('$', '');
                            productPrice=parseFloat(productPrice);
                            productUrl=`https://www.igashop.com.au/${productUrl}`
                            onPageProducts.push({ productTitle, productPrice, productUrl, productImage, shop:"IGA"});
                        }
                    })
                    return onPageProducts;
                });
                productPromises.map((product) =>{
                    product["paginationUrl"]=pageUrl;
                    product["mainCategoryUrl"]='https://www.igashop.com.au/categories/dairy-eggs-and-fridge/milk-and-cream';
                    product["mainCategoryName"]='Milk and Cream'; 
                    product["subCategoryName"]='Milk and Cream';
                    products.push(product);
                });                

        }
        browser.close();
        const productsString = JSON.stringify(products, null, 2);  
        fs.writeFileSync('./IgaProducts.json', productsString);        
    } 
    catch (error) {
      console.error('Error fetching sub-category:' , error);
    }
}



await fetchProducts();