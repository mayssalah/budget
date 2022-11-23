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

// setup groupe_budget model and its fields.
var groupe_budget = sequelize.define('groupe_budgets', {
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
	etat: {
        type: Sequelize.INTEGER,
        unique: false,
        allowNull: true, 
        defaultValue: 1 
        
    },
    type: {
        type: Sequelize.INTEGER,
        unique: false,
        allowNull: true, 
        defaultValue: 0
        
    },
    annee: {
        type: Sequelize.INTEGER,
        unique: false,
        allowNull: true, 
        defaultValue: 0
        
    },
	revenu: {
        type: Sequelize.DOUBLE,
        allowNull: true, 
        defaultValue: 0
        
    },
     
    include: {
        type: Sequelize.INTEGER,
        unique: false,
        defaultValue: 0
         
    },
}, { timestamps: true }); 

// create all the defined tables in the specified database.
sequelize.sync()
    .then(() => {
        console.log('groupe_budget table has been successfully created, if one doesn\'t exist')

    })
    .catch(error => console.log('This error occured', error));

// export annee model for use in other files.
module.exports = groupe_budget;