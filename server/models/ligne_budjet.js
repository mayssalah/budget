var Sequelize = require('sequelize');
var budjet  = require("./budjet");
var sujet  = require("./sujet");
var arborecence  = require("./arborecence");
var configuration = require("../config");
const user = require('./user');
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
var ligne_budjet = sequelize.define('ligne_budjets', {
    id: {
        type: Sequelize.INTEGER,
        unique: true,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    id_budjet: {
        type: Sequelize.INTEGER,
        unique: false,
        allowNull: true,
        references: {
            model: budjet,
            key: "id"
        }
    },
    id_arborecence: {
        type: Sequelize.INTEGER,
        unique: false,
        allowNull: true,
        references: {
            model: arborecence,
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
    jan: {
        type: Sequelize.DOUBLE,
        unique: false,
        defaultValue: 0
    },
    feb: {
        type: Sequelize.DOUBLE,
        unique: false,
        defaultValue: 0
    },
    mars: {
        type: Sequelize.DOUBLE,
        unique: false,
        defaultValue: 0
    },
    q1: {
        type: Sequelize.DOUBLE,
        unique: false,
        defaultValue: 0
    },
    apr: {
        type: Sequelize.DOUBLE,
        unique: false,
        defaultValue: 0
    },
    mai: {
        type: Sequelize.DOUBLE,
        unique: false,
        defaultValue: 0
    },
    juin: {
        type: Sequelize.DOUBLE,
        unique: false,
        defaultValue: 0
    },
    q2: {
        type: Sequelize.DOUBLE,
        unique: false,
        defaultValue: 0
    },
    july: {
        type: Sequelize.DOUBLE,
        unique: false,
        defaultValue: 0
    },
    aug: {
        type: Sequelize.DOUBLE,
        unique: false,
        defaultValue: 0
    },
    sep: {
        type: Sequelize.DOUBLE,
        unique: false,
        defaultValue: 0
    },
    q3: {
        type: Sequelize.DOUBLE,
        unique: false,
        defaultValue: 0
    },
    oct: {
        type: Sequelize.DOUBLE, 
        unique: false,
        defaultValue: 0
    },
    nov: {
        type: Sequelize.DOUBLE,
        unique: false,
        defaultValue: 0
    },
    dec: {
        type: Sequelize.DOUBLE,
        unique: false,
        defaultValue: 0
    },
    q4: {
        type: Sequelize.DOUBLE,
        unique: false,
        defaultValue: 0
    },
    total: {
        type: Sequelize.DOUBLE,
        unique: false,
        defaultValue: 0
    },
    commentaire: {
        type: Sequelize.TEXT,
        unique: false,
    },
    anneePrec: {
        type: Sequelize.DOUBLE,
        unique: false,
        defaultValue: 0
    },
    
}); 

ligne_budjet.belongsTo(sujet, {as: 'sujets', foreignKey: 'id_sujet'});
ligne_budjet.belongsTo(arborecence, {as: 'arborecences', foreignKey: 'id_arborecence'});
ligne_budjet.belongsTo(budjet, {as: 'budjets', foreignKey: 'id_budjet'});

// create all the defined tables in the specified database. 
sequelize.sync()
    .then(() => console.log('ligne_budjet table has been successfully created, if one doesn\'t exist'))
    .catch(error => console.log('This error occured', error));

// export User model for use in other files. 
module.exports = ligne_budjet;