var consolaControllers = angular.module('consolaControllers', []);

var pagina = 1;

//controller para crear consola
juegosControllers.controller('CrearConsolaCtrl', ['$scope', '$http',
  function ($scope, $http) {


    $scope.initConsoleCreation = function()
    {

        if(localStorage.login!="admin")
        {
          $.mobile.pageContainer.pagecontainer(
              "change", "#error", {transition: 'pop'});
        }

        var obtenerConsolas = function() {
          $http.get('http://localhost:3000/api/consolas?page='+pagina).success(function(results) {
            $scope.consolas = results;
          });
        }
        obtenerConsolas();

        $scope.cancelarCreacion = function() {
            obtenerConsolas();

            $scope.consola.nombre="";
            $scope.consola.descripcion="";
            $scope.consola.imagenURL="";

            $.mobile.pageContainer.pagecontainer(
              "change", "#consolas", {transition: 'flow'});
          }

          //cuando creamos un juego mostramos la alerta como siempre
          $scope.consolaCreada = function() {

            if($scope.consola==undefined)
            {
              $rootScope.mensajeError="Debes rellenar los campos del formulario";
              $( "#popupCrearConsola" ).popup("open");
            }
            else
            {
              var data = {nombre:$scope.consola.nombre, descripcion:$scope.consola.descripcion, imagenURL: $scope.consola.imagenURL}

            $http.post('http://localhost:3000/api/consolas/', data, {headers: {'Authorization':'Basic '+ btoa(localStorage.login+":"+localStorage.password)}}).success(function() {
                obtenerConsolas() //con window location se vaciarian campos de form pero se recargaria pagina
                $scope.consola.nombre="";
                $scope.consola.descripcion="";
                $scope.consola.imagenURL="";

                //vamos a la pagina consolas
                $.mobile.pageContainer.pagecontainer(
                  "change", "#consolas", {transition: 'flow'});

                  //reiniciamos la alerta bootstrap cada vez que vayamos a crear un juego
                document.getElementById('alertasListaConsolas').innerHTML="";

                document.getElementById('alertasListaConsolas').innerHTML= document.getElementById('alertasListaConsolas').innerHTML
                +"<div class='alert alert-success alert-dismissible fade in' role='alert'>"
                +"<button type='button' class='close' data-dismiss='alert' aria-label='Close'>"
                +"<span aria-hidden='true'>×</span>"
                +"</button>"    
                +"<p>La consola se ha creado correctamente</p>"
                +"</div>";

              })
              .error(function(err) {

                $rootScope.mensajeError=err;
                $( "#popupCrearConsola" ).popup("open");

              });
            }
            
        }
    }

    $("#crearConsola").on('pagebeforeshow', function() {
      $scope.initConsoleCreation();
    });

}]);

//Las consolas como son mas estaticas en el mundo de los videojuegos no las paginamos
consolaControllers.controller('ListaConsolasCtrl', ['$rootScope', '$scope', '$http',
  function ($rootScope, $scope, $http) {

        //solo podremos crear, editar y borrar juegos si somos el usuario admin/admin
    if(localStorage.login=="admin")
    {
      $rootScope.mostrarCrear=true;
      $rootScope.mostrarEditar=true;
      $rootScope.mostrarBorrar=true;
    }
    else //si no estas logeado o estas logado como usuario estandar: usuario/123456
    {
      $rootScope.mostrarCrear=false;
      $rootScope.mostrarEditar=false;
      $rootScope.mostrarBorrar=false;
    }

    $scope.initConsoleList = function()
    {

    	var obtenerConsolas = function() {
  		$http.get('http://localhost:3000/api/consolas?page='+pagina).success(function(results) {
        		$scope.consolas = results;
      	});
    	}
    	obtenerConsolas();

      $scope.detalles = function(consola) {
        $.mobile.pageContainer.pagecontainer(
          "change", "#detallesConsola", {consola: consola});
      }

    }


    $("#consolas").on('pagebeforeshow', function() {
      $scope.initConsoleList();
    });

  }]);

consolaControllers.controller('detallesConsolaCtrl', ['$rootScope', '$scope', '$http',
  function($rootScope, $scope, $http) {

        //al igual que siempre el admin es quien crea, edita y borra
    if(localStorage.login=="admin")
    {
      $rootScope.mostrarEditar=true;
      $rootScope.mostrarBorrar=true;
    }
    else
    {
      $rootScope.mostrarEditar=false;
      $rootScope.mostrarBorrar=false;
    }


    $scope.consola={};


    $(document).on("pagebeforechange", function (e, data) {
      if(data.toPage[0].id == "detallesConsola") {
        var consola = data.options.consola;

        if(consola!=undefined)
        {

          console.log("Consola 1: ");
          console.log(consola);

          $("#detallesConsola").on('pagebeforeshow', function() {
            $http.get('http://localhost:3000/api/consolas/'+consola.id).success(function(result) {

              console.log("Consola cambiada: ");
                console.log(result.data);
              $scope.consola = result.data;

            });

            
          });
        }
      }
    });

    $scope.modificarConsola = function(consola) {

      $.mobile.pageContainer.pagecontainer(
        "change", "#editarConsola", {consola: consola, transition: 'pop'});
    }

        //borramos la consola y volvemos a la lista de consolas
    $scope.delete = function(consola) {

      $http.delete('http://localhost:3000/api/consolas/'+consola.id, {headers: {'Authorization':'Basic '+ btoa(localStorage.login+":"+localStorage.password)}}).success(function(results)  {

        document.getElementById('alertasListaConsolas').innerHTML="";

        document.getElementById('alertasListaConsolas').innerHTML= document.getElementById('alertasListaConsolas').innerHTML
        +"<div class='alert alert-success alert-dismissible fade in' role='alert'>"
        +"<button type='button' class='close' data-dismiss='alert' aria-label='Close'>"
        +"<span aria-hidden='true'>×</span>"
        +"</button>"    
        +"<p>La consola se ha borrado correctamente</p>"
        +"</div>";

        $.mobile.pageContainer.pagecontainer(
          "change", "#consolas", {consola: consola, transition: 'flow'});
      });
     }

  }]);

consolaControllers.controller('editarConsolaCtrl', ['$rootScope', '$scope', '$http',
  function($rootScope, $scope, $http) {
    $scope.consola={};

    //Para recoger los valores por defecto antes de editar
    $(document).on("pagebeforechange", function (e, data) {
      if(data.toPage[0].id == "editarConsola") {
        var consola = data.options.consola;

        console.log("Consola 2: ");
        console.log(consola);

        if(consola!=undefined)
        {
          $http.get('http://localhost:3000/api/consolas/'+consola.id).success(function(result) {
            $scope.consola = result.data;
            console.log("Consola 4");
            console.log($scope.consola);
          });
        }
      }
    })

    $scope.initConsoleEdition = function()
    {
      if(localStorage.login!="admin")
      {
        $.mobile.pageContainer.pagecontainer(
            "change", "#error", {transition: 'pop'});
      }

      $scope.cancelar = function(consola) {

        $.mobile.pageContainer.pagecontainer(
          "change", "#detallesConsola", {consola: consola});
        
      }

      $scope.consolaEditada = function(consola) {

        var data = {nombre:consola.nombre, descripcion:consola.descripcion}

        $http.put('http://localhost:3000/api/consolas/'+consola.id, data, {headers: {'Authorization':'Basic '+ btoa(localStorage.login+":"+localStorage.password)}}).success(function() {

           $.mobile.pageContainer.pagecontainer(
            "change", "#detallesConsola", {consola: consola});

            document.getElementById('alertasConsola').innerHTML="";

            document.getElementById('alertasConsola').innerHTML= document.getElementById('alertasConsola').innerHTML
            +"<div class='alert alert-success alert-dismissible fade in' role='alert'>"
            +"<button type='button' class='close' data-dismiss='alert' aria-label='Close'>"
            +"<span aria-hidden='true'>×</span>"
            +"</button>"    
            +"<p>La consola se ha modificado correctamente</p>"
            +"</div>";

        })
        .error(function(err) {

          $rootScope.mensajeError=err;
          $( "#popupEditarConsola" ).popup("open");

        });

      }
    }

    $("#editarConsola").on('pagebeforeshow', function() {
      $scope.initConsoleEdition();
    });

  }]);
