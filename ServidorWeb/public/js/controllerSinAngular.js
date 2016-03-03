
var myDivBien = document.getElementById('MostrarSuccessReg');
var pReg = document.getElementById('errorRegistro');
//funcion para el registro sin angular
function creaUsuarioSinAngular() {

	//obtenemos los campos
	var nombre= document.getElementById('nombre').value;
	var direccion= document.getElementById('direccion').value;
	var email= document.getElementById('email').value;
	var apellidos= document.getElementById('apellidos').value;

	myDivBien.innerHTML="";
	pReg.innerHTML="";

	$.ajax({
		//url donde se hace el post
		url: 'http://localhost:3000/api/usuarios',
		async: true,
		data: { nombre : nombre, email : email, apellidos : apellidos, direccion : direccion },
		type: 'POST',
		success: function(results) {

	      	document.getElementById('nombre').value="";
	      	document.getElementById('direccion').value="";
	      	document.getElementById('email').value="";
	      	document.getElementById('apellidos').value="";


	      	$.mobile.pageContainer.pagecontainer(
        		"change", "#login", {transition: 'flow'});
			//mostramos el alert de registro correcto
			
    		myDivBien.innerHTML = myDivBien.innerHTML
			+"<div class='alert alert-success alert-dismissible fade in' role='alert'>"
			+"<button type='button' class='close' data-dismiss='alert' aria-label='Close'>"
			+"<span aria-hidden='true'>×</span>"
			+"</button>"    
			+"<h4>Felicidades!</h4>"
			+"<p>Te has registrado correctamente, inicie sesion para entrar!</p>"
			+"</div>"
			console.log("creacion exitosa");
	 	},
	 	error: function(results) {

			pReg.innerHTML=pReg.innerHTML+results.responseText;
          
          $( "#popupRegistro" ).popup("open");

			console.log("creacion erronea");
	 	}
 	});
}

function limpiarForm() {
	document.getElementById('nombre').value="";
  	document.getElementById('direccion').value="";
  	document.getElementById('email').value="";
  	document.getElementById('apellidos').value="";

  	$.mobile.pageContainer.pagecontainer(
		"change", "#juegos", {transition: 'flow'});
}

//asociamos el click al registro con nuestra funcion
document.getElementById('creaUser').onclick=creaUsuarioSinAngular;
document.getElementById('cancelaRegistro').onclick=limpiarForm;
