var models  = require('../models');
var express = require('express');
var router  = express.Router();

router.get('/', function(pet, res){
	res.send("Hola soy express!");
});

module.exports = router;