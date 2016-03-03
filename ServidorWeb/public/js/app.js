
//especificamos en las dependencias los controllers
var gamingStore = angular.module('gamingStore', [
  'ngRoute',
  'juegosControllers',
  'consolaControllers',
  'usuarioControllers'
])


//Hay conflictos con las listas ng-repeat de angular y los estilos listview de jquerymobile
//Se renderizan mal sin adoptar el estilo de jquery mobile a menos que hagamos esta maniobra
gamingStore.directive('ngRepeatConJqueryMobile', function() {
	return function(scope, element, attrs) {

		//Cuando vayamos por el ultimo elemento preparamos renderizado correcto
		if(scope.$last)
		{

			if($("#listaconsolas").hasClass("ui-listview"))
				$("#listaconsolas").listview("refresh");
			else
				$("#listaconsolas").trigger("create");

			if($("#listajuegos").hasClass("ui-listview"))
				$("#listajuegos").listview("refresh");
			else
				$("#listajuegos").trigger("create");

			if($("#listajuegosfiltrados").hasClass("ui-listview"))
				$("#listajuegosfiltrados").listview("refresh");
			else
				$("#listajuegosfiltrados").trigger("create");

			if($("#listausuarios").hasClass("ui-listview"))
				$("#listausuarios").listview("refresh");
			else
				$("#listausuarios").trigger("create");

			if($("#listajuegosusuario").hasClass("ui-listview"))
				$("#listajuegosusuario").listview("refresh");
			else
				$("#listajuegosusuario").trigger("create");

		}
	}
})

//tenemos indicadas para las rutas que html parcial y que controller asociamos
/*
gamingStore.config(
	function($locationProvider, $routeProvider) {
	    $routeProvider.
	      when('/juegos', {
	        templateUrl: '/aplicacion/partials/listaJuegos.html',
	        controller: 'ListaJuegosCtrl'
	      }).
	      when('/juegos/:juegoId', {
	        templateUrl: '/aplicacion/partials/verJuego.html',
	        controller: 'VerJuegoCtrl'
	      }).
	      when('/consolas', {
	        templateUrl: '/aplicacion/partials/listaConsolas.html',
	        controller: 'ListaConsolasCtrl'
	      }).
	      when('/consolas/:consolaId', {
	        templateUrl: '/aplicacion/partials/verConsola.html',
	        controller: 'VerConsolaCtrl'
	      }).
  	      when('/usuarios', {
	        templateUrl: '/aplicacion/partials/listaUsuarios.html',
	        //controller: 'ListaUsuariosCtrl' GET IMPLEMENTADO SIN FRAMEWORK
	      }).
	      when('/perfil', {
	      	templateUrl: '/aplicacion/partials/verUsuario.html',
	      	controller: 'VerUsuarioCtrl'
	      }).
	      when('/error', {
	      	templateUrl: '/aplicacion/partials/error.html',
	      }).
	      otherwise({
	      	 redirectTo: '/error',
	      });

	      

		$locationProvider.html5Mode({
			enabled: true,
			requireBase: false
		});
  	}
);*/