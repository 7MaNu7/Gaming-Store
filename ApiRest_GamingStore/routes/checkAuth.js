var express = require('express');

//en nuestro caso la autentificacion sera usuario: usuario / password: 123456 siempre de este modo
var secret = 'Basic dXN1YXJpbzoxMjM0NTY=';


exports.checkAuth = function(pet, res, next)
{
	var auth = pet.get('Authorization');

	//si no hay auth pedimos que se autentifique
	if(auth==null)
	{
		res.status(401);
		res.set('WWW-Authenticate', 'Basic realm="myrealm"');
		return res.send("Error 401: Requiere autentificacion");
	}

	//si trata de autentificarse pero es erroneo 403
	if(auth!=secret)
	{
		res.status(403);
		return res.send("Error 403: Permiso denegado");
	}
	
	next();
}
