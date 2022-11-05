//const http = require('http')

/* Kendime Nasihat;

npm i nodemon
npm i express

manuel başlamak için node server.js
nodemon ile başlamak için npm start

*/

import express from 'express';
var app = express();
import path from 'path';
import { foo, getirXML } from './public/js/getir_xml.js'; //import * as x from './public/js/getir_xml.js'  her şeyi getir
const __dirname = path.resolve();

const degiskenismi = { id: 50254, title: "Ateş-i Aşk", isim: "emre" };

app.set('view engine', 'ejs'); //home.ejs yazmak yerine tüm sayfalar ejs olarak oluşturulacak demek istiyor
app.use(express.static(__dirname + '/public')); //css, js, images flasörlerini saklamak için
//foo();
app.get("/", async function (req, res) {
    //var dinlemelistesi=xml.map();
    //console.log(`Xml: ${xml.dinlemelistesi}`);
    
    var xml_listesi=await getirXML();
    //console.log("axel: ",xml_listesi);
    degiskenismi.xml_listesi=xml_listesi;
    res.render("atesiask", degiskenismi); //    ./sayfalar/home.ejs yapmıştım ama illa ki views klasörü istedi, kütüphane direkt views içine bakıyor
});
app.get("/test", async function (req, res) {
    res.send("test page");
});
app.get("*", function (req, res) { //anlamsız talepler için
    res.send("sayfa bulunamadı");
});

const PORT = 9000;
var server = app.listen(process.env.PORT ||PORT, function () {
    console.log(`Server is listening at localhost on port ${PORT}`);
});

