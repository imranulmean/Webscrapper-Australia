import axios from 'axios';
import cheerio from 'cheerio';
import axiosRetry from 'axios-retry';
import fs from 'fs';
import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({headless:false});
const page = await browser.newPage();
await page.setViewport({width: 1080, height: 1024});
const products = [];

//Chocolate Bars, Chocolate Blocks, Chocolate Box

async function fetchProducts() {
    try {
        ///////////////////////////////////////////////////
        for(let i=1; i<6 ; i++){
            const pageUrl=`https://www.igashop.com.au/categories/pantry/confectionary/${i}?f=Category%3ABoxed+Chocolates`
            await page.goto(pageUrl, { waitUntil: 'domcontentloaded',timeout: 10 * 60000 });
            const productPromises=await page.evaluate(() => {
                    console.log("Inside page")
                    const onPageProducts = [];                    
                    const wcProductTiles = document.querySelectorAll('.c-jttMQm');
                    wcProductTiles.forEach((productTile)=>{
                        // console.log(productTile);
                        const titleElement = productTile.querySelector('.line-clamp-3.truncate a');
                        let productTitle = titleElement ? titleElement.textContent.trim() : null;
                        const priceElement = productTile.querySelectorAll('.font-bold.capsize');
                        let productPrice= priceElement.length>1 ? priceElement[1].textContent.trim() : null;
                        const productUrlElement=productTile.querySelector('a');
                        let productUrl = productUrlElement ? productUrlElement.getAttribute('href') : null;

                        let  productWeightElement=productTile.querySelectorAll('.font-bold a');
                        let productWeight = productWeightElement.length>1 ? productWeightElement[1].textContent.trim() : null;
                        console.log("productWeight: ", productWeight);
                        
                        const productImageElement=productTile.querySelectorAll('img[alt]');
                        const productImage= productImageElement.length > 1 ? productImageElement[1].getAttribute('src') : null;

                        if(productTitle && productTitle!==null && productWeight && productWeight!==null && productPrice && productPrice !==null && productUrl && productUrl !==null
                            && productImage && productImage!==null ){

                            productWeight = productWeight.replace(/\s*Litre/, 'L'); 
                            productWeight = productWeight.replace(/\s*Millilitre/, 'mL');
                            productWeight = productWeight.replace(/\s*Gram/, 'gm');
                            productWeight = productWeight.replace(/\s*Kilogram/, 'kg');
                                    
                            productTitle=`${productTitle} ${productWeight}`
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
                    product["mainCategoryUrl"]='https://www.igashop.com.au/categories/pantry/confectionary/';
                    product["mainCategoryName"]='Confectionary'; 
                    product["subCategoryName"]='Chocolate Box';
                    products.push(product);
                });                

        }        
        browser.close();
        const productsString = JSON.stringify(products, null, 2);  
        console.log("Writing to file")
        fs.writeFileSync('./Iga_ChocolateBox_Products.json', productsString);        
    } 
    catch (error) {
      console.error('Error fetching sub-category:' , error);
    }
}



await fetchProducts();