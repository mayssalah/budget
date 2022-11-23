var Sequelize = require('sequelize');
var equipe  = require("./equipe");
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
var user_equipe = sequelize.define('user_equipes', {
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
            model: equipe,
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

user_equipe.belongsTo(equipe, {as: 'equipes', foreignKey: 'id_equipe'});

// create all the defined tables in the specified database.
sequelize.sync()
    .then(() => console.log('user_equipes table has been successfully created, if one doesn\'t exist'))
    .catch(error => console.log('This error occured', error));

// export User model for use in other files. 
module.exports = user_equipe;