const express = require('express');
const app= express();
const port = process.env.PORT || "8000";

const bodyParser = require('body-parser');
const request = require("request-promise");
const cheerio= require("cheerio");
const fs = require("fs");
//



app.use(express.static(__dirname + '/public'));
//
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/mostrarnumeros', async (req, res) => {
  let num1=req.body.numero1;
  let num2=req.body.numero2;  

  let pagina='<!doctype html><html><head></head><body>';



    try{

    
    const html = await request.post("https://www.aveonline.co/app/modulos/ofertadeservicio/?ver=1&idcampo=MjAxOTA3MjkxNTU4NTkxMTYzNS03OTU1Nzg4MQ==", {

    form: {
        dsciudad: num1,
        dsciudadd: num2,
        totalkilos: "1",
        unidadesx: "1",
        totalvalo: "3",
        dsvalorrecaudo: "0",
        enviar: "CALCULAR",
        idcampo: "MjAxOTA3MjkxNTU4NTkxMTYzNS03OTU1Nzg4MQ==",
        ver: "1",
        dirOrigen: "call",
        dirDestino: "call"

    }

    });

    const $ = cheerio.load(html);
    const valor=$("#div2 > div > div > div > div > table.table.table-striped > tbody > tr:nth-child(4) > td:nth-child(6) > strong").text();
    const valorenvia=$("#div2 > div.card.card-default > div > div > div > table.table.table-striped > tbody > tr:nth-child(4) > td:nth-child(11)");
    pagina += `<a>precio envio TCC: "${valor}"</a>
    <a>precio ENVIA: "${valorenvia}"</a></body></html>`;
    

}catch(error){

    console.error(error);
}



res.send(pagina);

});






var server=app.listen(port, () => {
  console.log('Servidor web iniciado');
  });