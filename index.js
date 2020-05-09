const express = require('express');
const app= express();
const port = process.env.PORT || "7000";

const bodyParser = require('body-parser');
const request = require("request-promise");
const cheerio= require("cheerio");
const fs = require("fs");
//



app.use(express.static(__dirname + '/public'));
//
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/mostrarnumeros', async (req, res) => {
  let ciudadR=req.body.ciudadR;
  let ciudadD=req.body.ciudadD;  
  let kilos=req.body.kilos;
  let unidades=req.body.unidades;
  let seguro=req.body.seguro;
  let recaudo=req.body.recaudo;

  let pagina='<!doctype html><html><head><link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous"></head><body>';



    try{

    
    const html = await request.post("https://www.aveonline.co/app/modulos/ofertadeservicio/?ver=1&idcampo=MjAxOTA3MjkxNTU4NTkxMTYzNS03OTU1Nzg4MQ==", {

    form: {
        dsciudad: ciudadR,
        dsciudadd: ciudadD,
        totalkilos: kilos,
        unidadesx: unidades,
        totalvalo: seguro,
        dsvalorrecaudo: recaudo,
        enviar: "CALCULAR",
        idcampo: "MjAxOTA3MjkxNTU4NTkxMTYzNS03OTU1Nzg4MQ==",
        ver: "1",
        dirOrigen: "call",
        dirDestino: "call"

    }

    });

    const $ = cheerio.load(html);
    const trayectotcc=$("#div2 > div.card.card-default > div > div > div > table.table.table-striped > tbody > tr:nth-child(4) > td:nth-child(2) > strong").text();
    var valor=$("#div2 > div > div > div > div > table.table.table-striped > tbody > tr:nth-child(3) > td:nth-child(6) > strong").text();
     valor=valor.replace("$",'');
     valor=(parseInt(valor.replace(".","")));
     
     if(valor==0){
        valor=0;
     }
     else if(valor<14000){
       valor=valor+500;
     }else{
       valor=valor+750;
     }
    const tiempotcc=$("#div2 > div.card.card-default > div > div > div > table.table.table-striped > tbody > tr:nth-child(5) > td:nth-child(2)").text();
    const trayectoenvia=$("#div2 > div.card.card-default > div > div > div > table.table.table-striped > tbody > tr:nth-child(4) > td:nth-child(7) > strong").text();
    var valorEnvia=$("#div2 > div > div > div > div > table.table.table-striped > tbody > tr:nth-child(3) > td:nth-child(11) > strong").text();
    valorEnvia=valorEnvia.replace("$","");
    valorEnvia=(parseInt(valorEnvia.replace(".","")));
    if(valorEnvia==0){
      valorEnvia=0;
   }
   else if(valorEnvia<14000){
     valorEnvia=valorEnvia+500;
   }else{
     valorEnvia=valorEnvia+750;
   }
    const tiempoenvia=$("#div2 > div.card.card-default > div > div > div > table.table.table-striped > tbody > tr:nth-child(5) > td:nth-child(3)").text();
    pagina += `<table class="table table-bordered">
    <thead>
      <tr>
        
    
        
       
        
      </tr>
    </thead>
    <tbody>
      <tr>
        
        <th colspan="3"  >TCC</th>
        
        <th colspan="3" >ENVIA</th>
        
        
        
      <tr>
        <td >TRAYECTO</td>
        <td>ENVIO</td>
        <td>TIEMPO DE ENTREGA</td>
        <td >TRAYECTO</td>
        <td>ENVIO</td>
        <td>TIEMPO DE ENTREGA</td>

      </tr>
      <tr>
        <td>${trayectotcc}</td>
        <td>${valor}</td>
        <td>${tiempotcc}</td>
        <td>${trayectoenvia}</td>
        <td>${valorEnvia}</td>
        <td>${tiempoenvia}</td>
        
      </tr>
    </tbody>
  </table>`;
    pagina+='</body></html>';
    

}catch(error){

    console.error(error);
}



res.send(pagina);

});








var server=app.listen(port, () => {
  console.log('Servidor web iniciado');
  });