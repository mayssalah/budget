var Sequelize = require('sequelize');
var user  = require("./user");
var user_sujet  = require("./user_sujet");
var sujet  = require("./sujet");
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
var sujet_equipe = sequelize.define('sujet_equipes', {
    id: {
        type: Sequelize.INTEGER,
        unique: true,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    id_equipe: {
        type: Sequelize.INTEGER,
        unique: false,
        allowNull: true,
        references: {
            model: user,
            key: "id"
        }
    },
    id_sujet: {
        type: Sequelize.INTEGER,
        unique: false,
        allowNull: true,
        references: {
            model: sujet,
            key: "id"
        }
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
    etat: {
        type: Sequelize.INTEGER,
        unique: false,
        allowNull: true, 
        defaultValue: 1
    },
    
}); 

sujet_equipe.belongsTo(user, {as: 'users', foreignKey: 'id_equipe'});

sujet_equipe.belongsTo(sujet, {as: 'sujets', foreignKey: 'id_sujet'});

sujet_equipe.belongsTo(user_sujet, {as: 'user_sujets', foreignKey: 'id_user_sujet'});

// create all the defined tables in the specified database 
sequelize.sync()
    .then(() => console.log('sujet_equipes table has been successfully created, if one doesn\'t exist'))
    .catch(error => console.log('This error occured', error));

// export User model for use in other files. 
module.exports = sujet_equipe;