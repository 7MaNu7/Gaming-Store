var models  = require('../models');
var express = require('express');
var router  = express.Router();
var checkAuth = require('./checkAuth');
var checkAdminAuth = require('./checkAdminAuth');

var paginado = require('./paginado');

var juegosPorPag = 4;

router.get('/', function(pet, resp){

	//solo permitimos que no haya page si es la peticion estandar
	if(pet.query.page==undefined && pet.url!='/')
	{
		return resp.status(400).send("Falta el parametro page").end();
	}

	//hacemos findAll paginado
	models.Juego.findAll({
		//el elemento por el que empezamos
		offset: ((pet.query.page-1)*juegosPorPag),
		limit: juegosPorPag
	}).then(function(results){
		models.Juego.count().then(function(cantidad){
			var url = "http://localhost:3000/api/juegos";

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
})

router.post('/', checkAdminAuth.checkAdminAuth, function(pet, resp){

	if(pet.body.ConsolaId==null || pet.body.ConsolaId=="")
	{
		resp.status(400).send("Error 400: Un producto debe tener una consola asociada (ConsolaId)")
	}
	else if(isNaN(pet.body.ConsolaId))
	{
		resp.status(400).send("El id de la consola no es numerico")
	}
	else
	{

		models.Juego.findById(pet.body.ConsolaId).then(function(cat){

			if(cat==null)
			{			
				resp.status(404).send("Error 404: La consola que intenta asignar no existe");
			}
			else
			{
				if(pet.body.nombre==null || pet.body.nombre=="")
				{
					resp.status(400).send("Error 400: Debes especificar el nombre del juego");
				}
				else if(isNaN(pet.body.nota) || pet.body.nota==null || pet.body.nota=="")
				{
					resp.status(400).send("Error 400: Debes introducir una nota numerica entre 0 y 10");
				}
				else if(pet.body.precioDespues==null || pet.body.precioDespues=="")
				{
					resp.status(400).send("Error 400: Debes especificar el precio actual del juego");
				}
				else if(isNaN(pet.body.precioAntes) || isNaN(pet.body.precioDespues))
				{
					resp.status(400).send("Error 400: El precio especificado debe ser numerico");
				}
				else if(pet.body.nota<0 || pet.body.nota>10)
				{
					resp.status(400).send("Error 400: Debes escoger una nota entre 0 y 10");
				}
				else
				{
					models.Juego.create({
						nombre: pet.body.nombre,
						descripcion: pet.body.descripcion,
						genero: pet.body.genero,
						portada: pet.body.portada,
						ConsolaId: pet.body.ConsolaId,
						precioAntes: pet.body.precioAntes,
						precioDespues: pet.body.precioDespues,
						nota: pet.body.nota 
					}).then(function(juego){
						resp.location('/api/juegos/' + juego.id)
						resp.status(201).send();
					});
				}
			}

		});
	}
});

router.put('/:id', checkAdminAuth.checkAdminAuth, function(pet, resp){


	if(!isNaN(pet.params.id))
	{
//		console.log(pet.body);
		if(pet.body.nombre==null || pet.body.nombre=="")
		{
			resp.status(400).send("Error 400: Debes especificar el nombre del juego");
		}
		else if(isNaN(pet.body.nota) || pet.body.nota==null || pet.body.nota=="")
		{
			resp.status(400).send("Error 400: Debes introducir una nota numerica entre 0 y 10");
		}
		else if(pet.body.precioDespues==null || pet.body.precioDespues=="")
		{
			resp.status(400).send("Error 400: Debes especificar el precio actual del juego");
		}
		else if(isNaN(pet.body.precioAntes) || isNaN(pet.body.precioDespues))
		{
			resp.status(400).send("Error 400: El precio especificado debe ser numerico");
		}
		else if(pet.body.nota<0 || pet.body.nota>10)
		{
			resp.status(400).send("Error 400: Debes escoger una nota entre 0 y 10");
		}
		else
		{
			var values = {nombre: pet.body.nombre, descripcion: pet.body.descripcion, genero: pet.body.genero, portada: pet.body.portada, precioAntes: pet.body.precioAntes, precioDespues: pet.body.precioDespues, nota: pet.body.nota};
			var index = { where: {id: pet.params.id} };

			models.Juego.update(values, index).then(function(result){

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

		models.Juego.destroy(index).then(function(result){

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
		models.Juego.findById(pet.params.id).then(function(result){

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
						href: "http://localhost:3000/api/juegos/"+pet.params.id },
					{   rel: "consola",
						href: "http://localhost:3000/api/consolas/"+result.ConsolaId },
					{	rel: "relacionados",
						href: "http://localhost:3000/api/consolas/"+result.ConsolaId+"/juegos" }
					]
				});
				//resp.status(200).send(result);
			}
		});
	}
	else
	{
		resp.status(400).send("Error 400: El id proporcionado no es un numero");
	}
})

module.exports = router;