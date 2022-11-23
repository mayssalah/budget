var Sequelize = require('sequelize');
var user_sujet  = require("./user_sujet");
var sujet  = require("./sujet");
var user  = require("./user");
var configuration = require("../config")
var config = configuration.connection;
	
// create a sequelize instance with our local postgres database information. 
const sequelize = new Sequelize(config.base, config.root, config.password, {
	host:config.host,
	port: config.port,
	dialect:'mysql',
	pool:{
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 10000
	}, 
	operatorsAliases: false
});

// setup User model and its fields.
var ligne_sujet = sequelize.define('ligne_sujets', {
    id: {
        type: Sequelize.INTEGER,
        unique: true,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    id_user_sujet: {
        type: Sequelize.INTEGER,
        unique: false,
        allowNull: true,
        references: {
            model: user_sujet,
            key: "id"
        }
    },
    id_sujet: {
        type: Sequelize.INTEGER,
        unique: false,
        allowNull: true,
        references: {
            model:sujet,
            key: "id"
        }
    },
    id_equipe: {
        type: Sequelize.INTEGER,
        unique: false,
        allowNull: true,
        references: {
            model:user,
            key: "id"
        }
    },
}); 

ligne_sujet.belongsTo(sujet, {as: 'sujets', foreignKey: 'id_sujet'});

ligne_sujet.belongsTo(user, {as: 'users', foreignKey: 'id_equipe'});

ligne_sujet.belongsTo(user_sujet, {as: 'user_sujets', foreignKey: 'id_user_sujet'}); 

// create all the defined tables in the specified database.
sequelize.sync()
    .then(() => console.log('ligne_sujets table has been successfully created, if one doesn\'t exist'))
    .catch(error => console.log('This error occured', error));

// export User model for use in other files. 
module.exports = ligne_sujet;