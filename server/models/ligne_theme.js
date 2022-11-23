var Sequelize = require('sequelize');
var user  = require("./user");
var sujet  = require("./sujet");
var theme  = require("./theme");
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
var ligne_theme = sequelize.define('ligne_themes', {
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
    id_user: {
        type: Sequelize.INTEGER,
        unique: false,
        allowNull: true,
        references: {
            model: user,
            key: "id"
        }
    },
    id_sujet: {
        type: Sequelize.INTEGER,
        unique: false,
        allowNull: true,
        references: {
            model:sujet,
            key: "id"
        }
    },     
    id_groupe_budget: {
        type: Sequelize.INTEGER,
        unique: false,
        allowNull: true,
        references: {
            model:groupe_budget,
            key: "id"
        }
    },
}); 

ligne_theme.belongsTo(theme, {as: 'themes', foreignKey: 'id_theme'});
ligne_theme.belongsTo(sujet, {as: 'sujets', foreignKey: 'id_sujet'});
ligne_theme.belongsTo(user, {as: 'users', foreignKey: 'id_user'});
ligne_theme.belongsTo(groupe_budget, {as: 'groupe_budgets', foreignKey: 'id_groupe_budget'});

// create all the defined tables in the specified database.
sequelize.sync()
    .then(() => console.log('ligne_themes table has been successfully created, if one doesn\'t exist'))
    .catch(error => console.log('This error occured', error));

// export User model for use in other files. 
module.exports = ligne_theme;