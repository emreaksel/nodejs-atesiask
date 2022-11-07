//const http = require('http')

/* Kendime Nasihat;

npm i nodemon
npm i express

manuel başlamak için node server.js
nodemon ile başlamak için npm start

mongodb bağlantısı için https://app.patika.dev/courses/nodejs/HerokuDeployment
mongodb atesiask P1GHu5R4tBpRDj9j
heroku da yayımlamak için https://www.youtube.com/watch?v=skGNRkosnQU&ab_channel=MertStack
*/

import express from 'express';
var app = express();
app.use(express.static(path.resolve() + '/public')); //css, js, images flasörlerini saklamak için
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//----------------
import bodyParser from 'body-parser';//req.body kullanıcı tarafından kontrol edilen girdiye dayandığından, bu nesnedeki tüm özellikler ve değerler güvenilir değildir ve güvenmeden önce doğrulanmalıdır.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//---------------
import { MongoClient } from 'mongodb'
const url = "mongodb+srv://atesiask:P1GHu5R4tBpRDj9j@cluster0.8x77kki.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(url);
/* async function main() {
    // Use connect method to connect to the server
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db("atesiask");
    const collection = db.collection('documents');

    const insertResult = await collection.insertMany([{ a: 1 }, { a: 2 }, { a: 3 }]);
    console.log('Inserted documents =>', insertResult);

    return 'done.';
}
main()
    .then(console.log)
    .catch(console.error)
    .finally(() => client.close()); */

import path from 'path';
import { foo, getirXML, getirNukte, getirFotograf_base64,getirFotograf } from './public/js/getir_xml.js'; //import * as x from './public/js/getir_xml.js'  her şeyi getir
//const __dirname = path.resolve();

const degiskenismi = { id: 50254, title: "Ateş-i Aşk", isim: "emre" };

app.set('view engine', 'ejs'); //home.ejs yazmak yerine tüm sayfalar ejs olarak oluşturulacak demek istiyor

app.get("/", async function (req, res) {
    //var dinlemelistesi=xml.map();
    //console.log(`Xml: ${xml.dinlemelistesi}`);

    var xml_listesi = await getirXML();
    var nukte_listesi = await getirNukte();
    var fotograf_listesi = await getirFotograf();
    //console.log("axel: ",xml_listesi);
    degiskenismi.xml_listesi = xml_listesi;
    degiskenismi.nukte_listesi = nukte_listesi;
    degiskenismi.fotograf_listesi = fotograf_listesi;
    res.render("atesiask", degiskenismi); //    ./sayfalar/home.ejs yapmıştım ama illa ki views klasörü istedi, kütüphane direkt views içine bakıyor
});
app.post("/", async function (req, res) {
    //console.log(req.body.resim);
    if (req.body.istek=="getir_fotograf") {
        var resimbase64 = await getirFotograf_base64(req.body.resim);
        res.send({ yanit: resimbase64 });
    }
    
});
app.get("/test", async function (req, res) {
    res.send("test page");
});
app.get("*", function (req, res) { //anlamsız talepler için
    res.send("sayfa bulunamadı");
});

const PORT = 9000;
var server = app.listen(process.env.PORT || PORT, function () {
    console.log(`Server is listening at localhost on port ${PORT}`);
});

