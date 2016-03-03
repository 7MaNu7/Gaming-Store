var models  = require('../models');
var express = require('express');
var router  = express.Router();
var checkAuth = require('./checkAuth');
var checkAdminAuth = require('./checkAdminAuth');


var paginado = require('./paginado');

var juegosPorPag = 4;

router.get('/', function(pet, resp){

	models.Consola.findAll().then(function(results) {
		resp.status(200).send(results);
	});

});
	

router.post('/', checkAdminAuth.checkAdminAuth, function(pet, resp){

		if(pet.body.nombre==null)
		{
			resp.status(400).send("Error 400: Debes especificar el nombre de la consola");
		}
		else
		{
			models.Consola.create({
				nombre: pet.body.nombre,
				descripcion: pet.body.descripcion,
				imagenURL: pet.body.imagenURL
			}).then(function(consola){
				resp.location('/api/consolas/' + consola.id)
				resp.status(201).send();
			});
		}
});

router.put('/:id', checkAdminAuth.checkAdminAuth, function(pet, resp){


	if(!isNaN(pet.params.id))
	{

		if(pet.body.nombre==null || pet.body.nombre=="")
		{
			resp.status(400).send("Error 400: Debes especificar el nombre de la consola");
		}
		else
		{

			var values = {nombre: pet.body.nombre, descripcion: pet.body.descripcion, imagenURL: pet.body.imagenURL};
			var index = { where: {id: pet.params.id} };

			models.Consola.update(values, index).then(function(result){

				if(result==false)
				{
					resp.status(404).send("Error 404: El producto que intenta modificar no existe");
				}
				else
				{
					resp.status(204).send("Producto modificado correctamente");
				}
			});
		}
	}
	else
	{
		resp.status(400).send("Error 400: El id proporcionado no es un numero");
	}
});

router.delete('/:id', checkAdminAuth.checkAdminAuth, function(pet, resp){

	if(!isNaN(pet.params.id))
	{
		var index = { where: {id: pet.params.id} };

		models.Consola.destroy(index).then(function(result){

			if(result==false)
			{
				resp.status(404).send("Error 404: El producto que intenta borrar no existe");
			}
			else
			{
				resp.status(204).send("Producto eliminado correctamente");
			}
		});
	}
	else
	{
		resp.status(400).send("Error 400: El id proporcionado no es un numero");
	}

})

router.get('/:id', function(pet, resp){

	if(!isNaN(pet.params.id))
	{
		models.Consola.findById(pet.params.id).then(function(result){

			if(result==null)
			{			
				resp.status(404).send("Error 404: El producto al que intenta acceder no existe");
			}
			else
			{		
				resp.status(200).send({
					data: result,
					links: [
					{   rel: "self",
						href: "http://localhost:3000/api/consolas/"+pet.params.id },
					{   rel: "juegos",
						href: "http://localhost:3000/api/consolas/"+pet.params.id+"/juegos" },
					{	rel: "otras consolas",
						href: "http://localhost:3000/api/consolas" }
					]
				});
			}
		});
	}
	else
	{
		resp.status(400).send("Error 400: El id proporcionado no es un numero");
	}
})

//Devuelve todos los productos de una categoria
router.get('/:id/juegos', function(pet, resp){

	if(!isNaN(pet.params.id))
	{
		models.Consola.findById(pet.params.id).then(function(cat){

			if(cat==null)
			{			
				resp.status(404).send("Error 404: El producto al que intenta acceder no existe");
			}
			else
			{
				return cat.getJuegos({

				//el elemento por el que empezamos
					offset: ((pet.query.page-1)*juegosPorPag),
					limit: juegosPorPag
				}).then(function(results){
					models.Juego.count({where: {ConsolaId: pet.params.id}}).then(function(cantidad){
						var url = "http://localhost:3000/api/consolas/"+pet.params.id+"/juegos";

						paginado.comprobarPaginado(url, pet, cantidad, juegosPorPag);

						if(paginado.error()==true)
						{
							return resp.status(404).send("Recurso no encontrado").end();
						}
						else
						{

							var self = paginado.self();
							var prev = paginado.prev();
							var next = paginado.next();
							var last = paginado.last();

							resp.status(200).send({
								_links: {
									self: {
										href: self
									},
									first: {
										href: url
									},
									prev: {
										href: prev
									},
									next: {
										href: next
									},
									last: {
										href: last
									}
								},
								count: results.length,
								total: cantidad,
								data: results
							});
						}
					});
				});
			}

		})
	}
	else
	{
		resp.status(400).send("Error 400: El id proporcionado no es un numero");
	}
});

module.exports = router;