const express = require('express');
const app = express();
const port = process.env.PORT || "6200";

const bodyParser = require('body-parser');
const request = require("request-promise");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");
const fs = require("fs");
const url = "https://www.aveonline.co/principales/servicios/validate_login.php?token=25b3600e68aa847a6cd9dd5601a73f1c";
const url2 = "https://www.aveonline.co/principales/servicios.php";
const url3 = "https://www.aveonline.co/app/modulos/administrador/default.php";

app.use(express.static(__dirname + '/public'));
//
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/codigo', async (req, res) => {
  

});

app.post('/mostrarnumeros', async (req, res) => {
  var ciudadR = req.body.ciudadR;
  var ciudadRLetra = ciudadR.replace(/[0-9|]/gi, '');
  var ciudadRNumero = ciudadR.replace(/[a-z|()]/gi, '');

  var ciudadD = req.body.ciudadD;
  var ciudadDLetra = ciudadD.replace(/[0-9|]/gi, '');
  var ciudadDNumero = ciudadD.replace(/[a-z|()]/gi, '');
  let kilos = req.body.kilos;
  let unidades = req.body.unidades;
  let seguro = req.body.seguro;
  var recaudo = req.body.recaudo;


  let pagina = '<!doctype html><html><head><link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous"></head><body>';



  try {


    const html = await request.post("https://www.aveonline.co/app/modulos/ofertadeservicio/?ver=1&idcampo=MjAxOTA3MjkxNTU4NTkxMTYzNS03OTU1Nzg4MQ==", {

      form: {
        dsciudad: ciudadRLetra,
        dsciudadd: ciudadDLetra,
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
    var trayectotcc = $("#div2 > div.card.card-default > div > div > div > table.table.table-striped > tbody > tr:nth-child(4) > td:nth-child(2) > strong").text();
    trayectotcc = trayectotcc.replace(" ", "");
    var valorTCC = $("#div2 > div > div > div > div > table.table.table-striped > tbody > tr:nth-child(3) > td:nth-child(3) > strong").text();
    valorTCC = valorTCC.replace("$", '');
    valorTCC = (parseInt(valorTCC.replace(".", "")));

    if (valorTCC == 0) {
      var desactivarBoton = 'disabled="true"';
    } else {
      var desactivarBoton = '';
    }
    var seguroTCC = $("#div2 > div > div > div > div > table.table.table-striped > tbody > tr:nth-child(3) > td:nth-child(4) > strong").text();
    seguroTCC = seguroTCC.replace("$", '');
    seguroTCC = (parseInt(seguroTCC.replace(".", "")));

    var comisionRecaudo = $("#div2 > div > div > div > div > table.table.table-striped > tbody > tr:nth-child(3) > td:nth-child(5) > strong").text();
    comisionRecaudo = comisionRecaudo.replace("$", '');
    comisionRecaudo = (parseInt(comisionRecaudo.replace(".", "")));
    /*if (trayectotcc == "urbano") {
      var comisionRecaudo = parseInt((recaudo - valorTCC -seguroTCC) * 0.03);
      if (comisionRecaudo <= 3100) {
        comisionRecaudo = 3100;
      }

    } else {
      var comisionRecaudo = parseInt((recaudo - valorTCC -seguroTCC) * 0.03);
      if (comisionRecaudo <= 3600) {
        comisionRecaudo = 3600;
      }
    }

  */




    var valor = valorTCC + seguroTCC + comisionRecaudo;
    if (valor == 0) {
      valor = 0;
    }
    else if (valor < 14000) {
      valor = valor + 500;
    } else {
      valor = valor + 750;
    }
    var tiempotcc = $("#div2 > div.card.card-default > div > div > div > table.table.table-striped > tbody > tr:nth-child(5) > td:nth-child(2)").text();
    tiempotcc = tiempotcc.replace("d", "");




    var trayectoenvia = $("#div2 > div.card.card-default > div > div > div > table.table.table-striped > tbody > tr:nth-child(4) > td:nth-child(7) > strong").text();

    var envioEnvia = $("#div2 > div.card.card-default > div > div > div > table.table.table-striped > tbody > tr:nth-child(3) > td:nth-child(8) > strong").text();
    envioEnvia = envioEnvia.replace("$", "");
    envioEnvia = (parseInt(envioEnvia.replace(".", "")));
    if (envioEnvia == 0) {
      var DesactivarBotonEnvia = 'disabled="true"';
    } else {
      var DesactivarBotonEnvia = '';
    }

    var seguroEnvia = $("#div2 > div > div > div > div > table.table.table-striped > tbody > tr:nth-child(3) > td:nth-child(9) > strong").text();
    seguroEnvia = seguroEnvia.replace("$", "");
    seguroEnvia = (parseInt(seguroEnvia.replace(".", "")));

    var comisionRecaudoEnvia = $("#div2 > div > div > div > div > table.table.table-striped > tbody > tr:nth-child(3) > td:nth-child(10) > strong").text();
    comisionRecaudoEnvia = comisionRecaudoEnvia.replace("$", "");
    comisionRecaudoEnvia = (parseInt(comisionRecaudoEnvia.replace(".", "")));
    /*if ( (recaudo - envioEnvia - seguroEnvia) <= 100000) {
      var comisionRecaudoEnvia = parseInt((recaudo - envioEnvia - seguroEnvia) * 0.039);
    }
    if ((recaudo - envioEnvia - seguroEnvia) > 100001 && (recaudo - envioEnvia - seguroEnvia) < 200000) {
      var comisionRecaudoEnvia = parseInt((recaudo - envioEnvia - seguroEnvia) * 0.037);
    }
    if ((recaudo - envioEnvia - seguroEnvia) > 200001 && (recaudo - envioEnvia - seguroEnvia) < 500000) {
      var comisionRecaudoEnvia = parseInt((recaudo - envioEnvia - seguroEnvia)* 0.035);
    }
    if ((recaudo - envioEnvia - seguroEnvia) > 500001 && (recaudo - envioEnvia - seguroEnvia) < 800000) {
      var comisionRecaudoEnvia = parseInt((recaudo - envioEnvia - seguroEnvia)* 0.032);
    }
    if ((recaudo - envioEnvia - seguroEnvia) > 800001 && (recaudo - envioEnvia - seguroEnvia) < 1475000) {
      var comisionRecaudoEnvia = parseInt((recaudo - envioEnvia - seguroEnvia)* 0.029);
    }
*/

    if (trayectoenvia == "urbano") {
      if (comisionRecaudoEnvia < 3500) {
        comisionRecaudoEnvia = 3500;
      }
    } else {

      if (comisionRecaudoEnvia < 4000) {
        comisionRecaudoEnvia = 4000;
      }
    }








    var valorEnvia = comisionRecaudoEnvia + seguroEnvia + envioEnvia;

    if (valorEnvia == 0) {
      valorEnvia = 0;
    }
    else if (valorEnvia < 14000) {
      valorEnvia = valorEnvia + 500;
    } else {
      valorEnvia = valorEnvia + 750;
    }
    var tiempoenvia = $("#div2 > div.card.card-default > div > div > div > table.table.table-striped > tbody > tr:nth-child(5) > td:nth-child(3)").text();
    tiempoenvia = tiempoenvia.replace("d", "");
    pagina += `
    
    
  
  
    <table class="table table-bordered">
    <thead>
      <tr>
        
    
        
       
        
      </tr>
    </thead>
    <tbody>
      <tr>
        
        <th colspan="7"  >TCC</th>
        
        <th colspan="7" >ENVIA</th>
        
        
        
      <tr>
        <td >TRAYECTO</td>
        <!--
        <td>FLETE</td>
        <td>MANEJO</td>
        <td>COMISIÓN</td>
        <td>HEKA</td>
        -->
        <td>ENVÍO</td>
        <td>TIEMPO DE ENTREGA</td>

        <td >TRAYECTO</td>
        <!--
        <td>FLETE</td>
        <td>MANEJO</td>
        <td>COMISIÓN</td>
        <td>HEKA</td>
        -->
        <td>ENVÍO</td>
        <td>TIEMPO DE ENTREGA</td>
       

      </tr>
      <tr>
        <td>${trayectotcc}</td>
        <!--
        <td>${valorTCC}</td>
        <td>${seguroTCC}</td>
        <td>${comisionRecaudo}</td>
        <td>prueba</td>
        -->
        <td>${valor}</td>
        <td>${tiempotcc + " Día(s)"}</td>
        
        <td>${trayectoenvia}</td>
        <!--
        <td>${envioEnvia}</td>
        <td>${seguroEnvia}</td>
        <td>${comisionRecaudoEnvia}</td>
        <td>prueba</td>
        -->N
        <td>${valorEnvia}</td>
        <td>${tiempoenvia + " Día(s)"}</td>
        
      </tr>

      <tr>
      <td></td>
      
    </tr>

    </tbody>
  </table>


  <form action="listarGuiaEnvia" method="post">
  <div class="form-row">
    

  
    <input   value="${ciudadRLetra}" type="hidden" class="form-control" name="ciudadRLetra" required>

    <input   value="${ciudadRNumero}" type="hidden" class="form-control" name="ciudadRNumero" required>
    <input   value="${ciudadDNumero}" type="hidden" class="form-control" name="ciudadDNumero" required>
    <input   value="${tiempoenvia}" type="hidden" class="form-control" name="tiempoEnvia" required>
    <input   value="${seguroEnvia}" type="hidden" class="form-control" name="seguroEnvia" required>
    <input   value="${comisionRecaudoEnvia}" type="hidden" class="form-control" name="comisionRecaudoEnvia" required>
    <input   value="${envioEnvia}" type="hidden" class="form-control" name="envioEnvia" required>
    <input   value="${trayectoenvia}" type="hidden" class="form-control" name="trayectoenvia" required>
    <input   value="${ciudadDLetra}" type="hidden" class="form-control" name="ciudadDLetra" required>
    <input   value="${kilos}" type="hidden" class="form-control" name="kilos" required>
    <input  value="${unidades}" type="hidden" class="form-control" name="unidades" required>
    <input value="${seguro}" type="hidden" class="form-control" name="seguro" required>
     <input value="${recaudo}" type="hidden" class="form-control" name="recaudo" required>
 
      <button  ${DesactivarBotonEnvia} class="btn btn-primary" type="submit">Crear guía ENVIA</button>
  </form>
  </div>



  <form action="listarGuiaTcc" method="post">
  <div class="form-row">
    

  
    <input   value="${ciudadRLetra}" type="hidden" class="form-control" name="ciudadRLetra" required>

    <input   value="${ciudadRNumero}" type="hidden" class="form-control" name="ciudadRNumero" required>
    <input   value="${ciudadDNumero}" type="hidden" class="form-control" name="ciudadDNumero" required>
    <input   value="${tiempotcc}" type="hidden" class="form-control" name="tiempoEnvia" required>
    <input   value="${seguroTCC}" type="hidden" class="form-control" name="seguroEnvia" required>
    <input   value="${comisionRecaudo}" type="hidden" class="form-control" name="comisionRecaudoEnvia" required>
    <input   value="${valorTCC}" type="hidden" class="form-control" name="envioEnvia" required>
    <input   value="${trayectotcc}" type="hidden" class="form-control" name="trayectoenvia" required>
     <input   value="${ciudadDLetra}" type="hidden" class="form-control" name="ciudadDLetra" required>
    <input   value="${kilos}" type="hidden" class="form-control" name="kilos" required>
    <input  value="${unidades}" type="hidden" class="form-control" name="unidades" required>
    <input value="${seguro}" type="hidden" class="form-control" name="seguro" required>
     <input value="${recaudo}" type="hidden" class="form-control" name="recaudo" required>
 

     <div class="form-row">
      <button ${desactivarBoton} class="btn btn-danger" type="submit">Crear guía TCC</button>
      </div>
  </form>
  </div>
  
  `;
    pagina += '</body></html>';


  } catch (error) {

    console.error(error);
  }


  res.send(pagina);


});


app.post('/listarGuiaEnvia', async (req, res) => {
  var ciudadR = req.body.ciudadRLetra;
  var codigoR = req.body.ciudadRNumero;
  var ciudadD = req.body.ciudadDLetra;
  var codigoD = req.body.ciudadDNumero;
  var kilos = req.body.kilos;
  var unidades = req.body.unidades;
  var seguro = req.body.seguro;
  var recaudo = req.body.recaudo;
  //var contenido = req.body.contenido;
  //var nomRem = req.body.nomRem;
  //var celRem = req.body.celRem;
  //var dirRem = req.body.dirRem;
  //var nomDes = req.body.nomDes;
  //var celDes = req.body.celDes;
  //var dirDes = req.body.dirDes;
  var tiempoenvia = req.body.tiempoEnvia;
  var seguroEnvia = req.body.seguroEnvia;
  var comisionRecaudoEnvia = req.body.comisionRecaudoEnvia;
  var envioEnvia = req.body.envioEnvia;
  var trayectoenvia = req.body.trayectoenvia;

  let pagina = `<!doctype html><html><head><link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous"></head><body>`;
  pagina += ` <form action="crearguiaEnvia" method="post">
  <div class="form-row">
    

  <div class="col-md-4 mb-3">
  <label for="validationDefault02">CIUDAD REMITENTE</label>
    <input readonly="readonly"  value="${ciudadR}" type="text" class="form-control" name="ciudadRLetra" required>
</div>

    <input   value="${codigoR}" type="hidden" class="form-control" name="ciudadRNumero" required>
    <input   value="${codigoD}" type="hidden" class="form-control" name="ciudadDNumero" required>
    
    <div class="col-md-4 mb-3">
    <label for="validationDefault02">CIUDAD DESTINATARIO</label>
    <input  readonly="readonly" value="${ciudadD}" type="text" class="form-control" name="ciudadDLetra" required>
    </div>

    <input   value="${tiempoenvia}" type="hidden" class="form-control" name="tiempoEnvia" required>
    
    
    <input   value="${seguroEnvia}" type="hidden" class="form-control" name="seguroEnvia" required>
    
    
    <input   value="${comisionRecaudoEnvia}" type="hidden" class="form-control" name="comisionRecaudoEnvia" required>
    <input   value="${envioEnvia}" type="hidden" class="form-control" name="envioEnvia" required>
    <input   value="${trayectoenvia}" type="hidden" class="form-control" name="trayectoenvia" required>
    
    
    <div class="col-md-4 mb-3">
    <label for="validationDefault02">Kilos</label>
    <input  readonly="readonly" value="${kilos}" type="text" class="form-control" name="kilos" required>
    </div>
   
    <div class="col-md-4 mb-3">
    <label for="validationDefault02">UNIDADES</label>
    <input readonly="readonly" value="${unidades}" type="text" class="form-control" name="unidades" required>
    </div>

    <div class="col-md-4 mb-3">
    <label for="validationDefault02">Seguro mercancía</label>
    <input readonly="readonly" value="${seguro}" type="text" class="form-control" name="seguro" required>
    </div> 

    <div class="col-md-4 mb-3">
    <label for="validationDefault02">Valor a recaudar</label>
    <input readonly="readonly" value="${recaudo}" type="text" class="form-control" name="recaudo" required>
    </div>

    <div class="col-md-4 mb-3">
    <label for="validationDefault02">Contenido</label>
    <input  type="text" class="form-control" name="contenido" required>
    </div>

    <div class="col-md-4 mb-3">
    <label for="validationDefault02">Nombre remitente</label>
    <input  type="text" class="form-control" name="nomRem" required>
    </div>

    <div class="col-md-4 mb-3">
    <label for="validationDefault02">Dirección remitente</label>
    <input  type="text" class="form-control" name="dirRem" required>
    </div>

    <div class="col-md-4 mb-3">
    <label for="validationDefault02">Celular remitente</label>
    <input  type="number" class="form-control" name="celRem" required>
    </div>

    <div class="col-md-4 mb-3">
    <label for="validationDefault02">Nombre destinatario</label>
    <input  type="text" class="form-control" name="nomDes" required>
    </div>

    <div class="col-md-4 mb-3">
    <label for="validationDefault02">Dirección destinatario</label>
    <input  type="text" class="form-control" name="dirDes" required>
    </div>

    <div class="col-md-4 mb-3">
    <label for="validationDefault02">Celular destinatario</label>
    <input  type="number" class="form-control" name="celDes" required>
    </div>



     
      <button class="btn btn-primary" type="submit">Crear guía ENVIA</button>
      
  </form>
  </div>
  
  `;

  pagina += '</body></html>';

  res.send(pagina);

});

app.post('/listarGuiaTcc', async (req, res) => {
  var ciudadR = req.body.ciudadRLetra;
  var codigoR = req.body.ciudadRNumero;
  var ciudadD = req.body.ciudadDLetra;
  var codigoD = req.body.ciudadDNumero;
  var kilos = req.body.kilos;
  var unidades = req.body.unidades;
  var seguro = req.body.seguro;
  var recaudo = req.body.recaudo;
  //var contenido = req.body.contenido;
  //var nomRem = req.body.nomRem;
  //var celRem = req.body.celRem;
  //var dirRem = req.body.dirRem;
  //var nomDes = req.body.nomDes;
  //var celDes = req.body.celDes;
  //var dirDes = req.body.dirDes;
  var tiempoenvia = req.body.tiempoEnvia;
  var seguroEnvia = req.body.seguroEnvia;
  var comisionRecaudoEnvia = req.body.comisionRecaudoEnvia;
  var envioEnvia = req.body.envioEnvia;
  var trayectoenvia = req.body.trayectoenvia;

  let pagina = `<!doctype html><html><head><link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous"></head><body>`;
  pagina += ` <form action="crearguiaTCC" method="post">
  <div class="form-row">
    

  <div class="col-md-4 mb-3">
  <label for="validationDefault02">CIUDAD REMITENTE</label>
    <input readonly="readonly"  value="${ciudadR}" type="text" class="form-control" name="ciudadRLetra" required>
</div>

    <input   value="${codigoR}" type="hidden" class="form-control" name="ciudadRNumero" required>
    <input   value="${codigoD}" type="hidden" class="form-control" name="ciudadDNumero" required>
    
    <div class="col-md-4 mb-3">
    <label for="validationDefault02">CIUDAD DESTINATARIO</label>
    <input  readonly="readonly" value="${ciudadD}" type="text" class="form-control" name="ciudadDLetra" required>
    </div>

    <input   value="${tiempoenvia}" type="hidden" class="form-control" name="tiempoEnvia" required>
    
    
    <input   value="${seguroEnvia}" type="hidden" class="form-control" name="seguroEnvia" required>
    
    
    <input   value="${comisionRecaudoEnvia}" type="hidden" class="form-control" name="comisionRecaudoEnvia" required>
    <input   value="${envioEnvia}" type="hidden" class="form-control" name="envioEnvia" required>
    <input   value="${trayectoenvia}" type="hidden" class="form-control" name="trayectoenvia" required>
    
    
    <div class="col-md-4 mb-3">
    <label for="validationDefault02">Kilos</label>
    <input  readonly="readonly" value="${kilos}" type="text" class="form-control" name="kilos" required>
    </div>
   
    <div class="col-md-4 mb-3">
    <label for="validationDefault02">UNIDADES</label>
    <input readonly="readonly" value="${unidades}" type="text" class="form-control" name="unidades" required>
    </div>

    <div class="col-md-4 mb-3">
    <label for="validationDefault02">Seguro mercancía</label>
    <input readonly="readonly" value="${seguro}" type="text" class="form-control" name="seguro" required>
    </div> 

    <div class="col-md-4 mb-3">
    <label for="validationDefault02">Valor a recaudar</label>
    <input readonly="readonly" value="${recaudo}" type="text" class="form-control" name="recaudo" required>
    </div>

    <div class="col-md-4 mb-3">
    <label for="validationDefault02">Contenido</label>
    <input  type="text" class="form-control" name="contenido" required>
    </div>

    <div class="col-md-4 mb-3">
    <label for="validationDefault02">Nombre remitente</label>
    <input  type="text" class="form-control" name="nomRem" required>
    </div>

    <div class="col-md-4 mb-3">
    <label for="validationDefault02">Dirección remitente</label>
    <input  type="text" class="form-control" name="dirRem" required>
    </div>

    <div class="col-md-4 mb-3">
    <label for="validationDefault02">Celular remitente</label>
    <input  type="number" class="form-control" name="celRem" required>
    </div>

    <div class="col-md-4 mb-3">
    <label for="validationDefault02">Nombre destinatario</label>
    <input  type="text" class="form-control" name="nomDes" required>
    </div>

    <div class="col-md-4 mb-3">
    <label for="validationDefault02">Dirección destinatario</label>
    <input  type="text" class="form-control" name="dirDes" required>
    </div>

    <div class="col-md-4 mb-3">
    <label for="validationDefault02">Celular destinatario</label>
    <input  type="number" class="form-control" name="celDes" required>
    </div>



     
      <button class="btn btn-danger" type="submit">Crear guía TCC</button>
      
  </form>
  </div>
  
  `;

  pagina += '</body></html>';

  res.send(pagina);

});



app.post('/crearguiaEnvia', async (req, res) => {

  var ciudadR = req.body.ciudadRLetra;
  var codigoR = req.body.ciudadRNumero;
  var ciudadD = req.body.ciudadDLetra;
  var codigoD = req.body.ciudadDNumero;
  var kilos = req.body.kilos;
  var unidades = req.body.unidades;
  var seguro = req.body.seguro;
  var recaudo = req.body.recaudo;
  var contenido = req.body.contenido;
  var nomRem = req.body.nomRem;
  var celRem = req.body.celRem;
  var dirRem = req.body.dirRem;
  var nomDes = req.body.nomDes;
  var celDes = req.body.celDes;
  var dirDes = req.body.dirDes;
  var tiempoenvia = req.body.tiempoEnvia;
  var seguroEnvia = req.body.seguroEnvia;
  var comisionRecaudoEnvia = req.body.comisionRecaudoEnvia;
  var envioEnvia = req.body.envioEnvia;
  var trayectoenvia = req.body.trayectoenvia;

  //res.send(ciudadR+""+codigoR+""+""+ciudadD+""+codigoD+kilos+unidades+seguro+recaudo+contenido+nomRem+celRem+dirRem+nomDes+celDes+dirDes+tiempoenvia+seguroEnvia+comisionRecaudoEnvia+envioEnvia+trayectoenvia);



  if (kilos > 8) {
    var dsfactor = 400;
    var tipoenvio = "Paqueteria";
  } else {
    var dsfactor = 222;
    var tipoenvio = "Mensajeria";
  }

  var calculo = (0.03 * 0.03 * 0.03) * dsfactor;


  const rpta = request.post("https://www.aveonline.co/app/modulos/coretransporte/guardar.guia.php?mensajeg=1", {
    form: {

      dstipoenvioave: "1",
      idagente: "2422",
      idempresa: "11635",
      idpais: "2",
      dsciudad: ciudadR + "",
      idciudad: codigoR + "",
      //puntoo: 
      idpaisdestino: "2",
      dsciudadd: ciudadD + "",
      idciudadd: codigoD + "",
      //punto: 
      //guardarx: 
      unidadesx: "1",
      totalkilos: kilos + "",
      idaltobase: "3",
      idanchobase: "3",
      idlargobase: "3",
      totalvalo: seguro + "",
      dscontenido: contenido + "",
      //dsnumfactura: 
      //dsvalor_pedido: 
      //dsnum_bolsa: 
      idsercontraentrega: "1",
      dsvalorrecaudo: recaudo,
      guardarx: "1",
      idempresa: "11635",
      //rangoinicial: 
      //idtransportadoraax: 
      //dsfechasini: 
      //factura: 
      //pkid: 
      //tiemporeal: "2 Día(s)",
      sel_transporte: "on",
      tiemporeal: tiempoenvia + " Día(s)",
      dsnit: "2422",
      dsnombre: " HEKA - " + nomRem,
      dsdir: dirRem + "",
      //dscorreop: 
      dstel: "/-" + celRem,
      dscelular: "",
      //dsbarrioo: 
      dsnombrecompleto: nomDes + "",
      //dsnitre: 
      //dscelularre: 
      dstelre: "/-" + celDes,
      //dsbarrio: 
      //dscorreopre: 
      dsdirre: dirDes + "",
      //dsfecha_vencimiento: 
      //dsfecha_cita: 
      //dscodigo_cita: 
      //dsorden_compra: 
      //idreferencias: 
      //dsganador: 
      //dscom: 
      idvalor_tranporte: envioEnvia,
      idporvaloracion: seguroEnvia,
      idvalortotalguia: envioEnvia + seguroEnvia,
      //dsconsec: 
      dsfactor: dsfactor + "",
      kilosvol: kilos + "",
      tiempoent: tiempoenvia + " Día(s)",
      idtransportador: "29",
      idservicio: "29",
      //servicio: 
      unidadesxx: unidades + "",
      totalkilosx: kilos + "",
      //idtotalvolumenx: 
      dstransportadora: "ENVIA",
      idtransportadora: "29",
      totalvalox: seguro,
      dscontenidox: contenido,
      flete: envioEnvia,
      //ciudadorigenbase: 
      //dsciudadorigenbase: 
      //dscodigodestinolargox: "76001000",
      dstipoenvio: tipoenvio,
      tiempoents: "29",
      dstipotrayecto: trayectoenvia + "",
      dskilosliquidados: kilos + "",
      dscontraentrega: "0",
      dscostorecaudo: comisionRecaudoEnvia + "",
      codigoserviciorecaudo: "1",
      //serviciorecaudo: "MENSAJERIA EXPRESA",
      resultadocalculo: calculo + "",
      valortransrecaudo: recaudo + "",
      guiaasignada: "0",
      //cortesia: 
    }


  });

  var html = `<!DOCTYPE html>
  <html>
  <head>
    <title>Formulario</title>
  
  
  
     
   
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
    <script src="https://code.jquery.com/jquery-3.4.1.slim.min.js" integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n" crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
  <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>
  
  </head>
  <body>
  
  
      <a>Crear guia</a>
      <button class="btn btn-primary" type="submit">cotizar envío</button>
  
   
  
  
  
  
  
  
  
    
    
  
  
  
  
  </form>
  </body>
</html>
  `;

  res.send(html);
});

app.post('/crearguiaTCC', async (req, res) => {

  var ciudadR = req.body.ciudadRLetra;
  var codigoR = req.body.ciudadRNumero;
  var ciudadD = req.body.ciudadDLetra;
  var codigoD = req.body.ciudadDNumero;
  var kilos = req.body.kilos;
  var unidades = req.body.unidades;
  var seguro = req.body.seguro;
  var recaudo = req.body.recaudo;
  var contenido = req.body.contenido;
  var nomRem = req.body.nomRem;
  var celRem = req.body.celRem;
  var dirRem = req.body.dirRem;
  var nomDes = req.body.nomDes;
  var celDes = req.body.celDes;
  var dirDes = req.body.dirDes;
  var tiempoenvia = req.body.tiempoEnvia;
  var seguroEnvia = req.body.seguroEnvia;
  var comisionRecaudoEnvia = req.body.comisionRecaudoEnvia;
  var envioEnvia = req.body.envioEnvia;
  var trayectoenvia = req.body.trayectoenvia;

  //res.send(ciudadR+""+codigoR+""+""+ciudadD+""+codigoD+kilos+unidades+seguro+recaudo+contenido+nomRem+celRem+dirRem+nomDes+celDes+dirDes+tiempoenvia+seguroEnvia+comisionRecaudoEnvia+envioEnvia+trayectoenvia);



  if (kilos >= 6) {

    var tipoenvio = "Paqueteria";
  } else {

    var tipoenvio = "Mensajeria";
  }

  var dsfactor = 400;

  var calculo = (0.03 * 0.03 * 0.03) * dsfactor;


  const rpta = request.post("https://www.aveonline.co/app/modulos/coretransporte/guardar.guia.php?mensajeg=1", {
    form: {

      dstipoenvioave: "1",
      idagente: "2422",
      idempresa: "11635",
      idpais: "2",
      dsciudad: ciudadR,
      idciudad: codigoR,
      //puntoo: 
      idpaisdestino: "2",
      dsciudadd: ciudadD,
      idciudadd: codigoD,
      //punto: 
      //guardarx: 
      unidadesx: unidades,
      totalkilos: kilos,
      idaltobase: "3",
      idanchobase: "3",
      idlargobase: "3",
      totalvalo: seguro,
      dscontenido: contenido,
      //dsnumfactura: 
      //dsvalor_pedido: 
      dsnum_bolsa: ".",
      idsercontraentrega: "1",
      dsvalorrecaudo: recaudo,
      guardarx: "1",
      //rangoinicial: 
      //idtransportadoraax: 
      //dsfechasini: 
      //factura: 
      //pkid: 
      sel_transporte: "on",
      tiemporeal: tiempoenvia + " Día(s)",
      tiemporeal: tiempoenvia + " Día(s)",
      dsnit: "2422",
      dsnombre: " HEKA - " + nomRem,
      dsdir: dirRem,
      //dscorreop: 
      dstel: celRem,
      dscelular: celRem,
      //dsbarrioo:
      dsnombrecompleto: nomDes,
      //dsnitre: 
      //dscelularre: 
      dstelre: "/-" + celDes,
      //dsbarrio: 
      //dscorreopre: 
      dsdirre: dirDes,
      //dsfecha_vencimiento: 
      //dsfecha_cita: 
      //dscodigo_cita: 
      //dsorden_compra: 
      //idreferencias: 
      //dsganador: 
      //dscom: 
      idvalor_tranporte: envioEnvia,
      idporvaloracion: seguroEnvia,
      idvalortotalguia: envioEnvia + seguroEnvia,
      //dsconsec: 
      dsfactor: dsfactor,
      kilosvol: kilos,
      tiempoent: tiempoenvia + " Día(s)",
      idtransportador: "1010",
      idservicio: "1010",
      //servicio: 
      unidadesxx: unidades,
      totalkilosx: kilos,
      //idtotalvolumenx: 
      dstransportadora: "TCC SA",
      idtransportadora: "1010",
      totalvalox: seguro,
      dscontenidox: contenido,
      flete: envioEnvia,
      //ciudadorigenbase: 
      //dsciudadorigenbase: 
      //dscodigodestinolargox: "11001000",
      dstipoenvio: tipoenvio,
      tiempoents: "1010",
      dstipotrayecto: trayectoenvia,
      dskilosliquidados: kilos,
      dscontraentrega: "0",
      dscostorecaudo: comisionRecaudoEnvia,
      codigoserviciorecaudo: "1",
      serviciorecaudo: "MENSAJERIA EXPRESAY PAQUETERIA",
      resultadocalculo: calculo,
      valortransrecaudo: recaudo,
      guiaasignada: "0",
      //cortesia: 
    }


  });

  var html = `<!DOCTYPE html>
  <html>
  <head>
    <title>Formulario</title>
  
  
  
     
   
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
    <script src="https://code.jquery.com/jquery-3.4.1.slim.min.js" integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n" crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
  <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>
  
  </head>
  <body>
  
  
      <a>Guía creada</a>
      <button class="btn btn-primary" type="submit">cotizar envío</button>
  
   
  
  
  
  
  
  
  
    
    
  
  
  
  
  </form>
  </body>
</html>
  `;


  res.send("envio");
});


app.post('/estadoGuias', async (req, res) => {
  var nombre=req.body.nombre;
  if(nombre=="Natalia Mendoza"){
    var codigo=0001;
  }
  if(nombre=="Natalia Mendoza TV"){
    var codigo="0002";
  }
  if(nombre=="Jhon Alexander Pachon"){
    var codigo="0003";
  }
  if(nombre=="Kelly Jaimes"){
    var codigo="0004";
  }
  if(nombre=="Yidy Caterine"){
    var codigo="0005";
  }
  if(nombre=="Nathaly Alvarez"){
    var codigo="0006";
  }
  if(nombre=="Juan Pablo Molero"){
    var codigo="0007";
  }
  if(nombre=="Yesika Viviana Perez"){
    var codigo="0008";
  }
  if(nombre=="Daniel benitez"){
    var codigo="0009";
  }
  if(nombre=="Ximena Cobos"){
    var codigo="0010";
  }
  if(nombre=="Diana Gomez"){
    var codigo="0011";
  }
  if(nombre=="Lina Jaimes"){
    var codigo="0012";
  }
  if(nombre=="Evelin Rodriguez"){
    var codigo="0013";
  }
  var opcion=req.body.opcion;
  let pagina = '<!doctype html><html><head><link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous"></head><body>';
  var numGuia;
  var href;

  pagina += `<table class="table">

  <thead class="thead-dark">
    <tr>
      <th scope="col">#</th>
      <th scope="col">Guía</th>
      <th scope="col">Fecha creación</th>
      <th scope="col">Destinatario</th>
      <th scope="col">Ciudad Rem</th>
      <th scope="col">Ciudad Des</th>
      <th scope="col">Transportadora</th>
      <th scope="col">Costo Envío</th>
      <th scope="col">Recaudo</th>
      <th scope="col">Estado</th>
      <th scope="col">Fecha estado</th>
      <th scope="col">Guia</th>
      <th scope="col">Rotulo</th>
      <th scope="col">Ver estado</th>
    </tr>
  </thead>
  <tbody>
  `;
  const html1 = await request.post("https://www.aveonline.co/principales/servicios/validate_login.php?token=25b3600e68aa847a6cd9dd5601a73f1c&user=hernandoram1998@gmai&password=1072497419", {

    form: {
      token: "25b3600e68aa847a6cd9dd5601a73f1c",
      user: "hernandoram1998@gmai",
      password: "1072497419"

    },
    simple: false,
    followAllRedirects: true,
    jar: true

  });

  const html2 = await request.post("https://www.aveonline.co/principales/servicios.php", {

    form: {

      usuario: "hernandoram1998@gmai",
      clave: "1072497419"

    },
    simple: false,
    followAllRedirects: true,
    jar: true

  });

  const html = await request.post("https://www.aveonline.co/app/modulos/recaudos/tabla-recaudos.php", {

    form: {
      dsconsec: "",
      dsvalorrecaudo: "",
      idtransportador: "",
      dsciudad: "",
      idciudad: "",
      puntoo: "",
      puntoo: "",
      dsciudadd: "",
      idciudadd: "",
      punto: "",
      idpais: "",
      idpaisdestino: "",
      idtipoagente: "",
      dsfechai: "2020-06-16",
      dsfechaf: "2021-12-31",
      opcion: opcion,
      tipotabla: "",
      idcampobase: "",
      dscampobase: "",

    },
    simple: false,
    followAllRedirects: true,
    jar: true

  });

  const $ = cheerio.load(html);
  //const funciona= $("#tabla-clientes-data > tbody > tr:nth-child(1) > th > a:nth-child(2)").text();
  const funciona = $("body").html();
  
  $("#tabla-clientes-data > tbody > tr").each((index, element) => {
    var destinatari = $(element).find("td:nth-child(10)").text();
    var codigoDes=destinatari.replace(/[a-z]/gi,'');
    if(codigoDes==codigo){
    var id = $(element).find("td:nth-child(1)").text();
    var numGuia = $(element).find("th > a:nth-child(2)").text();
    var href = $(element).find("th > a:nth-child(2)").attr("href");
    var fecha = $(element).find("td:nth-child(4)").text();
    var destinatario = $(element).find("td:nth-child(10)").text();
    var ciudadRem = $(element).find("td:nth-child(11)").text();
    var ciudadDes = $(element).find("td:nth-child(12)").text();
    var transportadora = $(element).find("td:nth-child(13)").text();
    var valorEnvio= $(element).find("td:nth-child(20)").text();
    var recaudo= $(element).find("td:nth-child(22)").text();
    var estado= $(element).find("td:nth-child(24)").text();
    var fechaEstado= $(element).find("td:nth-child(25)").text();
    
    //#tabla-clientes-data > tbody > tr:nth-child(1) > th > a:nth-child(2)
   
    pagina += ` <tr>
    <th scope="row">${id}</th>
    <td><a href="#" >${numGuia}</a></td>
    <td>${fecha}</td>
    <td>${destinatario}</td>
    <td>${ciudadRem}</td>
    <td>${ciudadDes}</td>
    <td>${transportadora}</td>
   <!--
    <td>${valorEnvio}</td>
    -->
    <td>${recaudo}</td>
    <td>${estado}</td>
    <td>${fechaEstado}</td>
    <form action="documentoGuia" method="post">
    <input type="hidden" name="paraGuia" value="${href}">
    <td><button class="btn btn-danger" type="submit">Guia</button></td>
    </form>

    <form action="documentoRotulo" method="post">
    <input type="hidden" name="paraRotulo" value="${numGuia}">
    <input type="hidden" name="transportadora" value="${transportadora}">
    <input type="hidden" name="fecha" value="${fecha}">
    <td><button class="btn btn-primary" type="submit">Rotulo</button></td>
    </form>

    <form action="verEstado" method="post">
    <input type="hidden" name="paraVerEstado" value="${numGuia}">
    <td><button class="btn btn-primary" type="submit">Ver estado</button></td>
    </form>

    `;
  }else{
    pagina+=`
    <p>DATOS NO ENCONTRADOS</p>`;
  }

  });







  pagina += `</tbody>
    </table></body></html>`;



  res.send(pagina);

});

app.post('/documentoGuia', async (req,res)=> {
    var guia= req.body.paraGuia;
    guia=guia.replace("javascript:irImprimir('..","");
    guia=guia.replace("');","");

    let pagina=`<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
      <script src="https://code.jquery.com/jquery-3.4.1.slim.min.js" integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>
    
        <title>Document</title>
    </head>
    <body>`;

    pagina+=`
    
    <iframe height="1500" width="1500" src="https://www.aveonline.co/app/modulos${guia}" frameborder="0"></iframe>
    `;
    
    pagina+=` </body>
    </html>`;

    res.send(pagina);

  });

app.post('/documentoRotulo', async (req,res) =>{
 var rotulo= req.body.paraRotulo;
 var transportadora= req.body.transportadora;
 var fecha= req.body.fecha;
 if(transportadora=="ENVIA"){
    var img ="https://www.aveonline.co/app/temas/imagen_transpo/image002-024411-1-image002.jpg";
 }
 if(transportadora=="TCC SA"){
var img="https://www.aveonline.co/app/temas/imagen_transpo/104926-1-tcc.jpg";
rotulo=rotulo.replace("000","");
 }


const html= await request.get("https://aveonline.co/buscarguia.php?guia="+rotulo);
  const $ = cheerio.load(html);
  var unidades=$("body > div.container > dir > div > table > tbody > tr:nth-child(10) > td > strong:nth-child(1)").text();
  unidades=unidades.replace("Unidades:","");
  var origen=$("body > div.container > dir > div > table > tbody > tr:nth-child(6) > td:nth-child(1)").text();
  origen=origen.replace("Ciudad origen:","");
  var rem=$("body > div.container > dir > div > table > tbody > tr:nth-child(4) > td:nth-child(1)").text();
  rem=rem.replace("Nombre:","");
  rem=rem.replace("AVE -","");
  var direccionRem=$("body > div.container > dir > div > table > tbody > tr:nth-child(5) > td:nth-child(1)").text();
  direccionRem=direccionRem.replace("Dirección:","");
  var des=$("body > div.container > dir > div > table > tbody > tr:nth-child(4) > td:nth-child(2)").text();
  des=des.replace("Nombre:","");
  var direccionDes=$("body > div.container > dir > div > table > tbody > tr:nth-child(5) > td:nth-child(2)").text();
  direccionDes=direccionDes.replace("Dirección:","");
  var destino=$("body > div.container > dir > div > table > tbody > tr:nth-child(6) > td:nth-child(2)").text();
  destino=destino.replace("Ciudad destino:","");
  var contenido=$("").text();

  
  let pagina=`
  <html>
 <head>
 <title>HEKA Rotulo envio Nro. ${rotulo}</title>
 <link rel="stylesheet" type="text/css" href="../../incluidos/estilo.css">
 <script src="../coretransporte/JsBarcode-master/dist/JsBarcode.all.js"></script>
 
 <style>
 H1.SaltoDePagina { PAGE-BREAK-AFTER: always} 
 </style>
 </head>
 <body color=#ffffff  topmargin=0 leftmargin=0>
 
 <div class="arriba">
 
 <table border="0" cellpadding="0" cellspacing="0" class="" align="center" style="width: 95%">
 
 <tr>
 
 
     <td class="textnegrotit" align="center" valign="bottom" style="width: 250px" >
 
 
       <img src="https://www.aveonline.co/app/modulos/paqueteo/barcodegen/html/image.php?code=code39&o=1&dpi=203&t=70&r=1&rot=0&text=${rotulo}&f1=0&f2=10&a1=&a2=&a3=" alt="">
             <br>
             <p>${rotulo}</p>
 
 
 
 
         
 
 
   </td>
   
   <td style="width: 300px">
 
   
   <br />
 
   <table border="0" cellpadding="0" cellspacing="0" style="width: 68%;"  >
 
   <tr align="center">
 
   <td valign="top" class="text_guia" align="right" colspan="4" style="display:none"><span class="textnegrotit"></span> 
 
      <span >
 
     Numero de codigo</div></span>
 
     </td>
 
   </tr>
 
   <tr  class="text_guia" >	
 
 <td   valign="top" class="text_guia" align="right" colspan="4"></td>
 
 </tr>
 
 </table>
 
 </td>
 
 <td valign="top" class="text_guia" align="left" style="width:25%">
 
   <img src="https://www.aveonline.co/app/temas/agentes/015325-1-Hk.png" style="margin: 0 0 0 80;
 
     width: 120px;
 
     padding-top: 60px;
 
     margin-left: -9px;">	
 
   </td>
 
   <td valign="top" class="text_guia" align="center" style="width: 150px">
 
     
             
           
   <!-- <img src="https://www.aveonline.co/app/temas/agentes/015325-1-Hk.png" align="absmiddle" border="0" style="width:90; margin: 0 25px 0 0;padding-top: 28px;" alt="">
 
           
   -->
     
     </td>
 
   <td>
 
   
 
     
     
     &nbsp;<img src="${img}" align="absmiddle" border="0" style="width:90; margin: 0 25px 0 0;">
 
 
   </td>	
 
   </tr>
 
   </table>
 
   <!--CUADRO IZQUIERDO-->
 
 <table border="0" class="text_guia" style="font-size:13px" cellpadding="5" cellspacing="1" bgcolor="#cccccc" align="center" width="98%">
 
 <tr  bgcolor="#ffffff">
 
 <td valign="top" ><strong>UNIDADES:</strong> ${unidades} / ${unidades}</strong></td>
 
 <td valign="top" ><strong>Fecha</strong>: &nbsp;${fecha}</td>
 
 </tr>
 
 <tr bgcolor="#ffffff">
 
 <td valign="top" ><strong>Origen:&nbsp;</strong>
 
 ${origen}
 
 <td valign="top" ><strong>Remitente:</strong>&nbsp; ${rem}</td>
 
 </tr>
 
 <tr bgcolor="#ffffff">
 
 <td valign="top" ><strong>Direcci&oacute;n:</strong> ${direccionRem}  </td>
 
   <td valign="top" ><strong>Telefono:</strong> Teléfono remitente se encuenta en la guía</td>
 
 </tr>
 
 <tr bgcolor="#cccccc">
 
 <td valign="top" colspan="2" align="center"><strong>DATOS DEL DESTINATARIO</strong></td>
 
 </tr>
 
 <tr bgcolor="#ffffff">
 
 <td valign="top" ><strong>Destinatario</strong> <span style="font-size: 16px;">${des}</span></td>
 
 <td valign="top" ><strong>Ciudad</strong>
 
 <strong style="font-size: 25px;"> ${destino} / </strong> 
 
 </td>
 
 </tr>
 
 <tr bgcolor="#ffffff">
 
 <td valign="top" ><strong>Direcci&oacute;n</strong> <span style="font-size: 16px;"> ${direccionDes} </span></td>
 
 <td valign="top" ><strong>Tel&eacute;fono</strong> <span style="font-size: 16px;"> Teléfono destinatario se encuentra en la guía</span></td>
 
 </tr>
 
 
 
 <tr align="left" bgcolor="#FFFFFF" >
 
 <td ><strong>Factura / Referencia:</strong>&nbsp;<span style="font-size: 16px;"> </span></td>
 
 <td ><strong>Orden de compra:</strong> <span style="font-size: 20px;"></span>
 
  / Nro. bolsa: 1
 </td>
 
 </tr>
 
 
 
 <tr align="left" bgcolor="#FFFFFF">
 
 <td colspan="2"><strong>OBSERVACIONES</strong>MERCANCÍA</td>
 
 </tr>
 
 </table>
 
 <table  border="0" class="text_guia" style="font-size:13px" cellpadding="5" cellspacing="1" bgcolor="#cccccc" align="center" width="98%" >
 
   <tr>
 
     <td bgcolor="white">
 
       <br>
 
         <center style="font-size: 28px;"><strong><img style="margin-bottom: -4px;
 
 " src="data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjMycHgiIGhlaWdodD0iMzJweCIgdmlld0JveD0iMCAwIDM2MS4xMTcgMzYxLjExNyIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMzYxLjExNyAzNjEuMTE3OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxnPgoJPGc+CgkJPHBhdGggZD0iTTM1OS41NjgsMzI3LjI0NkwxOTEuNTExLDIxLjgxOGMtMi4xOTctMy45OTMtNi4zOTUtNi40NzQtMTAuOTUyLTYuNDc0Yy00LjU1OCwwLTguNzU0LDIuNDgxLTEwLjk1Miw2LjQ3NEwxLjU0OSwzMjcuMjQ2ICAgIGMtMi4xMzEsMy44NzItMi4wNTgsOC41ODIsMC4xOTEsMTIuMzg4YzIuMjQ5LDMuODA1LDYuMzQsNi4xMzksMTAuNzYsNi4xMzloMzM2LjExN2M0LjQyMSwwLDguNTEyLTIuMzM0LDEwLjc2MS02LjEzOSAgICBDMzYxLjYyNywzMzUuODI4LDM2MS42OTksMzMxLjExOCwzNTkuNTY4LDMyNy4yNDZ6IE0zMy42NDYsMzIwLjc3MkwxODAuNTU5LDUzLjc3M2wxNDYuOTEzLDI2Ni45OTlIMzMuNjQ2eiIgZmlsbD0iIzAwMDAwMCIvPgoJCTxwYXRoIGQ9Ik0xNjQuODk0LDE0My4wODV2OTAuMzUxYzAsOC42NSw3LjAxNCwxNS42NjUsMTUuNjY1LDE1LjY2NWM4LjY1LDAsMTUuNjY1LTcuMDE1LDE1LjY2NS0xNS42NjV2LTkwLjM1MSAgICBjMC04LjY1MS03LjAxNS0xNS42NjUtMTUuNjY1LTE1LjY2NUMxNzEuOTA4LDEyNy40MiwxNjQuODk0LDEzNC40MzUsMTY0Ljg5NCwxNDMuMDg1eiIgZmlsbD0iIzAwMDAwMCIvPgoJCTxwYXRoIGQ9Ik0xODAuNTU5LDI2NS4zNjRjLTkuMDk3LDAtMTYuNSw3LjM5OS0xNi41LDE2LjVjMCw5LjA5OCw3LjQwMywxNi41LDE2LjUsMTYuNWM5LjA5NywwLDE2LjUtNy40MDIsMTYuNS0xNi41ICAgIEMxOTcuMDU5LDI3Mi43NjQsMTg5LjY1NSwyNjUuMzY0LDE4MC41NTksMjY1LjM2NHoiIGZpbGw9IiMwMDAwMDAiLz4KCTwvZz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K" />&nbsp;ALERTA&nbsp;<img style="margin-bottom: -4px;
 
 " src="data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjMycHgiIGhlaWdodD0iMzJweCIgdmlld0JveD0iMCAwIDM2MS4xMTcgMzYxLjExNyIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMzYxLjExNyAzNjEuMTE3OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxnPgoJPGc+CgkJPHBhdGggZD0iTTM1OS41NjgsMzI3LjI0NkwxOTEuNTExLDIxLjgxOGMtMi4xOTctMy45OTMtNi4zOTUtNi40NzQtMTAuOTUyLTYuNDc0Yy00LjU1OCwwLTguNzU0LDIuNDgxLTEwLjk1Miw2LjQ3NEwxLjU0OSwzMjcuMjQ2ICAgIGMtMi4xMzEsMy44NzItMi4wNTgsOC41ODIsMC4xOTEsMTIuMzg4YzIuMjQ5LDMuODA1LDYuMzQsNi4xMzksMTAuNzYsNi4xMzloMzM2LjExN2M0LjQyMSwwLDguNTEyLTIuMzM0LDEwLjc2MS02LjEzOSAgICBDMzYxLjYyNywzMzUuODI4LDM2MS42OTksMzMxLjExOCwzNTkuNTY4LDMyNy4yNDZ6IE0zMy42NDYsMzIwLjc3MkwxODAuNTU5LDUzLjc3M2wxNDYuOTEzLDI2Ni45OTlIMzMuNjQ2eiIgZmlsbD0iIzAwMDAwMCIvPgoJCTxwYXRoIGQ9Ik0xNjQuODk0LDE0My4wODV2OTAuMzUxYzAsOC42NSw3LjAxNCwxNS42NjUsMTUuNjY1LDE1LjY2NWM4LjY1LDAsMTUuNjY1LTcuMDE1LDE1LjY2NS0xNS42NjV2LTkwLjM1MSAgICBjMC04LjY1MS03LjAxNS0xNS42NjUtMTUuNjY1LTE1LjY2NUMxNzEuOTA4LDEyNy40MiwxNjQuODk0LDEzNC40MzUsMTY0Ljg5NCwxNDMuMDg1eiIgZmlsbD0iIzAwMDAwMCIvPgoJCTxwYXRoIGQ9Ik0xODAuNTU5LDI2NS4zNjRjLTkuMDk3LDAtMTYuNSw3LjM5OS0xNi41LDE2LjVjMCw5LjA5OCw3LjQwMywxNi41LDE2LjUsMTYuNWM5LjA5NywwLDE2LjUtNy40MDIsMTYuNS0xNi41ICAgIEMxOTcuMDU5LDI3Mi43NjQsMTg5LjY1NSwyNjUuMzY0LDE4MC41NTksMjY1LjM2NHoiIGZpbGw9IiMwMDAwMDAiLz4KCTwvZz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K" /></strong>
 
     <br>
 
     Apreciado cliente, si usted encuentra:</center>
 
     <ol style="font-size: 20px;">
 
       <li>Roto este sello</li>
 
       <li>Evidencia alguna novedad en la unidad de empaque</li>
 
       <li>Evidencia maltrato en la unidad de empaque</li>
 
     </ol>
 
 
 
     <p style="font-size: 20px;">Asegúrese de registrar la novedad al lado de su firma en la constancia de entrega.
 
 Si usted no registra la novedad en la guía, <strong>EL REMITENTE NO SE HARÁ RESPONSABLE POR NINGÚN TIPO DE RECLAMACION POR PÉRDIDA Y/O AVERÍA.</strong></p>
 
 
 
 </td>
 
   </tr>
 
 </table>
 
 <br><br>
 </body>
 </html>
 <script language="javascript">
 <!--
   //setTimeout("window.print();",500);
     window.print();
     //-->
 </script>
 
 `;
 
   

res.send(pagina);
});

var server = app.listen(port, () => {
  console.log('Servidor web iniciado');
});


