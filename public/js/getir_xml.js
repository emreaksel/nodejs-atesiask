import puppeteer from 'puppeteer';
import xml2js from 'xml2js';
import http from 'http';

export async function foo() {
    //some async initiallizers
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('http://kardelendergisi.com/atesiask/baska.xml');

    //const heading1 = await page.$eval("#folder0 > div.opened > div:nth-child(6) > span > span:nth-child(1) > span.html-attribute-value", el => el.textContent);
    //console.log(heading1)
    //console.log("--------------");

    const list_baska_xml = await page.evaluate(() =>
        Array.from(document.querySelectorAll("#folder0 > div.opened > div.line > span"), (element) => element.textContent)
    );
    console.log("asynctask: " + list_baska_xml[list_baska_xml.length - 1])

    const titles = await page.evaluate(() =>
        Array.from(
            document.querySelectorAll("#folder0 > div.opened > div.line > span.html-tag > span > span.html-attribute-value"),
            (element) => element.textContent
        ).filter(listedebirsey => listedebirsey.includes(".jpg") !== true || listedebirsey.includes(".png") !== true)
    );
    console.log(titles);

    await browser.close();

    //exports.Array(list_baska_xml);

    //resolve the export promise
    return list_baska_xml;
    //return {dinlemelistesi:list_baska_xml};
    //return [{ id: 50254, title:"Ateş-i Aşk", isim: "emre",hediye:list_baska_xml }];
}

export function getirXML() {

    return getData();
    
}
function getData() {
    var parser = new xml2js.Parser();
    var data = '';
    var liste = [];
    return new Promise((resolve) => { //sonucu böyle döndürmezsek içirideki kodu beklemeden devam ediyor
        //https://stackoverflow.com/questions/34007206/how-to-parse-xml-from-url-with-node
        http.get("http://kardelendergisi.com/atesiask/baska.xml", async function (res) {
            if (res.statusCode >= 200 && res.statusCode < 400) {
                res.on('data', function (data_) { data += data_.toString(); });
                res.on('end', function () {
                    //console.log('data', data);
                    parser.parseString(data, function (err, result) {
                        //console.log('FINISHED', err, result);
                        var obje = result.ul.li[1];
                        //console.log('D: ',obje.$["data-title"]);
                        for (const item of result.ul.li) { // You can use `let` instead of `const` if you like
                            liste.push({ songUrl: item.$["data-path"], songName: item.$["data-title"], songPerson: item.$["data-duration"] });
                            //console.log(liste[liste.length-1]);
                        }
                        resolve(liste);
                    });
                });
            }

        }).on('error', function (e) {
            console.log("Got error: " + e.message);
            resolve("Got error");
        });
        
    });
}
