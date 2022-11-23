var Sequelize = require('sequelize');
var bcrypt = require('bcrypt');
var Role  = require("./role");
var type  = require("./type");
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
var User = sequelize.define('users', {
    id: {
        type: Sequelize.INTEGER,
        unique: true,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
	nom_prenom: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: true
    },
	login: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: false
    },
	email: {
        type: Sequelize.STRING, 
        unique: false,
        allowNull: true
    },
	tel: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: true
    },
    id_role: {
        type: Sequelize.INTEGER,
        unique: false,
        allowNull: true,
        references: {
            model: Role,
            key: "id"
        }
    },
    password:{
        type: Sequelize.STRING,
        unique: false,
        allowNull: true
    },
    etat: {
        type: Sequelize.INTEGER,
        unique: false,
        allowNull: true, 
        defaultValue: 1 
    },
    token: {
        type: Sequelize.TEXT,
        unique: false,
        allowNull: true,
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
    
}, { timestamps: false }); 

User.belongsTo(Role, {as: 'roles', foreignKey: 'id_role'});
User.belongsTo(type, {as: 'types', foreignKey: 'id_type'});

User.beforeCreate((user, options) => {
	const salt = bcrypt.genSaltSync();
	user.password = bcrypt.hashSync(user.password, salt);
});
  
 
User.prototype.validPassword = function(password) {
        return bcrypt.compareSync(password, this.password);
      }; 

// create all the defined tables in the specified database.
sequelize.sync()
    .then(() => console.log('users table has been successfully created, if one doesn\'t exist'))
    .catch(error => console.log('This error occured', error));

/* User.findAll().then(function (u) {
    if (u.length == 0) {
        User.create({
            nom_prenom: "admin",
            login: "admin",
            email: 'admin@admin.com',
            tel: 0,
            id_role: 1,
            password: '26411058mk',
            etat: 1,
            token:null
        })
    }
}); */

// export User model for use in other files. 
module.exports = User;