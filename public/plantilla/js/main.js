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

function value(request) {
    return document.getElementById(request).value;
}
function asignacion(request, response) {
    return document.getElementById(request).value = response;
  }
  function asignacionStyle() {
   cargarHtml("preciosEnvios-mostrar-ocultar","");
   
}
function cargarHtml(request, response) {
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
// Iniciar sesion
  function iniciarSesion() {

    var email = value('usuario');
    var password = value('contrasena');
    
    
    firebase.auth().signInWithEmailAndPassword(email, password)
        
        .then(function (data) {
            cargarHtml('inicio',`<h1>sesion iniciada</h1>`);
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

      
    });


       


    }else{
            activar('login-mostrar-ocultar');
            desactivar('sesionIniciada-mostrar-ocultar');
            asignacion("codigo-usuario","no inicio");
    }

    

    });

}
mostrarPrueba();