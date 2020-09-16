var firebaseConfig = {
    apiKey: "AIzaSyCtzXKSoweSMLPej5-MbkTfQzFH719y-MM",
    authDomain: "hekaapp-23c89.firebaseapp.com",
    databaseURL: "https://hekaapp-23c89.firebaseio.com",
    projectId: "hekaapp-23c89",
    storageBucket: "hekaapp-23c89.appspot.com",
    messagingSenderId: "539740310887",
    appId: "1:539740310887:web:66f9ab535d18addeb173c2"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var db=firebase.database();

function value(request) {
    return document.getElementById(request).value;
}
function asignacion(request, response) {
    return document.getElementById(request).value = response;
  }
  function asignacionStyle() {
   cargarHtml("preciosEnvios-mostrar-ocultar","");
   
}
function printHTML(request, response) {
  return document.getElementById(request).innerHTML += response;
}
function inHTML(request, response) {
    return document.getElementById(request).innerHTML = response;
  }
  //DESACTIVAR MODULO
function desactivar(a) {
    var x = document.getElementById(a);
    x.style.display = "none";
}
////////////validar email////////////7
function validar_email(email) {
    var regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email) ? true : false;
  }
//ACTIVAR MODULO
function activar(a) {
    var x = document.getElementById(a);
    x.style.display = "block";
}
function activar_query(a) {
  var x = document.querySelector(a);
  x.style.display = "block";
}
// Iniciar sesion
  function iniciarSesion() {

    var email = value('usuario');
    var password = value('contrasena');
    
    
    firebase.auth().signInWithEmailAndPassword(email, password)
        
        .then(function (data) {
            
        })

        .catch(function (error) {

            var errorCode = error.code;
            var errorMessage = error.message;
            cargarHtml('inicio',`<h1>error: ${"| "+errorCode+" | "+errorMessage}</h1>`);
           

        });
}

function cerrarSesion(){
    firebase.auth().signOut().then(function() {
        // Sign-out successful.
        location.href("/index.html");
      }).catch(function(error) {
        // An error happened.
      });
}
function mostrarPrueba(){

    firebase.auth().onAuthStateChanged(function(user) {

    if(user){
        /*
        usuario = firebase.database().ref('usuarios').child(user.uid);
        usuario.on('value', function(snapshot) {

            var codigoFirebase= snapshot.val().codigo;
            cargarHtml("inicio",`<h1>${codigoFirebase}</h1>`);
        
                
        });
        */
       desactivar('login-mostrar-ocultar');
        activar('sesionIniciada-mostrar-ocultar');
        
        usuario = firebase.database().ref('usuarios').child(user.uid);
      usuario.on('value', function(snapshot) {
        asignacion("ciudadRFirebase", snapshot.val().ciudad);
        asignacion("codigoFirebase", snapshot.val().codigo);
        asignacion("codigoFirebase1", snapshot.val().codigo);
        asignacion("codigoFirebase2", snapshot.val().codigo);
        asignacion("codigoFirebase3", snapshot.val().codigo);
        asignacion("codigoFirebase4", snapshot.val().codigo);
        asignacion("nomRem", snapshot.val().nombre);
        asignacion("dirRem", snapshot.val().direccion);
        asignacion("barrioRem", snapshot.val().barrio);
        asignacion("celRem", snapshot.val().celular);
       

        ///////// llenar tabla-novedades /////////////////////////////7777
//if(document.getElementById('tabla-novedades')){
if(document.getElementById('tabla-novedades')){
  inHTML("tabla-novedades", "");
  }
  if(document.getElementById('tabla-enproceso')){
    inHTML("tabla-enproceso", "");
    }       
  var reference = db.ref('GuiasNovedades').child(snapshot.val().codigo);
      reference.once('value', function (datas) {
        var data = datas.val();
        $.each(data, function (nodo, value) {
          var sendData = tableNovedades(value.funcion_boton, value.num_guia, value.logo_transportadora, value.dias_antiguedad, value.novedad, 
            value.detalles_novedad,value.fecha_novedad,value.destinatario,value.direccion,value.numero,value.ciudad);
            if(document.getElementById('tabla-novedades')){
          printHTML('tabla-novedades', sendData);
            }
        });
      });

       

      /////////////////////////////////////////////////////////7
    });

       


    }else{
            activar('login-mostrar-ocultar');
            desactivar('sesionIniciada-mostrar-ocultar');
            asignacion("codigo-usuario","no inicio");
    }

    

    });

}
mostrarPrueba();

function tableNovedades(boton_text_onlick, numero_guia, trasnportadora_logo, dias_antiguedad, novedad, 
  detalle_novedad,fecha_novedad,nombre_destinatario,direccion_destinatario,telefono_destinatario,ciudad_destinatario) {
  return `<tr>
  <td><a class="btn btn-primary" href="https://api.whatsapp.com/send?phone=573213359385&text=%C2%A1Hola,%20quiero%20solucionar%20la%20novedad%20de%20mi%20env%C3%ADo!%20%20%20%20%20%20%20%20Guia: ${"" + numero_guia + ""} Novedad: ${"" + novedad + ""} Detalle novedad: ${"" + detalle_novedad + ""}">Gestionar</a></td>
  
  <td>${numero_guia}</td>
  <td> <img src="${trasnportadora_logo}" width="50" height="30"></td>
  <td>${dias_antiguedad}</td>
  
  <td>${novedad}</td>
  <td>${detalle_novedad}</td>
  <td>${fecha_novedad}</td>
  <td>${nombre_destinatario}</td>
  <td>${direccion_destinatario}</td>
  <td>${telefono_destinatario}</td>
  <td>${ciudad_destinatario}</td>
  
<!--
    <form action="documentoRotulo" method="post">
      <input type="hidden" name="paraRotulo" value="${boton_text_onlick}">
      
      <td><button class="btn btn-primary" type="submit">Rotulo</button></td>
      </form>


  <td><button ><a href="https://wa.link/v5ttbo">Relación de envío</a></button></td>
   
  <form action="verEstado" method="post">
    <input type="hidden" name="paraVerEstado" value="">
    <td><button class="btn btn-primary" type="submit">Ver estado</button></td>
    </form>
    -->
    
   
</tr>`
    ;
}

