var Sequelize = require('sequelize');
var configuration = require("../config");
var type  = require("./type");
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
var sujet = sequelize.define('sujets', {
    id: {
        type: Sequelize.INTEGER,
        unique: true,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    num: {
        type: Sequelize.STRING,
        unique: false,
    },
    sujet: {
        type: Sequelize.STRING,
        unique: false,
    },
    etat: {
        type: Sequelize.INTEGER,
        unique: false,
        allowNull: true, 
        defaultValue: 1 
    },
    id_type: {
        type: Sequelize.INTEGER,
        unique: false,
        allowNull: true,
        references: {
            model: type,
            key: "id"
        }
    },
    
});

sujet.belongsTo(type, {as: 'types', foreignKey: 'id_type'});
// create all the defined tables in the specified database.
sequelize.sync()
    .then(() => console.log('sujets table has been successfully created, if one doesn\'t exist'))
    .catch(error => console.log('This error occured', error));

// export User model for use in other files. 
module.exports = sujet;