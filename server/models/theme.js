var Sequelize = require('sequelize');
var user  = require("./user");
var sujet  = require("./sujet");
var configuration = require("../config");
var groupe_budget  = require("./groupe_budget");

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
var theme = sequelize.define('themes', {
    id: {
        type: Sequelize.INTEGER,
        unique: true,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    titre: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: true,
    },
    etat: {
        type: Sequelize.INTEGER,
        unique: false,
        allowNull: true, 
        defaultValue: 0 
    },
    annee: {
        type: Sequelize.INTEGER,
        unique: false, 
    },
    total: {
        type: Sequelize.FLOAT,
        unique: false, 
    },
    ordre: {
        type: Sequelize.INTEGER,
        allowNull: true, 
        defaultValue: 0
    },
    id_groupe: {
        type: Sequelize.INTEGER,
        unique: false,
        allowNull: true,
        references: {
            model: groupe_budget,
            key: "id"
        }
    },
}); 

theme.belongsTo(groupe_budget, {as: 'groupe_budgets', foreignKey: 'id_groupe'});
// create all the defined tables in the specified database.
sequelize.sync()
    .then(() => console.log('themes table has been successfully created, if one doesn\'t exist'))
    .catch(error => console.log('This error occured', error));

// export User model for use in other files. 
module.exports = theme;