var juegosControllers = angular.module('juegosControllers', []);

//inicialmente estamos en la pagina 1
var pagina = 1;
var juegosPorPag = 4;
var numPaginas;

//controller para crear juego
juegosControllers.controller('CrearJuegoCtrl', ['$scope', '$http',
  function ($scope, $http) {


    $scope.initGameCreation = function()
    {

        if(localStorage.login!="admin")
        {
          $.mobile.pageContainer.pagecontainer(
              "change", "#error", {transition: 'pop'});
        }

          //metodo para obtener la lista de los juegos
      var obtenerJuegos = function() {

        //pedimos los juegos de la pagina indicada o por la que vayamos navegando
        $http.get('http://localhost:3000/api/juegos?page='+pagina).success(function(results) {
              $scope.juegos = results.data;
              //actualizar numero de paginas puede cambiar al borrar algun juego por ejemplo
              numPaginas = results.total/juegosPorPag;
          });

            //obtenemos las consolas para indicar de que consola es cada juego
        $http.get('http://localhost:3000/api/consolas').success(function(results) {
          $scope.consolas = results;
        });
      }
      obtenerJuegos(); //lo invocamos nada mas entrar en la pagina


      $scope.cancelarCreacion = function() {

        $scope.juego.nombre="";
        $scope.juego.descripcion="";
        $scope.juego.portada="";
        $scope.juego.nota="";
        $scope.juego.precioAntes="";
        $scope.juego.precioDespues="";

        $.mobile.pageContainer.pagecontainer(
          "change", "#juegos", {transition: 'flow'});
      }

      //ngclick al crear un juego
      $scope.juegoCreado = function() {

        if($scope.juego==undefined)
        {
          $rootScope.mensajeError="Debes rellenar los campos del formulario";
          $( "#popupCrearJuego" ).popup("open");
        }
        else
        {
                 //los datos que pasaremos al post para crear el juego
          var data = {nombre:$scope.juego.nombre, descripcion:$scope.juego.descripcion, portada:$scope.juego.portada, ConsolaId:$scope.consolaSeleccionada, genero:$scope.generoSeleccionado, nota:$scope.juego.nota, precioAntes:$scope.juego.precioAntes, precioDespues:$scope.juego.precioDespues}

          console.log("La consola es: "+$scope.consolaSeleccionada);
          //pasamos tambien los datos de autenticacion del localStorage
          $http.post('http://localhost:3000/api/juegos/', data, {headers: {'Authorization':'Basic '+ btoa(localStorage.login+":"+localStorage.password)}}).success(function() {
              
              $scope.juego.nombre="";
              $scope.juego.descripcion="";
              $scope.juego.portada="";
              $scope.juego.nota="";
              $scope.juego.precioAntes="";
              $scope.juego.precioDespues="";


              //reiniciamos la alerta bootstrap cada vez que vayamos a crear un juego
              document.getElementById('alertasListaJuegos').innerHTML="";

              document.getElementById('alertasListaJuegos').innerHTML= document.getElementById('alertasListaJuegos').innerHTML
              +"<div class='alert alert-success alert-dismissible fade in' role='alert'>"
              +"<button type='button' class='close' data-dismiss='alert' aria-label='Close'>"
              +"<span aria-hidden='true'>×</span>"
              +"</button>"    
              +"<p>El juego se ha creado correctamente</p>"
              +"</div>";

              filtrado=false;
              pagina=1;
              //obtenerJuegos() 

              //vamos a la pagina principal
              $.mobile.pageContainer.pagecontainer(
                "change", "#juegos", {transition: 'flow'});
            })
            .error(function(err) {

              $rootScope.mensajeError=err;
              $( "#popupCrearJuego" ).popup("open");
              //de igual modo con las alertas para los errores

            });
        }
      }
    }

    $("#crearJuego").on('pagebeforeshow', function() {
      $scope.initGameCreation();
    });

}]);


//controller para la lista de juegos
juegosControllers.controller('ListaJuegosCtrl', ['$rootScope', '$scope', '$http',
  function ($rootScope, $scope, $http) {

  	var filtrado = false;

        //solo podremos crear, editar y borrar juegos si somos el usuario admin/admin
    if(localStorage.login=="admin")
    {
      $rootScope.mostrarCrear=true;
      $rootScope.mostrarEditar=true;
      $rootScope.mostrarBorrar=true;
      $rootScope.mostrarComprar=false;
    }
    else //si no estas logeado o estas logado como usuario estandar: usuario/123456
    {
      $rootScope.mostrarCrear=false;
      $rootScope.mostrarEditar=false;
      $rootScope.mostrarBorrar=false;

      //comprar solo si eres usuario/123456
      if(localStorage.login=="usuario")
      {
        $rootScope.mostrarComprar=true;
      }
    }

    $scope.initGameList = function()
    {
        //metodo para obtener la lista de los juegos
      var obtenerJuegos = function() {

        //pedimos los juegos de la pagina indicada o por la que vayamos navegando
        $http.get('http://localhost:3000/api/juegos?page='+pagina).success(function(results) {
              $scope.juegos = results.data;
              //actualizar numero de paginas puede cambiar al borrar algun juego por ejemplo
              numPaginas = results.total/juegosPorPag;
          });

            //obtenemos las consolas para indicar de que consola es cada juego
        $http.get('http://localhost:3000/api/consolas').success(function(results) {
          $scope.consolas = results;
        });
      }
      obtenerJuegos(); //lo invocamos nada mas entrar en la pagina

        //funcion ngclick para el filtro por consolas
      $scope.filtrar = function() {

        //si no se especifica consola se muestran todos
        if($scope.consolaFiltrada!="")
        {
            $.mobile.pageContainer.pagecontainer(
              "change", "#juegosFiltrados", {consolaId: $scope.consolaFiltrada, transition: 'slidedown'});
        }
      }

      $scope.detalles = function(juego) {
        $.mobile.pageContainer.pagecontainer(
          "change", "#detallesJuego", {juego: juego});
      }
    }

    $("#juegos").on('pagebeforeshow', function() {
      $scope.initGameList();
    });

    $scope.initGameList();

  }]);


//controller para la lista de juegos filtrados
juegosControllers.controller('ListaJuegosFiltradosCtrl', ['$rootScope', '$scope', '$http',
  function ($rootScope, $scope, $http) {


    //metodo para obtener la lista de los juegos
    $scope.juegos={};

    $(document).on("pagebeforechange", function (e, data) {

      if(data.toPage[0].id == "juegosFiltrados") {
        var consolaId = data.options.consolaId;

        if(consolaId!=undefined)
        {
          $http.get('http://localhost:3000/api/consolas/'+consolaId+'/juegos').success(function(results) {
            $scope.juegos = results.data;

            //ahora hay distinta cantidad de elementos, por tanto distinta cantidad de paginas
            numPaginas = results.total/juegosPorPag;
            pagina=1;
            //obtenemos las consolas para indicar de que consola es cada juego
            $http.get('http://localhost:3000/api/consolas').success(function(results) {
              $scope.consolas = results;
            });

            //obtenemos la consola especifica del filtrado
            $http.get('http://localhost:3000/api/consolas/'+consolaId).success(function(results) {
              $scope.consola = results.data;
            });
          });
        }
      }
    });

    //solo podremos crear, editar y borrar juegos si somos el usuario admin/admin
    if(localStorage.login=="admin")
    {
      $rootScope.mostrarCrear=true;
      $rootScope.mostrarEditar=true;
      $rootScope.mostrarBorrar=true;
      $rootScope.mostrarComprar=false;
    }
    else //si no estas logeado o estas logado como usuario estandar: usuario/123456
    {
      $rootScope.mostrarCrear=false;
      $rootScope.mostrarEditar=false;
      $rootScope.mostrarBorrar=false;

      //comprar solo si eres usuario/123456
      if(localStorage.login=="usuario")
      {
        $rootScope.mostrarComprar=true;
      }
    }

  $scope.detalles = function(juego) {
    $.mobile.pageContainer.pagecontainer(
      "change", "#detallesJuego", {juego: juego});
  }

  $scope.volver = function() {
    $.mobile.pageContainer.pagecontainer(
      "change", "#juegos", {transition: 'slideup'});
  }


  }]);



juegosControllers.controller('detallesJuegoCtrl', ['$rootScope', '$scope', '$http',
  function($rootScope, $scope, $http) {

        //al igual que siempre el admin es quien crea, edita y borra
    if(localStorage.login=="admin")
    {
      $rootScope.mostrarEditar=true;
      $rootScope.mostrarBorrar=true;
      $rootScope.mostrarComprar=false;
    }
    else
    {
      $rootScope.mostrarEditar=false;
      $rootScope.mostrarBorrar=false;

      if(localStorage.login=="usuario") //y el usuario/123456 quien puede comprar
      {
        $rootScope.mostrarComprar=true;
      }
    }


    $scope.juego={};

    $(document).on("pagebeforechange", function (e, data) {
      if(data.toPage[0].id == "detallesJuego") {
        var juego = data.options.juego;

        if(juego!=undefined)
        {

          //Gracias a esto si cancelamos cambios al editar un juego vemos sus valores antes de entrar en modo edicion
          $("#detallesJuego").on('pagebeforeshow', function() {
           $http.get('http://localhost:3000/api/juegos/'+juego.id).success(function(result) {

              $scope.juego=result.data;

              $http.get('http://localhost:3000/api/consolas/'+result.data.ConsolaId).success(function(result2) {
                $scope.consola = result2.data;
              });

            });

          });

        }
      }
    })

    $scope.modificarJuego = function(juego) {

      $.mobile.pageContainer.pagecontainer(
        "change", "#editarJuego", {juego: juego});
      $scope.editoJuego=true;
    }

    //borramos el juego y volvemos a la lista de juegos
    $scope.delete = function(juego) {
      console.log("Me meto en delete y vendo del juego: "+juego.id)
      $http.delete('http://localhost:3000/api/juegos/'+juego.id, {headers: {'Authorization':'Basic '+ btoa(localStorage.login+":"+localStorage.password)}}).success(function(results)  {
      
        document.getElementById('alertasListaJuegos').innerHTML="";

        document.getElementById('alertasListaJuegos').innerHTML= document.getElementById('alertasListaJuegos').innerHTML
        +"<div class='alert alert-success alert-dismissible fade in' role='alert'>"
        +"<button type='button' class='close' data-dismiss='alert' aria-label='Close'>"
        +"<span aria-hidden='true'>×</span>"
        +"</button>"    
        +"<p>El juego se ha borrado correctamente</p>"
        +"</div>";

        $.mobile.pageContainer.pagecontainer(
          "change", "#juegos", {juego: juego});
      });
     }

    //al comprar el juego se activa la animacion de la alerta y se añade al historial del usuario 1 a pelo
    $scope.comprar = function(juego) {
      var data = {};
      $http.put('http://localhost:3000/api/usuarios/1/juegos/'+juego.id, data, {headers: {'Authorization':'Basic '+ btoa(localStorage.login+":"+localStorage.password)}}).success(function() {
        
          $( "#popupComprarJuego" ).popup("open");
      });
    }

  }])

juegosControllers.controller('editarJuegoCtrl', ['$rootScope', '$scope', '$http',
  function($rootScope, $scope, $http) {

    $scope.juego={};

    //Para recoger los valores por defecto antes de editar
    $(document).on("pagebeforechange", function (e, data) {
      if(data.toPage[0].id == "editarJuego") {
        var juego = data.options.juego;

        if(juego!=undefined)
        {
          $http.get('http://localhost:3000/api/juegos/'+juego.id).success(function(result) {
            juego = result.data;
            console.log("Juego 4");
            console.log(juego);

            $http.get('http://localhost:3000/api/consolas/'+result.data.ConsolaId).success(function(result2) {
              $scope.consola = result2.data;
            });
          });

          $scope.juego=juego;
        }
      }
    })

    $scope.initGameEdition = function()
    {
      if(localStorage.login!="admin")
      {
        $.mobile.pageContainer.pagecontainer(
            "change", "#error", {transition: 'pop'});
      }

      $scope.cancelar = function(juego) {

        $.mobile.pageContainer.pagecontainer(
          "change", "#detallesJuego", {juego: juego});
        
      }

      $scope.juegoEditado = function(juego) {
        var data = {nombre:juego.nombre, descripcion:juego.descripcion, portada: juego.portada, ConsolaId:juego.ConsolaId, nota: juego.nota, precioAntes: juego.precioAntes, precioDespues: juego.precioDespues}

        $http.put('http://localhost:3000/api/juegos/'+juego.id, data, {headers: {'Authorization':'Basic '+ btoa(localStorage.login+":"+localStorage.password)}}).success(function() {

           $.mobile.pageContainer.pagecontainer(
            "change", "#detallesJuego", {juego: juego});

            document.getElementById('alertasJuego').innerHTML="";

            document.getElementById('alertasJuego').innerHTML= document.getElementById('alertasJuego').innerHTML
            +"<div class='alert alert-success alert-dismissible fade in' role='alert'>"
            +"<button type='button' class='close' data-dismiss='alert' aria-label='Close'>"
            +"<span aria-hidden='true'>×</span>"
            +"</button>"    
            +"<p>El juego se ha modificado correctamente</p>"
            +"</div>";

        })
        .error(function(err) {

          $rootScope.mensajeError=err;
          $( "#popupEditarJuego" ).popup("open");
        });

      }

    }

    $("#editarJuego").on('pagebeforeshow', function() {
      $scope.initGameEdition();
    });


  }])
