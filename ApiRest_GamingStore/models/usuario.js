'use strict';

module.exports = function(sequelize, DataTypes) {

	var Usuario = sequelize.define('Usuario', {
		email: {type: DataTypes.STRING, allowNull: false, unique: true},
		nombre: DataTypes.STRING,
		apellidos: DataTypes.STRING,
		direccion: DataTypes.STRING,
		avatar: DataTypes.STRING
	}, {
			classMethods: {
	         associate: function(models) {
				Usuario.belongsToMany(models.Juego, {through: 'UsuarioJuego'})
	         }
	       }
	}, {
			name: {singular: 'Usuario', plural: 'Usuarios'}
	});

	return Usuario;
}
