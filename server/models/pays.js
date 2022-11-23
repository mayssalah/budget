var Sequelize = require('sequelize');
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

// setup pays model and its fields.
var pays = sequelize.define('pays', {
    id: {
        type: Sequelize.INTEGER,
        unique: true,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    code: {
        type: Sequelize.INTEGER,
        allowNull: true,        
    },	
    nom: {
        type: Sequelize.STRING,
        allowNull: true,        
    },
	nom_en: {
        type: Sequelize.STRING,
        allowNull: true,        
    },	
	alpha2: {
        type: Sequelize.STRING,
        allowNull: true,        
    },
	alpha3: {
        type: Sequelize.STRING,
        allowNull: true,        
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
    .then(() => console.log('pays table has been successfully created, if one doesn\'t exist'))
    .catch(error => console.log('This error occured', error));

// export pays model for use in other files.
module.exports = pays;