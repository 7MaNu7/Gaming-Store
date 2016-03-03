 'use strict';

/* jasmine specs for controllers go here */
describe('GamingStore console controllers', function() {

 beforeEach(module('consolaControllers'));


  describe('ListaConsolasCtrl', function(){
    var scope, ctrl, $httpBackend;

    beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
      $httpBackend = _$httpBackend_;

      $httpBackend.expectGET('http://localhost:3000/api/consolas?page=1').
          respond([{nombre: 'Playstation 4'}, {nombre: 'Wii U'}, {nombre: 'Xbox One'}, {nombre: 'Nintendo DS Lite'}, {nombre: 'PSVITA'}, {nombre: 'Playstation 3'}, {nombre: 'Xbox 360'}, {nombre: 'Nintendo 3DS XL'}]);


      scope = $rootScope.$new();
      ctrl = $controller('ListaConsolasCtrl', {$scope: scope});
    }));

     it('Deberian mostrarse todas las consolas', function() {

      expect(scope.consolas).toEqual(undefined);

      $httpBackend.flush();

      expect(scope.consolas).toEqual(
          [{nombre: 'Playstation 4'}, {nombre: 'Wii U'}, {nombre: 'Xbox One'}, {nombre: 'Nintendo DS Lite'}, {nombre: 'PSVITA'}, {nombre: 'Playstation 3'}, {nombre: 'Xbox 360'}, {nombre: 'Nintendo 3DS XL'}]);

      
      });

    it('Sin estar logeado deberian ocultarse las caracteristicas privadas', function() {

      expect(scope.mostrarCrear).toEqual(false);
      expect(scope.mostrarEditar).toEqual(false);
      expect(scope.mostrarBorrar).toEqual(false);

     });

   });

});