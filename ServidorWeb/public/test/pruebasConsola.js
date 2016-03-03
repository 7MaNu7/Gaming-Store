 'use strict';

/* jasmine specs for controllers go here */
describe('GamingStore console controller', function() {

 beforeEach(module('consolaControllers'));

describe('VerConsolaCtrl', function(){
    var scope, ctrl, $httpBackend, $routeParams;

    beforeEach(inject(function(_$httpBackend_, $rootScope, $controller, $routeParams) {
      $routeParams.consolaId=1;
   

      $httpBackend.expectGET('http://localhost:3000/api/consolas/'+$routeParams.consolaId).
          respond({ data:{nombre: 'Playstation 4'} });


      scope = $rootScope.$new();
      ctrl = $controller('VerConsolaCtrl', {$scope: scope});
    }));

     it('Deberian mostrarse el primer juego y su consola', function() {

      expect(scope.consola).toEqual(undefined);

      $httpBackend.flush();

      expect(scope.consola).toEqual(
          [{nombre: 'Playstation 4'}]);

      
      });

   });

});