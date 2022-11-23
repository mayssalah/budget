var Sequelize = require('sequelize');
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
var arborecence = sequelize.define('arborecence', {
    id: {
        type: Sequelize.INTEGER,
        unique: true,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
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
    num: {
        type: Sequelize.STRING,
        unique: false,
    },
    description: {
        type: Sequelize.STRING,
        unique: false,
    },
    etat: {
        type: Sequelize.INTEGER,
        unique: false,
        allowNull: true, 
        defaultValue: 1 
    },
    
}); 

arborecence.belongsTo(sujet, {as: 'sujets', foreignKey: 'id_sujet'});

// create all the defined tables in the specified database.
sequelize.sync()
    .then(() => console.log('arborecence table has been successfully created, if one doesn\'t exist'))
    .catch(error => console.log('This error occured', error));

// export User model for use in other files. 
module.exports = arborecence;