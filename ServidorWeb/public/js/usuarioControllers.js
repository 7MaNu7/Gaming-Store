var usuarioControllers = angular.module('usuarioControllers', []);

var pagina = 1;
var numPaginas;

usuarioControllers.controller('ListaUsuariosCtrl', ['$rootScope', '$scope', '$http',
  function ($rootScope, $scope, $http) {

    if(localStorage.login=="admin" || localStorage.login=="usuario")
    {
      $rootScope.mostrarLogout=true;
    }
    else
    {
      $rootScope.mostrarLogout=false;
    }

    $scope.initListUsers = function()
    {

      var obtenerUsuarios = function() {
      $http.get('http://localhost:3000/api/usuarios?page='+pagina, {headers: {'Authorization':'Basic '+ btoa(localStorage.login+":"+localStorage.password)}}).success(function(results) {
            $scope.usuarios = results.data;
            numPaginas = results.total/4;
        })
        .error(function(err) {
          $.mobile.pageContainer.pagecontainer(
            "change", "#error", {transition: 'flow'});
        });
      }
      obtenerUsuarios();
    }

    $("#usuarios").on('pagebeforeshow', function() {
       $scope.initListUsers();
    });

  }]);

//controller especial en el que se controlan determinadas cosas
usuarioControllers.controller('LoginCtrl', ['$rootScope', '$scope', '$http',
  function ($rootScope, $scope, $http) {

    $scope.initNavBar = function()
    {

      console.log("Estoy en initnavbar");

      var comprobarAcceso = function() {

        console.log("Estoy dentro y tengo: "+localStorage.login);
        //controlamos que el navbar muestre login o logout dependiendo de si estamos logeados o no
        if(localStorage.login=="admin" || localStorage.login=="usuario")
        {
          $rootScope.mostrarLogout=true;
        }
        else
        {
          $rootScope.mostrarLogout=false;
        }

        //Si somos admin se podra acceder a la lista de usuarios
        if(localStorage.login=="admin")
        {
          $rootScope.mostrarUsuarios=true;
          $rootScope.mostrarUsuario=false;
          $rootScope.mostrarModal=false;

          $rootScope.mostrarCrear=true;
          $rootScope.mostrarEditar=true;
          $rootScope.mostrarBorrar=true;
          $rootScope.mostrarComprar=false;
        }
        else if(localStorage.login=="usuario") //si somos el usuario podremos acceder a nuestro perfil
        {
          $rootScope.mostrarUsuarios=false;
          $rootScope.mostrarUsuario=true;
          $rootScope.mostrarModal=false;

          $rootScope.mostrarCrear=false;
          $rootScope.mostrarEditar=false;
          $rootScope.mostrarBorrar=false;

          $rootScope.mostrarComprar=true;
        }
        else  //si no estamos logeados al acceder a perfil se nos mostrara un modal para logear automaticamente
        {
          $rootScope.mostrarUsuarios=false;
          $rootScope.mostrarUsuario=false;
          $rootScope.mostrarModal=true;

          $rootScope.mostrarCrear=false;
          $rootScope.mostrarEditar=false;
          $rootScope.mostrarBorrar=false;
        }

      }

      comprobarAcceso();

      $("#juegos").on('pagebeforeshow', function() {
       comprobarAcceso();
      });

      
      $scope.comprobarLogin = function() {

        var data = {login: $scope.login, password: $scope.password}
        var cadena=JSON.stringify(data);

        //guardamos en localStorage login y password si el logeo ha ido bien
        $http.post('http://localhost:3000/api/login', data).success(function(msn) {

            localStorage.setItem('login', data.login);
            localStorage.setItem('password', data.password);

            comprobarAcceso();

            document.getElementById('log').value="";
            document.getElementById('pass').value="";

            //vamos a la pagina principal
            $.mobile.pageContainer.pagecontainer(
              "change", "#juegos", {transition: 'flow'});

        })
        .error(function(err) {

          $rootScope.mensajeError=err;
          $( "#popupLogin" ).popup("open");

        });
      }

      //al cerrar sesion limpiamos localStorage y mostramos login, con ng-hide y ng-show sera lo contrario a mostrarLogout
      $scope.logout = function() {

        localStorage.clear();

        comprobarAcceso();

        $.mobile.pageContainer.pagecontainer(
          "change", "#login", {transition: 'flow'});
       // window.location="/juegos";
      }

      $scope.detallesUsuario = function() {
        $.mobile.pageContainer.pagecontainer(
          "change", "#perfil", {transition: 'flow'});
      }

    }

    $(document).on('pagebeforeshow', function() {
       $scope.initNavBar();
    });

    $scope.initNavBar();
    

  }]);


usuarioControllers.controller('detallesUsuarioCtrl', ['$rootScope', '$scope', '$http',
  function($rootScope, $scope, $http) {

    $scope.initUserDetails = function()
    {

          //si estamos intentando acceder al perfil sin ser usuario/123456 dara error 403 y se mostrara ese error con ng-hide ng-show
      var obtenerUsuario = function() {
       // $scope.errorBadRequest=false;
        $http.get('http://localhost:3000/api/usuarios/1', {headers: {'Authorization':'Basic '+ btoa(localStorage.login+":"+localStorage.password)}}).success(function(result) {
          $scope.usuario = result.data;
        })
        .error(function(err) {
          $.mobile.pageContainer.pagecontainer(
          "change", "#error", {transition: 'flow'});
        });

        //mostramos siempre a pelo el primer usuario y sus juegos por tanto si borramos este dara errores las proximas veces
        $http.get('http://localhost:3000/api/usuarios/1/juegos', {headers: {'Authorization':'Basic '+ btoa(localStorage.login+":"+localStorage.password)}}).success(function(result) {
          $scope.juegosUsuario = result;
        });
      }
      obtenerUsuario();

      $("#historial").on('pagebeforeshow', function() {
       obtenerUsuario();
      });

      $scope.volverPerfil = function() {

        $.mobile.pageContainer.pagecontainer(
          "change", "#perfil", {transition: 'slideup'});
      }

      $scope.modificarUsuario = function() {

        $.mobile.pageContainer.pagecontainer(
          "change", "#editarUsuario", {transition: 'pop'});

      }

      $scope.verHistorial = function() {

        $.mobile.pageContainer.pagecontainer(
          "change", "#historial", {transition: 'slidedown'});
      }

      $scope.detalles = function(juego) {
        $.mobile.pageContainer.pagecontainer(
          "change", "#detallesJuego", {juego: juego, transition: 'pop'});
      }

      $scope.delete = function(usuarioId) {
        
        $http.delete('http://localhost:3000/api/usuarios/'+usuarioId, {headers: {'Authorization':'Basic '+ btoa(localStorage.login+":"+localStorage.password)}}).success(function(results)  {
          localStorage.clear();

          document.getElementById('alertasListaJuegos').innerHTML="";

          document.getElementById('alertasListaJuegos').innerHTML= document.getElementById('alertasListaJuegos').innerHTML
          +"<div class='alert alert-success alert-dismissible fade in' role='alert'>"
          +"<button type='button' class='close' data-dismiss='alert' aria-label='Close'>"
          +"<span aria-hidden='true'>×</span>"
          +"</button>"    
          +"<p>Cuenta borrada correctamente</p>"
          +"</div>";

          $.mobile.pageContainer.pagecontainer(
            "change", "#juegos", {transition: 'flow'});
        });
     }

  }

    $("#perfil").on('pagebeforeshow', function() {
      $scope.initUserDetails();
      //obtenerUsuario();
    });


  }]);

usuarioControllers.controller('editarUsuarioCtrl', ['$rootScope', '$scope', '$http',
  function($rootScope, $scope, $http) {

    $scope.initUserEdition = function() {

           //si estamos intentando acceder al perfil sin ser usuario/123456 dara error 403 y se mostrara ese error con ng-hide ng-show
      var obtenerUsuario = function() {
       // $scope.errorBadRequest=false;
        $http.get('http://localhost:3000/api/usuarios/1', {headers: {'Authorization':'Basic '+ btoa(localStorage.login+":"+localStorage.password)}}).success(function(result) {
          $scope.usuario = result.data;
        })
        .error(function(err) {

        });

        //mostramos siempre a pelo el primer usuario y sus juegos por tanto si borramos este dara errores las proximas veces
        $http.get('http://localhost:3000/api/usuarios/1/juegos', {headers: {'Authorization':'Basic '+ btoa(localStorage.login+":"+localStorage.password)}}).success(function(result) {
          $scope.juegosUsuario = result;
        });
      }
      obtenerUsuario();

      //Para recoger los valores por defecto antes de editar
      $(document).on("pagebeforechange", function (e, data) {
        if(data.toPage[0].id == "editarUsuario") {

          obtenerUsuario();
        }
      })

       //Podemos editar este usuario 1 de muestra siempre y cuando estemos logeados como usuario/123456
      $scope.usuarioEditado = function() {
        var data = {nombre:$scope.usuario.nombre, direccion:$scope.usuario.direccion, apellidos:$scope.usuario.apellidos}

        $http.put('http://localhost:3000/api/usuarios/1', data, {headers: {'Authorization':'Basic '+ btoa(localStorage.login+":"+localStorage.password)}}).success(function() {
         
          document.getElementById('alertasUsuario').innerHTML="";

          document.getElementById('alertasUsuario').innerHTML= document.getElementById('alertasUsuario').innerHTML
          +"<div class='alert alert-success alert-dismissible fade in' role='alert'>"
          +"<button type='button' class='close' data-dismiss='alert' aria-label='Close'>"
          +"<span aria-hidden='true'>×</span>"
          +"</button>"    
          +"<p>Los datos se han modificado correctamente</p>"
          +"</div>";
          obtenerUsuario();

           $.mobile.pageContainer.pagecontainer(
              "change", "#perfil", {transition: 'flow'});

        })
        .error(function(err) {

          $rootScope.mensajeError=err;
          $( "#popupEditarUsuario" ).popup("open");

        });

      }

      $scope.cancelar = function() {

        $.mobile.pageContainer.pagecontainer(
          "change", "#perfil", {transition: 'flow'});
        
      }

    }

    $("#editarUsuario").on('pagebeforeshow', function() {
      $scope.initUserEdition();
    });

  }]);