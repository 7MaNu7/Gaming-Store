'use strict';

/* jasmine specs for controllers go here */
describe('GamingStore controllers', function() {


  beforeEach(module('juegosControllers'));


  describe('ListaJuegosCtrl', function(){
    var scope, ctrl, $httpBackend;

    beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
      $httpBackend = _$httpBackend_;
      $httpBackend.expectGET('http://localhost:3000/api/juegos?page=1').
          respond({ data:[{nombre: 'Metal Gear Solid V'}, {nombre: 'Fifa 16'}, {nombre: 'Pro Evolution Soccer 2016'}, {nombre: 'WWE 2k15'}] });

      $httpBackend.expectGET('http://localhost:3000/api/consolas').
          respond([{nombre: 'Playstation 4'}, {nombre: 'Wii U'}, {nombre: 'Xbox One'}, {nombre: 'Nintendo DS Lite'}, {nombre: 'PSVITA'}, {nombre: 'Playstation 3'}, {nombre: 'Xbox 360'}, {nombre: 'Nintendo 3DS XL'}]);


      scope = $rootScope.$new();
      ctrl = $controller('ListaJuegosCtrl', {$scope: scope});
    }));

     it('Deberian mostrarse 4 juegos por ser la primera pagina', function() {

      expect(scope.juegos).toEqual(undefined);
      expect(scope.consolas).toEqual(undefined);

      $httpBackend.flush();

      expect(scope.juegos).toEqual(
          [{nombre: 'Metal Gear Solid V'}, {nombre: 'Fifa 16'}, {nombre: 'Pro Evolution Soccer 2016'}, {nombre: 'WWE 2k15'}]);

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