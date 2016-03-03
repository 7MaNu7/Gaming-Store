var models  = require('../models');
var express = require('express');
var router  = express.Router();

router.post('/', function(pet, resp) {

	if(pet.body.login==null || pet.body.password==null)
	{
		resp.status(400).send("Error 400: Es necesario enviar login y password");
	}
	else if(pet.body.login=="usuario" && pet.body.password=="123456")
	{
		resp.status(200).send("normal");
	}
	else if(pet.body.login=="admin" && pet.body.password=="admin")
	{
		resp.status(200).send("admin");
	}
	else
	{
		resp.status(403).send("Error: No existe esa combinacion de login y password")
	}
});

module.exports = router;