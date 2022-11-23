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

// setup annee model and its fields.
var annee = sequelize.define('annees', {
    id: {
        type: Sequelize.INTEGER,
        unique: true,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
	annee: {
        type: Sequelize.INTEGER,
        unique: false,
        allowNull: true, 
        
    },
	selected: {
        type: Sequelize.INTEGER,
        unique: false,
        allowNull: true, 
        defaultValue: 0 
        
    },
}, { timestamps: false }); 

// create all the defined tables in the specified database.
sequelize.sync()
    .then(() => {
        console.log('annees table has been successfully created, if one doesn\'t exist')
        annee.findAll().then(function (r) {
            if (r.length == 0) {
                annee.bulkCreate([{annee:2022},{annee:2023}]).then(() => {}).catch((error) => {
                    return res.status(403).send(false);
                });
            }
        });
    })
    .catch(error => console.log('This error occured', error));

// export annee model for use in other files.
module.exports = annee;