var models  = require('../models');
var express = require('express');
var router  = express.Router();
var checkAuth = require('./checkAuth');
var checkBothAuth = require('./checkBothAuth');
var checkAdminAuth = require('./checkAdminAuth');

var paginado = require('./paginado');

var usuariosPorPag = 4;

router.get('/', checkAdminAuth.checkAdminAuth, function(pet, resp){
	models.Usuario.findAll({

	//el elemento por el que empezamos
		offset: ((pet.query.page-1)*usuariosPorPag),
		limit: usuariosPorPag
	}).then(function(results){
		models.Usuario.count().then(function(cantidad){
			var url = "http://localhost:3000/api/usuarios";

			paginado.comprobarPaginado(url, pet, cantidad, usuariosPorPag);

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

router.post('/', function(pet, resp){


	console.log("me meto en post");
	if(pet.body.email=="" || pet.body.email==null)
	{
		resp.status(400).send("Error 400: Se debe especificar un email");
		resp.end();
	}
	else if(pet.body.nombre=="" || pet.body.nombre==null || pet.body.apellidos==null || pet.body.apellidos=="")
	{
		resp.status(400).send("Error 400: Se debe especificar el nombre y apellidos");
		resp.end();
	}
	else
	{

		models.Usuario.findOne({
			where: {
				email: pet.body.email
			}
		}).then(function(user){

			if(user!=null && user!=undefined)
			{			
				resp.status(400).send("Error 400: El email proporcionado ya existe, escoja otro por favor");
				resp.end();
			}
			else
			{
				models.Usuario.create({
					email: pet.body.email,
					nombre: pet.body.nombre,
					apellidos: pet.body.apellidos,
					direccion: pet.body.direccion,
					avatar: pet.body.avatar
				}).then(function(usuario){
					resp.location('/api/usuarios/' + usuario.id)
					resp.status(201).send();
				});
			}
		});
	}
});

router.put('/:id', checkAuth.checkAuth, function(pet, resp){


	if(!isNaN(pet.params.id))
	{

		if(pet.body.nombre=="" || pet.body.nombre==null || pet.body.apellidos==null || pet.body.apellidos=="")
		{
			resp.status(400).send("Error 400: Se debe especificar el nombre y apellidos");
			resp.end();
		}
		else if(pet.body.direccion=="" || pet.body.direccion==null)
		{
			resp.status(400).send("Error 400: Se debe especificar la direccion de envio");
		}
		else
		{
			var values = {nombre: pet.body.nombre, apellidos: pet.body.apellidos, direccion: pet.body.direccion, avatar: pet.body.avatar};
			var index = { where: {id: pet.params.id} };

			models.Usuario.update(values, index).then(function(result){

				if(result==false)
				{
					resp.status(404).send("Error 404: El usuario que intenta modificar no existe");
				}
				else
				{
					resp.status(204).send("Usuario modificado correctamente");
				}
			});
		}

	}
	else
	{
		resp.status(400).send("Error 400: El id proporcionado no es un numero");
	}
});

router.delete('/:id', checkBothAuth.checkBothAuth, function(pet, resp){

	if(!isNaN(pet.params.id))
	{
		var index = { where: {id: pet.params.id} };

		models.Usuario.destroy(index).then(function(result){

			if(result==false)
			{
				resp.status(404).send("Error 404: El usuario que intenta borrar no existe");
			}
			else
			{
				resp.status(204).send("Usuario eliminado correctamente");
			}
		});
	}
	else
	{
		resp.status(400).send("Error 400: El id proporcionado no es un numero");
	}

})

router.get('/:id', checkAuth.checkAuth, function(pet, resp){

	if(!isNaN(pet.params.id))
	{
		models.Usuario.findById(pet.params.id).then(function(result){

			if(result==null)
			{			
				resp.status(404).send("Error 404: El usuario al que intenta acceder no existe");
			}
			else
			{		
				resp.status(200).send({
					data: result,
					links: [
					{   rel: "self",
						href: "http://localhost:3000/api/usuarios/"+pet.params.id },
					{   rel: "juegos comprados",
						href: "http://localhost:3000/api/usuarios/"+pet.params.id+"/juegos" },
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

//metodo para añadir un juego al historial de compras de un usuario (conociendo Ids -> put)
router.put('/:id/juegos/:juegoId', checkAuth.checkAuth, function(pet, resp){

	if(!isNaN(pet.params.id) && !isNaN(pet.params.juegoId))
	{
		models.Usuario.findById(pet.params.id).then(function(user){

			if(user==null)
			{
				resp.status(404).send("Error 404: El usuario con id "+pet.params.id+" no existe");
			}
			else
			{
				models.Juego.findById(pet.params.juegoId).then(function(game){

					if(game==null)
					{
						resp.status(404).send("Error 404: El juego con id "+pet.params.juegoId+" no existe");
					}
					else
					{
						user.addJuego(game)
						resp.status(204).send();
					}
				});
			}
		});
	}
	else
	{
		resp.status(400).send("Error 400: Los id proporcionados deben ser numericos");
	}

})

//obtencion historial de compras
router.get('/:id/juegos', checkAuth.checkAuth, function(pet, resp){

	if(!isNaN(pet.params.id))
	{
		models.Usuario.findById(pet.params.id).then(function(user){

			if(user==null)
			{			
				resp.status(404).send("Error 404: El usuario al que intenta acceder no existe");
			}
			else
			{		
				user.getJuegos().then(function(results){
					resp.status(200).send(results)
				});
			}
		});
	}
	else
	{
		resp.status(400).send("Error 400: El id proporcionado no es un numero");
	}
})

module.exports = router;