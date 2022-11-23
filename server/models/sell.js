var Sequelize = require('sequelize');
var pays  = require("./pays");
var groupe_budget  = require("./groupe_budget");
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
var sell = sequelize.define('sells', {
    id: {
        type: Sequelize.INTEGER,
        unique: true,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    id_pays: {
        type: Sequelize.INTEGER,
        unique: false,
        allowNull: true,
        references: {
            model: pays,
            key: "id"
        }
    },
    annee: {
        type: Sequelize.INTEGER,
        unique: false, 
    },
    titre: {
        type: Sequelize.STRING,
        unique: false,
    },
    type: {
        type: Sequelize.INTEGER,
        unique: false, 
    },
    total: {
        type: Sequelize.DOUBLE,
        unique: false, 
    },
    etat: {
        type: Sequelize.INTEGER,
        unique: false,
        defaultValue: 1 
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

sell.belongsTo(pays, {as: 'pays', foreignKey: 'id_pays'});
sell.belongsTo(groupe_budget, {as: 'groupe_budgets', foreignKey: 'id_groupe'});

// create all the defined tables in the specified database.
sequelize.sync()
    .then(() => console.log('sell table has been successfully created, if one doesn\'t exist'))
    .catch(error => console.log('This error occured', error));

// export User model for use in other files. 
module.exports = sell;