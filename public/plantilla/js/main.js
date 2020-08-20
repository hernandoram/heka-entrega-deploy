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
function cargarHtml(request, response) {
    return document.getElementById(request).innerHTML = response;
  }
function iniciarSesion() {

    var email = value('usuario');
    var password = value('contrasena');
    var html=`<h1>sesion iniciada</h1>`;
    
    firebase.auth().signInWithEmailAndPassword(email, password)
        
        .then(function (data) {
            cargarHtml('inicio',html);
        })

        .catch(function (error) {

            var errorCode = error.code;
            var errorMessage = error.message;
            cargarHtml('inicio',`<h1>error: ${"| "+errorCode+" | "+errorMessage}</h1>`);

        });
}

function mostrarPrueba(){

    firebase.auth().onAuthStateChanged(function(user) {

    if(user){

        usuario = firebase.database().ref('usuarios').child(user.uid);
        usuario.on('value', function(snapshot) {

            var codigoFirebase= snapshot.val().codigo;
            cargarHtml("inicio",`<h1>${codigoFirebase}</h1>`);
        
        
        });

    }else{

    }

    

    });

}
mostrarPrueba();