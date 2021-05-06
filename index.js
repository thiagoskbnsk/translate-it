const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const getTranslation = async () => {
  const fileName = require.resolve(path.resolve('src', 'input.txt'));
  const file = fs.readFileSync(fileName, 'utf8');
  const sentences = file.split('\n');

  fs.writeFile('src/output.txt', '', (err) => {
    if (err) {
      console.log(err);
    }
  });

  await Promise.all(sentences.map(async sentence => {
    const url = `https://translate.google.com/?sl=en&tl=pt&text=${sentence}&op=translate`;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
  
    await page.waitForSelector('[jsname="W297wb"]');
  
    const response = await page.evaluate(() => {
      const translatedText = document.querySelector('[jsname="W297wb"]');
  
      return translatedText.textContent;
    });

    fs.appendFile('src/output.txt', `${sentence} \t ${response} \n`, (err) => {
      if (err) {
        console.log(err);
      }
    });
  
    await page.close();
  }));

  process.exit();
};

getTranslation();