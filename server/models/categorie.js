var Sequelize = require('sequelize');
var configuration = require("../config")
var cat = require("./categorie");
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

// setup categorie model and its fields.
var categorie = sequelize.define('categories', {
    id: {
        type: Sequelize.INTEGER,
        unique: true,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
	nom: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: true, 
        
    },
	pourcent: {
        type: Sequelize.FLOAT,
        unique: false,
        allowNull: true, 
        
    },
    parent: {
        type: Sequelize.INTEGER,
        unique: false,
        allowNull: true, 
        defaultValue: 0
    },
    etat: {
        type: Sequelize.INTEGER,
        unique: false,
        allowNull: true, 
        defaultValue: 1 
    },
}, { timestamps: false });

// create all the defined tables in the specified database.
sequelize.sync()
    .then(() => console.log('categories table has been successfully created, if one doesn\'t exist'))
    .catch(error => console.log('This error occured', error));

// export categorie model for use in other files.
module.exports = categorie;