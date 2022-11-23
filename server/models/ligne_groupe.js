var Sequelize = require('sequelize');
var sell  = require("./sell");
var user_sujet  = require("./user_sujet");
var groupe  = require("./groupe");
var theme  = require("./theme");
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
var ligne_groupe = sequelize.define('ligne_groupes', {
    id: {
        type: Sequelize.INTEGER,
        unique: true,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
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
    id_user_sujet: {
        type: Sequelize.INTEGER,
        unique: false,
        allowNull: true,
        references: {
            model:user_sujet,
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
    id_theme: {
        type: Sequelize.INTEGER,
        unique: false,
        allowNull: true,
        references: {
            model: theme,
            key: "id"
        }
    },
   
}, { timestamps: true }); 

ligne_groupe.belongsTo(groupe, {as: 'groupes', foreignKey: 'id_groupe'});

ligne_groupe.belongsTo(theme, {as: 'themes', foreignKey: 'id_theme'});

ligne_groupe.belongsTo(sell, {as: 'sells', foreignKey: 'id_sell'});

ligne_groupe.belongsTo(user_sujet, {as: 'user_sujets', foreignKey: 'id_user_sujet'});

// create all the defined tables in the specified database.
sequelize.sync()
    .then(() => console.log('ligne_groupes table has been successfully created, if one doesn\'t exist'))
    .catch(error => console.log('This error occured', error));

// export User model for use in other files. 
module.exports = ligne_groupe;