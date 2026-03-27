import puppeteer from 'puppeteer';
import fs from 'fs';

const getHadithContent = async () => {
    try {
        const browser = await puppeteer.launch({
            headless: false,
            executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
        });

        const page = await browser.newPage();
        await page.setViewport({ width: 1080, height: 1024 });

        let allData = [];

        let bookNo=24;
        let totalPage2=314;        
        let totalHadiths = 6293;

        for (let pageNum = 0; pageNum <= totalPage2; pageNum++) {
            console.log(`Scraping page ${pageNum} of ${totalPage2}...`);

            await page.goto(`https://www.hadithbd.com/hadith/fullbook/?pageNum_mainHadith=${pageNum}&totalRows_mainHadith=${totalHadiths}&book=${bookNo}`, {
                waitUntil: 'networkidle2',
            });
            const texts = await page.evaluate(() => {
                let contentNodes = Array.from(document.querySelectorAll('#myHadithTabContent'));

                return contentNodes.map(tab => {
                    let fontArabic = tab.querySelector('.font-arabic');
                    let arabicText = Array.from(fontArabic?.querySelectorAll('span.arabic-text') || []).map(text => {
                        return text.innerText.trim();
                    });

                    let banglaDiv = tab.querySelector('.order-2');
                    let title = banglaDiv?.querySelector('.my-3')?.innerText || "";
                    let banglaText = Array.from(banglaDiv?.querySelectorAll('span p') || []).map(text => {
                        return text.innerText.trim();
                    });
                    let bookName="mishkatul_misbah"
                    return { arabicText, title, banglaText, bookName };
                });
            });

            allData.push(...texts);
        }

        // final save
        fs.writeFileSync('sunan_abu_daud.json', JSON.stringify(allData, null, 2), 'utf-8');
        console.log(`✅ Done! Total hadiths scraped: ${allData.length}`);

        await browser.close();

    } catch (error) {
        console.log(error.message);
    }
}

await getHadithContent();