var express = require('express');

var aqui, anterior, siguiente, ultima, fallo;
var urlpage="?page=";
var pag;
var ultimaPagina;

exports.comprobarPaginado = function(url, pet, cantidad, numItems) {
	

	//no podemos estar en una pagina mayor al numero maximo de paginas
	if(pet.query.page>(parseInt(cantidad/numItems) +1))
	{
		fallo=true;
		return fallo;
	}

	//si no se especifica pagina estamos en la primera
	if(pet.query.page==undefined)
	{
		pag = 1;
		aqui = url;
	} 
	else 
	{
		pag = parseInt(pet.query.page);
		aqui = url + urlpage + pag;
	}

	//si nos quedamos en una sola pagina
	if(cantidad==0)
	{
		aqui = url;
		anterior = "";
		siguiente = "";
		ultima = url;
		return;
	} 
	else if(cantidad<numItems)
	{
		ultima = url;
		siguiente = "";
		anterior = "";
	} 
	else 
	{
		//hay contemplar tambien si la ultima pagina se queda incompleta
		if(cantidad%numItems!=0)
		{
			ultimaPagina = Math.floor(cantidad/numItems)+1
			ultima = url + urlpage + ultimaPagina;
		}
		else
		{
			ultimaPagina = Math.floor(cantidad/numItems);
			ultima = url + urlpage + ultimaPagina;
		}

		//si es la primera no hay previa
		if(pag==1)
		{
			anterior = "";
		}
		else if(pag==2)
		{
			anterior = url;
		}
		else
		{
			anterior = url + urlpage + (pag - 1);
		}

		//si la pagina es la ultima a next le ponemos provisionalmente el ultimo numero
		if(pag==ultimaPagina)
		{
			siguiente = "";
		}
		else
		{
			siguiente= url + urlpage + (pag + 1);
		}
	}
}

exports.self = function() {
	return aqui;
}

exports.prev = function() {
	return anterior;
}

exports.next = function() {
	return siguiente;
}

exports.last = function() {
	return ultima;
}

exports.error = function() {
	var result = fallo;
	fallo = false;
	return result;
}