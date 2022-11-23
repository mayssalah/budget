var Sequelize = require('sequelize');
var groupe  = require("./groupe");
var sell  = require("./sell");
var theme  = require("./theme");
var user_sujet  = require("./user_sujet");
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
var forecast = sequelize.define('forecasts', {
    id: {
        type: Sequelize.INTEGER,
        unique: true,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    id_theme: {
        type: Sequelize.INTEGER,
        unique: false,
        allowNull: true,
        references: {
            model: theme,
            key: "id"
        }
    },
    id_sell: {
        type: Sequelize.INTEGER,
        unique: false,
        allowNull: true,
        references: {
            model: sell,
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
    id_groupe: {
        type: Sequelize.INTEGER,
        unique: false,
        allowNull: true,
        references: {
            model: groupe,
            key: "id"
        }
    },
    forecast: {
        type: Sequelize.INTEGER,
        unique: false, 
        defaultValue: 0
    },
    actual: {
        type: Sequelize.INTEGER,
        unique: false,         
        defaultValue: 0 
    },
    forecastdis: {
        type: Sequelize.INTEGER,
        unique: false, 
        defaultValue: 0
    },
    actualdis: {
        type: Sequelize.INTEGER,
        unique: false,         
        defaultValue: 0 
    },
    forecastrev: {
        type: Sequelize.INTEGER,
        unique: false, 
        defaultValue: 0
    },
    actualrev: {
        type: Sequelize.INTEGER,
        unique: false,         
        defaultValue: 0 
    },
    etat: {
        type: Sequelize.INTEGER,
        unique: false,
        defaultValue: 1 
    },
    
}, { timestamps: false }); 

forecast.belongsTo(groupe, {as: 'groupes', foreignKey: 'id_groupe'});

forecast.belongsTo(sell, {as: 'sells', foreignKey: 'id_sell'});

forecast.belongsTo(theme, {as: 'themes', foreignKey: 'id_theme'});

forecast.belongsTo(user_sujet, {as: 'user_sujets', foreignKey: 'id_user_sujet'});

// create all the defined tables in the specified database. 
sequelize.sync()
    .then(() => console.log('forecast table has been successfully created, if one doesn\'t exist'))
    .catch(error => console.log('This error occured', error));

// export User model for use in other files. 
module.exports = forecast;