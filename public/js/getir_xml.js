import puppeteer from 'puppeteer';
import xml2js from 'xml2js'; //xml ayıklamak için
import http from 'http';
import jsdom from 'jsdom'; //başsız bir tarayıcı gibi davranır bununla string bir ifadeyi html yapıp ayıklayacağım
import base64Img from 'base64-img';

export async function foo() {
    var url = 'http://kardelendergisi.com/atesiask/atesiask/20220501_113352.jpg';
    return new Promise((resolve) => { //sonucu böyle döndürmezsek içirideki kodu beklemeden devam ediyor
        base64Img.requestBase64(url, function (err, res, body) {
            if (err) console.log(err)
            else {
                //console.log(res)
                //console.log(body)  
                resolve("rarar");
            }
        });
    });
}
export function getirXML() {
    return getData_Xml();
}
export function getirNukte() {
    return getData_Nukte();
}
export function getirFotograf() {
    return getData_Fotograf();
}
export function getirFotograf_base64(url) {
    //console.log(getData_Fotograf_base64());
    return getData_Fotograf_base64(url);
}
//========================================
function getData_Xml() {
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
function getData_Nukte() {
    var parser = new xml2js.Parser();
    var data = '';
    var liste = [];
    return new Promise((resolve) => { //sonucu böyle döndürmezsek içirideki kodu beklemeden devam ediyor
        http.get("http://kardelendergisi.com/atesiask/quotes.txt", async function (res) {
            if (res.statusCode >= 200 && res.statusCode < 400) {
                res.on('data', function (data_) { data += data_.toString(); });
                res.on('end', function () {
                    //console.log('data', data.split("\r").length,data.split("\r")[data.split("\r").length-1]);
                    resolve(data.split("\r"));
                });
            }

        }).on('error', function (e) {
            console.log("Got error: " + e.message);
            resolve("Got error");
        });

    });
}
function getData_Fotograf() {
    var parser = new xml2js.Parser();
    var data = '';
    var liste = [];
    return new Promise((resolve) => { //sonucu böyle döndürmezsek içirideki kodu beklemeden devam ediyor
        http.get("http://kardelendergisi.com/atesiask/atesiask/index.php", async function (res) {
            if (res.statusCode >= 200 && res.statusCode < 400) {
                res.on('data', function (data_) { data += data_.toString(); });
                res.on('end', function () {
                    const { JSDOM } = jsdom;
                    const dom = new JSDOM(data);
                    //console.log(dom.window.document.querySelectorAll("img").length); 
                    var g_img = dom.window.document.querySelectorAll("img");
                    for (const item of g_img) {
                        if (item.src.includes(".jpg") || item.src.includes(".png")) liste.push(`http://kardelendergisi.com/atesiask/atesiask/${item.src}`);
                    }
                    //console.log(liste, liste.length)
                    resolve(liste);

                });
            }

        }).on('error', function (e) {
            console.log("Got error: " + e.message);
            resolve("Got error");
        });

    });
}
function getData_Fotograf_base64(url) {
    //var url = 'http://kardelendergisi.com/atesiask/atesiask/20220501_113352.jpg';
    return new Promise((resolve) => { //sonucu böyle döndürmezsek içirideki kodu beklemeden devam ediyor
        base64Img.requestBase64(url, function (err, res, body) {
            if (err) console.log(err)
            else {
                //console.log(res)
                //console.log(body)  
                resolve(body);
            }
        });
        //resolve(url);
    });
}