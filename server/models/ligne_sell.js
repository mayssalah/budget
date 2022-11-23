var Sequelize = require('sequelize');
var sell  = require("./sell");
var sujet  = require("./sujet");
var arborecence  = require("./arborecence");
var configuration = require("../config");
var produit = require('./produit');
var categorie = require('./categorie');
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
var ligne_sell = sequelize.define('ligne_sells', {
    id: {
        type: Sequelize.INTEGER,
        unique: true,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
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
    id_categorie: {
        type: Sequelize.INTEGER,
        unique: false,
        allowNull: true,
        references: {
            model: categorie,
            key: "id"
        }
    },
    id_produit: {
        type: Sequelize.INTEGER,
        unique: false,
        allowNull: true,
        references: {
            model: produit,
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
    total: {
        type: Sequelize.DOUBLE,
        unique: false,
        defaultValue: 0
    },
    /*** */
    qte_jan: {
        type: Sequelize.INTEGER,
        unique: false,
        defaultValue: 0
    },
    qte_feb: {
        type: Sequelize.INTEGER,
        unique: false,
        defaultValue: 0
    },
    qte_mars: {
        type: Sequelize.INTEGER,
        unique: false,
        defaultValue: 0
    },
    qte_apr: {
        type: Sequelize.INTEGER,
        unique: false,
        defaultValue: 0
    },
    qte_mai: {
        type: Sequelize.INTEGER,
        unique: false,
        defaultValue: 0
    },
    qte_juin: {
        type: Sequelize.INTEGER,
        unique: false,
        defaultValue: 0
    },
    qte_july: {
        type: Sequelize.INTEGER,
        unique: false,
        defaultValue: 0
    },
    qte_aug: {
        type: Sequelize.INTEGER,
        unique: false,
        defaultValue: 0
    },
    qte_sep: {
        type: Sequelize.INTEGER,
        unique: false,
        defaultValue: 0
    },
    qte_oct: {
        type: Sequelize.INTEGER, 
        unique: false,
        defaultValue: 0
    },
    qte_nov: {
        type: Sequelize.INTEGER,
        unique: false,
        defaultValue: 0
    },
    qte_dec: {
        type: Sequelize.INTEGER,
        unique: false,
        defaultValue: 0
    },
    qte: {
        type: Sequelize.INTEGER,
        unique: false,
        defaultValue: 0
    }
}); 

ligne_sell.belongsTo(categorie, {as: 'categories', foreignKey: 'id_categorie'});
ligne_sell.belongsTo(produit, {as: 'produits', foreignKey: 'id_produit'});
ligne_sell.belongsTo(sell, {as: 'sells', foreignKey: 'id_sell'});

// create all the defined tables in the specified database. 
sequelize.sync()
    .then(() => console.log('ligne_sell table has been successfully created, if one doesn\'t exist'))
    .catch(error => console.log('This error occured', error));

// export User model for use in other files. 
module.exports = ligne_sell;